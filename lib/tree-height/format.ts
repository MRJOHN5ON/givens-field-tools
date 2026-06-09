import type { LengthUnit, TreeHeightResult } from './types';

export function formatHeight(value: number, unit: LengthUnit, digits = 1): string {
  return `${value.toFixed(digits)} ${unit}`;
}

export function formatHeightPair(result: TreeHeightResult): {
  primary: string;
  alternate: string;
} {
  const alternateUnit: LengthUnit = result.unit === 'ft' ? 'm' : 'ft';
  const alternateValue = alternateUnit === 'ft' ? result.heightFt : result.heightM;

  return {
    primary: formatHeight(result.estimatedHeight, result.unit),
    alternate: formatHeight(alternateValue, alternateUnit),
  };
}

export function formatAngle(angle: number, digits = 1): string {
  return `${angle.toFixed(digits)}°`;
}
