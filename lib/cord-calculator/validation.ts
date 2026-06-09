import type { DimensionValidation } from './types';

export function parsePositiveDimension(raw: string): DimensionValidation {
  const trimmed = raw.trim();
  if (!trimmed) {
    return { isValid: false, value: null, error: 'Required' };
  }

  const parsed = Number(trimmed);
  if (!Number.isFinite(parsed)) {
    return { isValid: false, value: null, error: 'Enter a valid number' };
  }
  if (parsed < 0) {
    return { isValid: false, value: null, error: 'Cannot be negative' };
  }
  if (parsed === 0) {
    return { isValid: false, value: null, error: 'Must be greater than zero' };
  }

  return { isValid: true, value: parsed, error: null };
}

/** Diameter fields allow zero (e.g. a pointed top). */
export function parseNonNegativeDimension(raw: string): DimensionValidation {
  const trimmed = raw.trim();
  if (!trimmed) {
    return { isValid: false, value: null, error: 'Required' };
  }

  const parsed = Number(trimmed);
  if (!Number.isFinite(parsed)) {
    return { isValid: false, value: null, error: 'Enter a valid number' };
  }
  if (parsed < 0) {
    return { isValid: false, value: null, error: 'Cannot be negative' };
  }

  return { isValid: true, value: parsed, error: null };
}

export function areLogDimensionsValid(
  bottomDiameter: DimensionValidation,
  topDiameter: DimensionValidation,
  height: DimensionValidation,
): boolean {
  if (!bottomDiameter.isValid || !topDiameter.isValid || !height.isValid) {
    return false;
  }

  const hasVolume =
    bottomDiameter.value! > 0 || topDiameter.value! > 0;

  return hasVolume;
}
