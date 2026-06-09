export type TreeHeightMethod =
  | 'angle'
  | 'line-of-sight'
  | 'shadow'
  | 'clinometer'
  | 'triangulation';

export type TreeHeightTier = 'standard' | 'advanced';

export type LengthUnit = 'ft' | 'm';

export interface TreeHeightInputState {
  method: TreeHeightMethod;
  unit: LengthUnit;
  distance: string;
  angle: string;
  eyeHeight: string;
  lineOfSight: string;
  userHeight: string;
  userShadowLength: string;
  treeShadowLength: string;
  distance2: string;
  angle2: string;
}

export interface TreeHeightRawInputs {
  method: TreeHeightMethod;
  unit: LengthUnit;
  distance: number | null;
  angle: number | null;
  eyeHeight: number | null;
  lineOfSight: number | null;
  userHeight: number | null;
  userShadowLength: number | null;
  treeShadowLength: number | null;
  distance2: number | null;
  angle2: number | null;
}

export interface TreeHeightResult {
  estimatedHeight: number;
  unit: LengthUnit;
  heightFt: number;
  heightM: number;
  method: TreeHeightMethod;
  rawInputs: TreeHeightRawInputs;
  warnings: string[];
  precisionNotes: string[];
}

export interface DimensionValidation {
  isValid: boolean;
  value: number | null;
  error: string | null;
}

export const STANDARD_METHODS: readonly TreeHeightMethod[] = [
  'angle',
  'line-of-sight',
  'shadow',
];

export const ADVANCED_METHODS: readonly TreeHeightMethod[] = [
  'clinometer',
  'triangulation',
];

export function getTreeHeightTier(method: TreeHeightMethod): TreeHeightTier {
  return ADVANCED_METHODS.includes(method) ? 'advanced' : 'standard';
}

export function isTreeHeightMethod(value: string): value is TreeHeightMethod {
  return (
    value === 'angle' ||
    value === 'line-of-sight' ||
    value === 'shadow' ||
    value === 'clinometer' ||
    value === 'triangulation'
  );
}
