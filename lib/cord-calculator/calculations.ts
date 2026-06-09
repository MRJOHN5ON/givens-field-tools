import {
  AVG_DAILY_HEATING_BTU_MILLIONS,
  CUBIC_INCHES_PER_CORD,
} from './constants';
import { getWoodSpecies } from './species';
import type {
  BtuEstimate,
  FirewoodLogState,
  LogCalculationResult,
  LogMetrics,
  WoodSpeciesId,
} from './types';
import {
  areLogDimensionsValid,
  parseNonNegativeDimension,
  parsePositiveDimension,
} from './validation';

/**
 * Frustum volume for a tapered log (matches givensfireandforestry.com calculator).
 * V = (1/3) * π * H * (Rb² + Rb*Rt + Rt²)
 * Diameters in inches, height in feet.
 */
export function calculateLogVolumeCubicInches(
  bottomDiameterIn: number,
  topDiameterIn: number,
  heightFt: number,
): number {
  const heightInches = heightFt * 12;
  const bottomRadius = bottomDiameterIn / 2;
  const topRadius = topDiameterIn / 2;

  return (
    (1 / 3) *
    Math.PI *
    heightInches *
    (bottomRadius ** 2 + bottomRadius * topRadius + topRadius ** 2)
  );
}

export function calculateCordsFromVolumeCubicInches(volumeCubicInches: number): number {
  return volumeCubicInches / CUBIC_INCHES_PER_CORD;
}

export function calculateLogMetrics(
  bottomDiameterIn: number,
  topDiameterIn: number,
  heightFt: number,
): LogMetrics {
  const volumeCubicInches = calculateLogVolumeCubicInches(
    bottomDiameterIn,
    topDiameterIn,
    heightFt,
  );
  const volumeCubicFeet = volumeCubicInches / 1728;
  const cords = calculateCordsFromVolumeCubicInches(volumeCubicInches);
  const faceCords = cords * 3;

  return {
    volumeCubicInches,
    volumeCubicFeet,
    cords,
    faceCords,
    dimensions: {
      bottomDiameterIn,
      topDiameterIn,
      heightFt,
    },
  };
}

export function calculateBtuEstimate(
  fullCords: number,
  speciesId: WoodSpeciesId,
): BtuEstimate {
  const species = getWoodSpecies(speciesId);
  const btusMillions = fullCords * species.btuPerCordMillions;

  return {
    btusMillions,
    btusAbsolute: btusMillions * 1_000_000,
    species: speciesId,
    heatingContext: formatHeatingContext(btusMillions),
  };
}

export function formatHeatingContext(btusMillions: number): string | null {
  if (btusMillions <= 0 || !Number.isFinite(btusMillions)) {
    return null;
  }

  const heatingDays = btusMillions / AVG_DAILY_HEATING_BTU_MILLIONS;
  if (heatingDays < 1) {
    return 'Roughly less than a day of home heating at average winter use.';
  }

  const roundedDays = Math.round(heatingDays);
  return `Roughly ${roundedDays} day${roundedDays === 1 ? '' : 's'} of home heating at average winter use.`;
}

export function calculateLogResult(log: FirewoodLogState): LogCalculationResult | null {
  const bottomDiameter = parseNonNegativeDimension(log.bottomDiameter);
  const topDiameter = parseNonNegativeDimension(log.topDiameter);
  const height = parsePositiveDimension(log.height);

  if (!areLogDimensionsValid(bottomDiameter, topDiameter, height)) {
    return null;
  }

  const metrics = calculateLogMetrics(
    bottomDiameter.value!,
    topDiameter.value!,
    height.value!,
  );

  let btusMillions: number | null = null;
  let btusAbsolute: number | null = null;
  let heatingContext: string | null = null;

  if (log.speciesId) {
    const btu = calculateBtuEstimate(metrics.cords, log.speciesId);
    btusMillions = btu.btusMillions;
    btusAbsolute = btu.btusAbsolute;
    heatingContext = btu.heatingContext;
  }

  return {
    cords: metrics.cords,
    faceCords: metrics.faceCords,
    volumeCubicInches: metrics.volumeCubicInches,
    volumeCubicFeet: metrics.volumeCubicFeet,
    btus: btusAbsolute,
    btusMillions,
    species: log.speciesId,
    dimensions: metrics.dimensions,
    heatingContext,
  };
}

export function formatBtusMillions(btusMillions: number): string {
  return `${btusMillions.toFixed(1)}M BTU`;
}
