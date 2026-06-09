import { MAX_VALID_ANGLE_DEG, MIN_VALID_ANGLE_DEG } from './constants';
import type { DimensionValidation } from './types';

export function parsePositiveNumber(raw: string): DimensionValidation {
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

export function parseOptionalPositiveNumber(raw: string): DimensionValidation {
  const trimmed = raw.trim();
  if (!trimmed) {
    return { isValid: true, value: null, error: null };
  }

  const parsed = Number(trimmed);
  if (!Number.isFinite(parsed)) {
    return { isValid: false, value: null, error: 'Enter a valid number' };
  }
  if (parsed <= 0) {
    return { isValid: false, value: null, error: 'Must be greater than zero' };
  }

  return { isValid: true, value: parsed, error: null };
}

export function isValidAngleDegrees(angle: number): boolean {
  return (
    Number.isFinite(angle) &&
    angle > MIN_VALID_ANGLE_DEG &&
    angle < MAX_VALID_ANGLE_DEG
  );
}

export function angleFieldError(raw: string, started: boolean): string | null {
  const validation = parsePositiveNumber(raw);
  const requiredError = fieldError(raw, validation, started);
  if (requiredError) return requiredError;
  if (validation.isValid && validation.value !== null && !isValidAngleDegrees(validation.value)) {
    return 'Angle must be between 0° and 90°';
  }
  return null;
}

function fieldError(
  raw: string,
  validation: DimensionValidation,
  started: boolean,
): string | null {
  if (!raw.trim()) {
    return started ? 'Required' : null;
  }
  return validation.isValid ? null : validation.error;
}
