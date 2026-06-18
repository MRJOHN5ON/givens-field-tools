import type { PlantRiskLevel } from '@/lib/plant-identifier/types';
import { colors } from '@/constants/theme';

export function riskAccentColor(risk: PlantRiskLevel): string {
  switch (risk) {
    case 'extreme':
    case 'very_high':
    case 'high':
      return '#E8531A';
    case 'moderate':
      return '#D4A017';
    case 'low':
      return '#6B9E6B';
    default:
      return colors.textMuted;
  }
}

export function riskBorderColor(risk: PlantRiskLevel): string {
  switch (risk) {
    case 'extreme':
    case 'very_high':
    case 'high':
      return 'rgba(232, 83, 26, 0.45)';
    case 'moderate':
      return 'rgba(212, 160, 23, 0.45)';
    case 'low':
      return 'rgba(107, 158, 107, 0.45)';
    default:
      return colors.border;
  }
}

export function riskBackgroundColor(risk: PlantRiskLevel): string {
  switch (risk) {
    case 'extreme':
    case 'very_high':
    case 'high':
      return 'rgba(232, 83, 26, 0.08)';
    case 'moderate':
      return 'rgba(212, 160, 23, 0.08)';
    case 'low':
      return 'rgba(107, 158, 107, 0.08)';
    default:
      return 'rgba(143, 169, 143, 0.08)';
  }
}

export function ctaVariantForRisk(risk: PlantRiskLevel): 'high' | 'moderate' | 'low' {
  if (risk === 'extreme' || risk === 'very_high' || risk === 'high') return 'high';
  if (risk === 'low') return 'low';
  return 'moderate';
}
