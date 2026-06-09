import { WILDFIRE_CONFIG } from './config';
import type { FuelModel, FuelMoisture, RiskBand, RiskScore, RothermelResult } from './types';

const RHO_P = 32;
const SE = 0.01;
const ETA_S = 0.174 * Math.pow(SE, -0.19);
const SAV_10H = 109;
const SAV_100H = 30;

function moistureDamping(mf: number, mx: number) {
  if (mf >= mx) return 0;
  const r = mf / mx;
  return Math.max(0, 1 - 2.59 * r + 5.11 * r * r - 3.52 * r * r * r);
}

function meanBulkDensity(w0: number[], depth: number) {
  const total = w0.reduce((a, b) => a + b, 0);
  return total / depth;
}

function characteristicSAV(sav: number[], w0: number[]) {
  let sw = 0;
  let s2w = 0;
  for (let i = 0; i < sav.length; i++) {
    if (w0[i] <= 0 || sav[i] >= 9999) continue;
    sw += sav[i] * w0[i];
    s2w += sav[i] * sav[i] * w0[i];
  }
  return sw > 0 ? s2w / sw : 1500;
}

function optimalPackingRatio(sigma: number) {
  return 3.348 * Math.pow(sigma, -0.8189);
}

function reactionVelocity(sigma: number, betaRatio: number) {
  const s15 = Math.pow(sigma, 1.5);
  const A = 133 / Math.pow(sigma, 0.7913);
  const gMax = s15 / (495 + 0.0594 * s15);
  return gMax * Math.pow(betaRatio, A) * Math.exp(A * (1 - betaRatio));
}

function propagatingFlux(sigma: number, beta: number) {
  return Math.exp((0.792 + 0.681 * Math.sqrt(sigma)) * (beta + 0.1)) / (192 + 0.2595 * sigma);
}

function heatSink(moisture: number[], sav: number[], w0: number[], rhoB: number) {
  let qigSum = 0;
  let swSum = 0;
  for (let i = 0; i < w0.length; i++) {
    if (w0[i] <= 0 || sav[i] >= 9999) continue;
    const eps = Math.exp(-138 / sav[i]);
    const qig = 250 + 1116 * (moisture[i] * 0.01);
    const sw = sav[i] * w0[i];
    qigSum += qig * eps * sw;
    swSum += sw;
  }
  return swSum > 0 ? rhoB * (qigSum / swSum) : 0;
}

function windParams(sigma: number) {
  return {
    C: 7.47 * Math.exp(-0.133 * Math.pow(sigma, 0.55)),
    B: 0.02526 * Math.pow(sigma, 0.54),
    E: 0.715 * Math.exp(-0.000359 * sigma),
  };
}

function windFactor(windFtMin: number, sigma: number, betaRatio: number) {
  const { C, B, E } = windParams(sigma);
  return C * Math.pow(Math.max(0, windFtMin), B) * Math.pow(betaRatio, -E);
}

function slopeFactor(slopeDeg: number, beta: number) {
  const tan = Math.tan((slopeDeg * Math.PI) / 180);
  return 5.275 * Math.pow(beta, -0.3) * tan * tan;
}

function midFlameWindAdj(depth: number) {
  if (depth <= 0) return 1;
  return Math.min(1, Math.max(0, 1.83 / Math.log((20 + 0.36 * depth) / (0.13 * depth))));
}

export function estimateMoisture(rh: number, tempF: number): FuelMoisture {
  const m1 = Math.max(2, Math.min(20, 2 + (100 - rh) * 0.12 + Math.max(0, tempF - 70) * 0.05));
  const m10 = Math.max(m1, m1 * 0.85 + 2);
  const m100 = Math.max(m10, m10 * 0.8 + 3);
  return { m1, m10, m100, herb: 60, stem: 90 };
}

export function runRothermel(
  fuel: FuelModel,
  moisture: FuelMoisture,
  windMph10m: number,
  slopeDeg: number,
): RothermelResult {
  if (fuel.nonBurnable) {
    return { nonBurnable: true, fuelCode: fuel.code, fuelName: fuel.name };
  }

  const w0 = fuel.loadLbFt2!.slice();
  const sav = fuel.sav!.slice();
  sav[1] = SAV_10H;
  sav[2] = SAV_100H;

  const m = [moisture.m1, moisture.m10, moisture.m100, moisture.herb, moisture.stem];
  const depth = Math.max(0.01, fuel.depth!);

  const rhoB = meanBulkDensity(w0, depth);
  const beta = Math.min(0.12, Math.max(0.0001, rhoB / RHO_P));
  const sigma = characteristicSAV(sav, w0);
  const betaOpt = optimalPackingRatio(sigma);
  const betaRatio = Math.max(0.01, beta / betaOpt);

  const deadLoad = w0[0] + w0[1] + w0[2];
  const deadM =
    deadLoad > 0 ? (w0[0] * m[0] + w0[1] * m[1] + w0[2] * m[2]) / deadLoad : m[0];
  const etaM = moistureDamping(deadM, fuel.mx!);
  const gamma = reactionVelocity(sigma, betaRatio);

  const netLoad = w0.reduce((a, b) => a + b, 0) / 1.0555;
  const heat = fuel.heatDead!;
  const ir = gamma * netLoad * heat * etaM * ETA_S;

  const xi = propagatingFlux(sigma, beta);
  const hsk = heatSink(m, sav, w0, rhoB);
  if (hsk <= 0 || ir <= 0) {
    return {
      nonBurnable: false,
      spreadFtPerMin: 0,
      spreadChainsPerHr: 0,
      flameLengthFt: 0,
      reactionIntensity: 0,
      fuelCode: fuel.code,
      fuelName: fuel.name,
      slopeDeg,
      windMph: windMph10m,
      moisture1h: m[0],
    };
  }

  const wind20 = windMph10m * 1.15;
  const windMid = wind20 * midFlameWindAdj(depth);
  const windFtMin = windMid * 88;
  const phiW = windFactor(windFtMin, sigma, betaRatio);
  const phiS = slopeFactor(Math.max(0, slopeDeg), beta);

  const ros = (ir * xi * (1 + phiW + phiS)) / hsk;
  const tau = 384 / sigma;
  const fzd = ros * tau;
  const intensity = (ir * fzd) / 60;
  const flameLen = 0.45 * Math.pow(Math.max(0, intensity), 0.46);

  return {
    nonBurnable: false,
    spreadFtPerMin: ros,
    spreadChainsPerHr: (ros * 60) / 66,
    flameLengthFt: flameLen,
    reactionIntensity: ir,
    fuelCode: fuel.code,
    fuelName: fuel.name,
    slopeDeg,
    windMph: windMph10m,
    moisture1h: m[0],
    etaM,
    phiW,
    phiS,
  };
}

function bandFromScore(total: number): RiskBand {
  if (total > 75) return 'Extreme';
  if (total > 50) return 'High';
  if (total > 25) return 'Moderate';
  return 'Low';
}

export function computeRiskScore(
  fire: RothermelResult,
  rh: number,
  windMph: number,
): RiskScore {
  const ros = fire.spreadChainsPerHr || 0;
  const flame = fire.flameLengthFt || 0;
  const rosScore = Math.min(100, (ros / WILDFIRE_CONFIG.scoreCaps.rosChainsPerHr) * 100);
  const flameScore = Math.min(100, (flame / WILDFIRE_CONFIG.scoreCaps.flameLengthFt) * 100);
  const slopePct = Math.tan(((fire.slopeDeg || 0) * Math.PI) / 180) * 100;
  const slopeScore = Math.min(100, (slopePct / WILDFIRE_CONFIG.scoreCaps.slopePercent) * 100);
  const weatherScore = Math.min(100, (100 - rh) * 0.4 + windMph * 2.5);

  const w = WILDFIRE_CONFIG.scoreWeights;
  const total = Math.round(
    w.ros * rosScore + w.flame * flameScore + w.slope * slopeScore + w.weather * weatherScore,
  );

  return {
    score: total,
    band: bandFromScore(total),
    subscores: {
      ros: { value: Math.round(rosScore), weight: w.ros, label: 'Spread rate' },
      flame: { value: Math.round(flameScore), weight: w.flame, label: 'Flame length' },
      slope: { value: Math.round(slopeScore), weight: w.slope, label: 'Slope' },
      weather: { value: Math.round(weatherScore), weight: w.weather, label: 'Weather stress' },
    },
  };
}
