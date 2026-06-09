import type { FirewoodLogState } from './types';
import { parseNonNegativeDimension, parsePositiveDimension } from './validation';

export type CordLogFieldErrors = {
  bottomDiameter: string | null;
  topDiameter: string | null;
  height: string | null;
};

export function getCordLogFieldErrors(log: FirewoodLogState): CordLogFieldErrors {
  const started =
    log.bottomDiameter.trim().length > 0 ||
    log.topDiameter.trim().length > 0 ||
    log.height.trim().length > 0;

  return {
    bottomDiameter: dimensionFieldError(
      log.bottomDiameter,
      parseNonNegativeDimension(log.bottomDiameter),
      started,
    ),
    topDiameter: dimensionFieldError(
      log.topDiameter,
      parseNonNegativeDimension(log.topDiameter),
      started,
    ),
    height: dimensionFieldError(log.height, parsePositiveDimension(log.height), started),
  };
}

export function getCordLogEmptyStateMessage(
  log: FirewoodLogState,
  errors: CordLogFieldErrors,
): string | null {
  const hasErrors = Object.values(errors).some((error) => error !== null);
  if (hasErrors) {
    return 'Fix the highlighted fields to calculate this log.';
  }

  const started =
    log.bottomDiameter.trim().length > 0 ||
    log.topDiameter.trim().length > 0 ||
    log.height.trim().length > 0;

  if (!started) {
    return 'Enter bottom diameter, top diameter, and log length to estimate cords.';
  }

  return 'Enter all three measurements. Height must be greater than zero.';
}

function dimensionFieldError(
  raw: string,
  validation: { isValid: boolean; error: string | null },
  started: boolean,
): string | null {
  if (!raw.trim()) {
    return started ? 'Required' : null;
  }
  return validation.isValid ? null : validation.error;
}

/** @deprecated Use getCordLogFieldErrors */
export const getCordPileFieldErrors = getCordLogFieldErrors;

/** @deprecated Use getCordLogEmptyStateMessage */
export const getCordPileEmptyStateMessage = getCordLogEmptyStateMessage;

export type CordPileFieldErrors = CordLogFieldErrors;
