import type { RiskBand, SeverityLevel } from './types';

export function bandColor(band: RiskBand) {
  switch (band) {
    case 'Extreme':
      return '#c62828';
    case 'High':
      return '#e8531a';
    case 'Moderate':
      return '#e8a030';
    default:
      return '#58a07a';
  }
}

export function scoreToSeverity(value: number | null | undefined): SeverityLevel {
  if (!Number.isFinite(value)) return 'neutral';
  const v = value as number;
  if (v > 75) return 'critical';
  if (v > 50) return 'high';
  if (v > 25) return 'moderate';
  return 'low';
}

export function spreadSeverity(chainsPerHr: number | null | undefined): SeverityLevel {
  if (!Number.isFinite(chainsPerHr)) return 'neutral';
  const v = chainsPerHr as number;
  if (v >= 20) return 'critical';
  if (v >= 10) return 'high';
  if (v >= 3) return 'moderate';
  return 'low';
}

export function flameSeverity(ft: number | null | undefined): SeverityLevel {
  if (!Number.isFinite(ft)) return 'neutral';
  const v = ft as number;
  if (v >= 15) return 'critical';
  if (v >= 8) return 'high';
  if (v >= 4) return 'moderate';
  return 'low';
}

export function slopeSeverity(deg: number | null | undefined): SeverityLevel {
  if (!Number.isFinite(deg)) return 'neutral';
  const v = deg as number;
  if (v >= 30) return 'high';
  if (v >= 15) return 'moderate';
  return 'low';
}

export function rhSeverity(rh: number | null | undefined, lowerIsWorse: boolean): SeverityLevel {
  if (!Number.isFinite(rh)) return 'neutral';
  const v = rh as number;
  if (lowerIsWorse) {
    if (v < 12) return 'critical';
    if (v < 20) return 'high';
    if (v < 35) return 'moderate';
    return 'low';
  }
  if (v >= 70) return 'low';
  if (v >= 50) return 'moderate';
  if (v >= 30) return 'high';
  return 'critical';
}

export function windSeverity(mph: number | null | undefined): SeverityLevel {
  if (!Number.isFinite(mph)) return 'neutral';
  const v = mph as number;
  if (v >= 25) return 'critical';
  if (v >= 15) return 'high';
  if (v >= 8) return 'moderate';
  return 'low';
}

export function tempSeverity(tempF: number | null | undefined): SeverityLevel {
  if (!Number.isFinite(tempF)) return 'neutral';
  const v = tempF as number;
  if (v >= 100) return 'critical';
  if (v >= 90) return 'high';
  if (v >= 80) return 'moderate';
  return 'low';
}

export function moistureSeverity(moisture: number | null | undefined): SeverityLevel {
  if (!Number.isFinite(moisture)) return 'neutral';
  const v = moisture as number;
  if (v < 5) return 'critical';
  if (v < 8) return 'high';
  if (v < 12) return 'moderate';
  return 'low';
}

export function severityTextColor(level: SeverityLevel) {
  switch (level) {
    case 'critical':
      return '#ff6b6b';
    case 'high':
      return '#e8531a';
    case 'moderate':
      return '#e8a030';
    case 'low':
      return '#58a07a';
    default:
      return 'rgba(240, 237, 232, 0.85)';
  }
}
