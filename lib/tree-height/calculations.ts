import { DEGREES_TO_RADIANS } from './constants';
import type {
  LengthUnit,
  TreeHeightInputState,
  TreeHeightMethod,
  TreeHeightRawInputs,
  TreeHeightResult,
} from './types';
import { fromMeters, toMeters } from './units';
import {
  angleFieldError,
  isValidAngleDegrees,
  parseOptionalPositiveNumber,
  parsePositiveNumber,
} from './validation';

type ComputedHeight = {
  heightM: number;
  precisionNotes: string[];
  warnings: string[];
};

export function calculateHeightFromAngle(
  distance: number,
  angleDeg: number,
  eyeHeight: number | null,
  unit: LengthUnit,
): ComputedHeight | null {
  if (distance <= 0 || !isValidAngleDegrees(angleDeg)) {
    return null;
  }

  const distanceM = toMeters(distance, unit);
  let heightM = distanceM * Math.tan(angleDeg * DEGREES_TO_RADIANS);

  if (eyeHeight !== null && eyeHeight > 0) {
    heightM += toMeters(eyeHeight, unit);
  }

  if (!Number.isFinite(heightM) || heightM <= 0) {
    return null;
  }

  const notes = ['Height assumes horizontal distance to the tree base.'];
  if (eyeHeight !== null && eyeHeight > 0) {
    notes.push('Eye height added to the calculated vertical component.');
  }

  return { heightM, precisionNotes: notes, warnings: [] };
}

export function calculateHeightFromLineOfSight(
  baseDistance: number,
  lineOfSight: number,
  unit: LengthUnit,
): ComputedHeight | null {
  if (baseDistance <= 0 || lineOfSight <= 0 || lineOfSight <= baseDistance) {
    return null;
  }

  const baseM = toMeters(baseDistance, unit);
  const sightM = toMeters(lineOfSight, unit);
  const heightM = Math.sqrt(sightM ** 2 - baseM ** 2);

  if (!Number.isFinite(heightM) || heightM <= 0) {
    return null;
  }

  return {
    heightM,
    precisionNotes: ['Height derived from horizontal distance and line-of-sight distance.'],
    warnings:
      lineOfSight <= baseDistance
        ? ['Line-of-sight distance must be greater than base distance.']
        : [],
  };
}

export function calculateHeightFromShadow(
  userHeight: number,
  userShadowLength: number,
  treeShadowLength: number,
  unit: LengthUnit,
): ComputedHeight | null {
  if (userHeight <= 0 || userShadowLength <= 0 || treeShadowLength <= 0) {
    return null;
  }

  const userHeightM = toMeters(userHeight, unit);
  const userShadowM = toMeters(userShadowLength, unit);
  const treeShadowM = toMeters(treeShadowLength, unit);
  const heightM = (userHeightM / userShadowM) * treeShadowM;

  if (!Number.isFinite(heightM) || heightM <= 0) {
    return null;
  }

  const warnings: string[] = [];
  if (userShadowM < toMeters(0.5, 'ft')) {
    warnings.push('Very short user shadow may reduce accuracy.');
  }

  return {
    heightM,
    precisionNotes: ['Shadow method assumes similar sun angle and level ground for both shadows.'],
    warnings,
  };
}

export function calculateHeightFromClinometer(
  distance: number,
  angleDeg: number,
  eyeHeight: number,
  unit: LengthUnit,
): ComputedHeight | null {
  if (distance <= 0 || eyeHeight <= 0 || !isValidAngleDegrees(angleDeg)) {
    return null;
  }

  const distanceM = toMeters(distance, unit);
  const eyeHeightM = toMeters(eyeHeight, unit);
  const heightM = distanceM * Math.tan(angleDeg * DEGREES_TO_RADIANS) + eyeHeightM;

  if (!Number.isFinite(heightM) || heightM <= 0) {
    return null;
  }

  return {
    heightM,
    precisionNotes: [
      'Clinometer height uses horizontal distance, sight angle, and eye height above ground.',
    ],
    warnings: [],
  };
}

export function calculateHeightFromTriangulation(
  distance1: number,
  angle1Deg: number,
  distance2: number,
  angle2Deg: number,
  unit: LengthUnit,
): ComputedHeight | null {
  if (
    distance1 <= 0 ||
    distance2 <= 0 ||
    !isValidAngleDegrees(angle1Deg) ||
    !isValidAngleDegrees(angle2Deg)
  ) {
    return null;
  }

  const height1M =
    toMeters(distance1, unit) * Math.tan(angle1Deg * DEGREES_TO_RADIANS);
  const height2M =
    toMeters(distance2, unit) * Math.tan(angle2Deg * DEGREES_TO_RADIANS);
  const heightM = (height1M + height2M) / 2;

  if (!Number.isFinite(heightM) || heightM <= 0) {
    return null;
  }

  return {
    heightM,
    precisionNotes: ['Triangulation averages height estimates from two measurement positions.'],
    warnings: [],
  };
}

export function buildTreeHeightResult(
  heightM: number,
  method: TreeHeightMethod,
  unit: LengthUnit,
  rawInputs: TreeHeightRawInputs,
  warnings: string[],
  precisionNotes: string[],
): TreeHeightResult {
  return {
    estimatedHeight: fromMeters(heightM, unit),
    unit,
    heightFt: fromMeters(heightM, 'ft'),
    heightM,
    method,
    rawInputs,
    warnings,
    precisionNotes,
  };
}

export function calculateTreeHeight(state: TreeHeightInputState): TreeHeightResult | null {
  const rawInputs: TreeHeightRawInputs = {
    method: state.method,
    unit: state.unit,
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

  switch (state.method) {
    case 'angle':
      return calculateAngleMethod(state, rawInputs);
    case 'line-of-sight':
      return calculateLineOfSightMethod(state, rawInputs);
    case 'shadow':
      return calculateShadowMethod(state, rawInputs);
    case 'clinometer':
      return calculateClinometerMethod(state, rawInputs);
    case 'triangulation':
      return calculateTriangulationMethod(state, rawInputs);
    default:
      return null;
  }
}

function calculateAngleMethod(
  state: TreeHeightInputState,
  rawInputs: TreeHeightRawInputs,
): TreeHeightResult | null {
  const distance = parsePositiveNumber(state.distance);
  const angle = parsePositiveNumber(state.angle);
  const eyeHeight = parseOptionalPositiveNumber(state.eyeHeight);

  if (!distance.isValid || !angle.isValid || !eyeHeight.isValid) {
    return null;
  }
  if (!isValidAngleDegrees(angle.value!)) {
    return null;
  }

  rawInputs.distance = distance.value;
  rawInputs.angle = angle.value;
  rawInputs.eyeHeight = eyeHeight.value;

  const computed = calculateHeightFromAngle(
    distance.value!,
    angle.value!,
    eyeHeight.value,
    state.unit,
  );
  if (!computed) return null;

  return buildTreeHeightResult(
    computed.heightM,
    'angle',
    state.unit,
    rawInputs,
    computed.warnings,
    computed.precisionNotes,
  );
}

function calculateLineOfSightMethod(
  state: TreeHeightInputState,
  rawInputs: TreeHeightRawInputs,
): TreeHeightResult | null {
  const distance = parsePositiveNumber(state.distance);
  const lineOfSight = parsePositiveNumber(state.lineOfSight);

  if (!distance.isValid || !lineOfSight.isValid) {
    return null;
  }
  if (lineOfSight.value! <= distance.value!) {
    return null;
  }

  rawInputs.distance = distance.value;
  rawInputs.lineOfSight = lineOfSight.value;

  const computed = calculateHeightFromLineOfSight(
    distance.value!,
    lineOfSight.value!,
    state.unit,
  );
  if (!computed) return null;

  return buildTreeHeightResult(
    computed.heightM,
    'line-of-sight',
    state.unit,
    rawInputs,
    computed.warnings,
    computed.precisionNotes,
  );
}

function calculateShadowMethod(
  state: TreeHeightInputState,
  rawInputs: TreeHeightRawInputs,
): TreeHeightResult | null {
  const userHeight = parsePositiveNumber(state.userHeight);
  const userShadow = parsePositiveNumber(state.userShadowLength);
  const treeShadow = parsePositiveNumber(state.treeShadowLength);

  if (!userHeight.isValid || !userShadow.isValid || !treeShadow.isValid) {
    return null;
  }

  rawInputs.userHeight = userHeight.value;
  rawInputs.userShadowLength = userShadow.value;
  rawInputs.treeShadowLength = treeShadow.value;

  const computed = calculateHeightFromShadow(
    userHeight.value!,
    userShadow.value!,
    treeShadow.value!,
    state.unit,
  );
  if (!computed) return null;

  return buildTreeHeightResult(
    computed.heightM,
    'shadow',
    state.unit,
    rawInputs,
    computed.warnings,
    computed.precisionNotes,
  );
}

function calculateClinometerMethod(
  state: TreeHeightInputState,
  rawInputs: TreeHeightRawInputs,
): TreeHeightResult | null {
  const distance = parsePositiveNumber(state.distance);
  const angle = parsePositiveNumber(state.angle);
  const eyeHeight = parsePositiveNumber(state.eyeHeight);

  if (!distance.isValid || !angle.isValid || !eyeHeight.isValid) {
    return null;
  }
  if (!isValidAngleDegrees(angle.value!)) {
    return null;
  }

  rawInputs.distance = distance.value;
  rawInputs.angle = angle.value;
  rawInputs.eyeHeight = eyeHeight.value;

  const computed = calculateHeightFromClinometer(
    distance.value!,
    angle.value!,
    eyeHeight.value!,
    state.unit,
  );
  if (!computed) return null;

  return buildTreeHeightResult(
    computed.heightM,
    'clinometer',
    state.unit,
    rawInputs,
    computed.warnings,
    computed.precisionNotes,
  );
}

function calculateTriangulationMethod(
  state: TreeHeightInputState,
  rawInputs: TreeHeightRawInputs,
): TreeHeightResult | null {
  const distance1 = parsePositiveNumber(state.distance);
  const angle1 = parsePositiveNumber(state.angle);
  const distance2 = parsePositiveNumber(state.distance2);
  const angle2 = parsePositiveNumber(state.angle2);

  if (!distance1.isValid || !angle1.isValid || !distance2.isValid || !angle2.isValid) {
    return null;
  }
  if (!isValidAngleDegrees(angle1.value!) || !isValidAngleDegrees(angle2.value!)) {
    return null;
  }

  rawInputs.distance = distance1.value;
  rawInputs.angle = angle1.value;
  rawInputs.distance2 = distance2.value;
  rawInputs.angle2 = angle2.value;

  const computed = calculateHeightFromTriangulation(
    distance1.value!,
    angle1.value!,
    distance2.value!,
    angle2.value!,
    state.unit,
  );
  if (!computed) return null;

  return buildTreeHeightResult(
    computed.heightM,
    'triangulation',
    state.unit,
    rawInputs,
    computed.warnings,
    computed.precisionNotes,
  );
}

export { angleFieldError };
