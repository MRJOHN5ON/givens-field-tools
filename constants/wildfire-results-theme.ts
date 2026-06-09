import type { RiskBand, SeverityLevel } from '@/lib/wildfire-risk/types';

/** Light report panel — matches wildfire-risk-calculator.html mobile results */
export const report = {
  surface: '#FFFFFF',
  text: 'rgba(0, 0, 0, 0.82)',
  textMuted: 'rgba(0, 0, 0, 0.58)',
  textSoft: 'rgba(0, 0, 0, 0.48)',
  border: 'rgba(0, 0, 0, 0.08)',
  accent: '#c44a12',
  heroBg: 'rgba(255, 255, 255, 0.72)',
  heroBorder: 'rgba(0, 0, 0, 0.07)',
  siteNoteBg: 'rgba(210, 140, 50, 0.1)',
  siteNoteBorder: 'rgba(210, 140, 50, 0.35)',
  siteNoteDirectBg: 'rgba(106, 156, 118, 0.08)',
  siteNoteDirectBorder: 'rgba(106, 156, 118, 0.35)',
  fuelHeroBg: 'rgba(255, 255, 255, 0.82)',
  fuelHeroBorder: 'rgba(210, 140, 50, 0.22)',
  metricBg: 'rgba(143, 169, 143, 0.1)',
  metricBorder: 'rgba(0, 0, 0, 0.04)',
  breakdownBg: 'rgba(255, 255, 255, 0.65)',
} as const;

export const reportBandBorder: Record<RiskBand, string> = {
  Low: 'rgba(106, 156, 118, 0.55)',
  Moderate: 'rgba(210, 170, 60, 0.5)',
  High: 'rgba(196, 74, 18, 0.55)',
  Extreme: 'rgba(181, 40, 26, 0.55)',
};

export const reportBandGauge: Record<RiskBand, string> = {
  Low: '#4a7c59',
  Moderate: '#9a7724',
  High: '#c44a12',
  Extreme: '#b5281a',
};

export const reportBandPill: Record<RiskBand, { bg: string; text: string }> = {
  Low: { bg: 'rgba(106, 156, 118, 0.35)', text: '#2f4f38' },
  Moderate: { bg: 'rgba(210, 170, 60, 0.35)', text: '#6b4e00' },
  High: { bg: 'rgba(220, 120, 50, 0.35)', text: '#7a3200' },
  Extreme: { bg: 'rgba(180, 50, 40, 0.28)', text: '#7a1a12' },
};

export function reportSeverityColor(level: SeverityLevel) {
  switch (level) {
    case 'critical':
      return '#b5281a';
    case 'high':
      return '#c44a12';
    case 'moderate':
      return '#9a7724';
    case 'low':
      return '#4a7c59';
    default:
      return '#c44a12';
  }
}

export function reportMetricSurface(level: SeverityLevel) {
  switch (level) {
    case 'critical':
      return { backgroundColor: 'rgba(180, 50, 40, 0.14)', borderColor: 'rgba(180, 50, 40, 0.28)' };
    case 'high':
      return { backgroundColor: 'rgba(220, 120, 50, 0.16)', borderColor: 'rgba(220, 120, 50, 0.28)' };
    case 'moderate':
      return { backgroundColor: 'rgba(210, 170, 60, 0.18)', borderColor: 'rgba(210, 170, 60, 0.3)' };
    case 'low':
      return { backgroundColor: 'rgba(106, 156, 118, 0.18)', borderColor: 'rgba(106, 156, 118, 0.28)' };
    default:
      return { backgroundColor: report.metricBg, borderColor: report.metricBorder };
  }
}

export function reportSubscoreFill(level: SeverityLevel) {
  switch (level) {
    case 'critical':
      return '#d06050';
    case 'high':
      return '#e8a060';
    case 'moderate':
      return '#e0c878';
    case 'low':
      return '#a8c9b0';
    default:
      return '#8fa98f';
  }
}
