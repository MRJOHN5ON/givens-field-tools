import { METERS_PER_FOOT } from './constants';
import type { LengthUnit } from './types';

export function toMeters(value: number, unit: LengthUnit): number {
  return unit === 'ft' ? value * METERS_PER_FOOT : value;
}

export function fromMeters(valueMeters: number, unit: LengthUnit): number {
  return unit === 'ft' ? valueMeters / METERS_PER_FOOT : valueMeters;
}

export function convertLength(value: number, from: LengthUnit, to: LengthUnit): number {
  if (from === to) return value;
  const meters = toMeters(value, from);
  return fromMeters(meters, to);
}

export function lengthUnitLabel(unit: LengthUnit): string {
  return unit;
}
