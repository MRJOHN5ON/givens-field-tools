import type { TreeHeightInputState, TreeHeightMethod } from './types';
import {
  angleFieldError,
  parseOptionalPositiveNumber,
  parsePositiveNumber,
} from './validation';

export type TreeHeightFieldErrors = {
  distance: string | null;
  angle: string | null;
  eyeHeight: string | null;
  lineOfSight: string | null;
  userHeight: string | null;
  userShadowLength: string | null;
  treeShadowLength: string | null;
  distance2: string | null;
  angle2: string | null;
};

export function getTreeHeightFieldErrors(state: TreeHeightInputState): TreeHeightFieldErrors {
  switch (state.method) {
    case 'shadow':
      return shadowErrors(state);
    case 'angle':
      return angleErrors(state, false);
    case 'line-of-sight':
      return lineOfSightErrors(state);
    case 'clinometer':
      return angleErrors(state, true);
    case 'triangulation':
      return triangulationErrors(state);
    default:
      return emptyErrors();
  }
}

export function getTreeHeightEmptyStateMessage(
  state: TreeHeightInputState,
  errors: TreeHeightFieldErrors,
): string | null {
  const hasErrors = Object.values(errors).some((error) => error !== null);
  if (hasErrors) {
    return 'Fix the highlighted fields to estimate tree height.';
  }

  switch (state.method) {
    case 'shadow':
      if (
        !state.userHeight.trim() &&
        !state.userShadowLength.trim() &&
        !state.treeShadowLength.trim()
      ) {
        return 'Enter your height and both shadow lengths to estimate tree height.';
      }
      return 'Enter all three shadow measurements with values greater than zero.';
    case 'angle':
      if (!state.distance.trim()) return 'Enter your horizontal distance to the tree base.';
      if (!state.angle.trim()) return 'Enter the angle to the treetop.';
      return 'Enter valid measurements to calculate height.';
    case 'line-of-sight':
      if (!state.distance.trim()) return 'Enter the horizontal distance to the tree base.';
      if (!state.lineOfSight.trim()) return 'Enter the line-of-sight distance to the treetop.';
      return 'Line-of-sight distance must be greater than base distance.';
    case 'clinometer':
      if (!state.distance.trim()) return 'Enter your distance to the tree.';
      if (!state.angle.trim()) return 'Enter the clinometer angle to the treetop.';
      if (!state.eyeHeight.trim()) return 'Enter your eye height above the ground.';
      return 'Enter valid clinometer measurements to calculate height.';
    case 'triangulation':
      if (!state.distance.trim() || !state.angle.trim()) {
        return 'Enter distance and angle from the first measurement position.';
      }
      if (!state.distance2.trim() || !state.angle2.trim()) {
        return 'Enter distance and angle from the second measurement position.';
      }
      return 'Enter valid measurements from both positions to calculate height.';
    default:
      return 'Enter valid measurements to calculate height.';
  }
}

export function normalizeTreeHeightMethod(method: string | undefined): TreeHeightMethod {
  switch (method) {
    case 'angle':
    case 'line-of-sight':
    case 'shadow':
    case 'clinometer':
    case 'triangulation':
      return method;
    case 'distance-angle':
    case 'sensor':
      return 'angle';
    case 'hypotenuse':
      return 'line-of-sight';
    default:
      return 'angle';
  }
}

function shadowErrors(state: TreeHeightInputState): TreeHeightFieldErrors {
  const started =
    state.userHeight.trim().length > 0 ||
    state.userShadowLength.trim().length > 0 ||
    state.treeShadowLength.trim().length > 0;

  return {
    ...emptyErrors(),
    userHeight: fieldError(state.userHeight, parsePositiveNumber(state.userHeight), started),
    userShadowLength: fieldError(
      state.userShadowLength,
      parsePositiveNumber(state.userShadowLength),
      started,
    ),
    treeShadowLength: fieldError(
      state.treeShadowLength,
      parsePositiveNumber(state.treeShadowLength),
      started,
    ),
  };
}

function angleErrors(
  state: TreeHeightInputState,
  requireEyeHeight: boolean,
): TreeHeightFieldErrors {
  const started =
    state.distance.trim().length > 0 ||
    state.angle.trim().length > 0 ||
    state.eyeHeight.trim().length > 0;

  const eyeHeightValidation = requireEyeHeight
    ? parsePositiveNumber(state.eyeHeight)
    : parseOptionalPositiveNumber(state.eyeHeight);

  return {
    ...emptyErrors(),
    distance: fieldError(state.distance, parsePositiveNumber(state.distance), started),
    angle: angleFieldError(state.angle, started),
    eyeHeight: requireEyeHeight
      ? fieldError(state.eyeHeight, eyeHeightValidation, started)
      : optionalFieldError(state.eyeHeight, eyeHeightValidation),
  };
}

function lineOfSightErrors(state: TreeHeightInputState): TreeHeightFieldErrors {
  const started = state.distance.trim().length > 0 || state.lineOfSight.trim().length > 0;
  const distanceValidation = parsePositiveNumber(state.distance);
  const lineOfSightValidation = parsePositiveNumber(state.lineOfSight);

  let lineOfSightError = fieldError(
    state.lineOfSight,
    lineOfSightValidation,
    started,
  );

  if (
    !lineOfSightError &&
    distanceValidation.isValid &&
    lineOfSightValidation.isValid &&
    lineOfSightValidation.value !== null &&
    distanceValidation.value !== null &&
    lineOfSightValidation.value <= distanceValidation.value
  ) {
    lineOfSightError = 'Must be greater than base distance';
  }

  return {
    ...emptyErrors(),
    distance: fieldError(state.distance, distanceValidation, started),
    lineOfSight: lineOfSightError,
  };
}

function triangulationErrors(state: TreeHeightInputState): TreeHeightFieldErrors {
  const started =
    state.distance.trim().length > 0 ||
    state.angle.trim().length > 0 ||
    state.distance2.trim().length > 0 ||
    state.angle2.trim().length > 0;

  return {
    ...emptyErrors(),
    distance: fieldError(state.distance, parsePositiveNumber(state.distance), started),
    angle: angleFieldError(state.angle, started),
    distance2: fieldError(state.distance2, parsePositiveNumber(state.distance2), started),
    angle2: angleFieldError(state.angle2, started),
  };
}

function emptyErrors(): TreeHeightFieldErrors {
  return {
    distance: null,
    angle: null,
    eyeHeight: null,
    lineOfSight: null,
    userHeight: null,
    userShadowLength: null,
    treeShadowLength: null,
    distance2: null,
    angle2: null,
  };
}

function fieldError(
  raw: string,
  validation: { isValid: boolean; error: string | null },
  started: boolean,
): string | null {
  if (!raw.trim()) {
    return started ? 'Required' : null;
  }
  return validation.isValid ? null : validation.error;
}

function optionalFieldError(
  raw: string,
  validation: { isValid: boolean; error: string | null },
): string | null {
  if (!raw.trim()) {
    return null;
  }
  return validation.isValid ? null : validation.error;
}
