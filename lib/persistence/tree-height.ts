import { normalizeTreeHeightMethod } from '@/lib/tree-height/form-errors';
import type { TreeHeightInputState } from '@/lib/tree-height/types';

const UNITS = new Set(['ft', 'm']);

function readString(value: unknown): string {
  return typeof value === 'string' ? value : '';
}

export function sanitizeTreeHeightState(value: unknown): TreeHeightInputState | null {
  if (!value || typeof value !== 'object') return null;

  const state = value as Partial<TreeHeightInputState>;
  if (!UNITS.has(state.unit as string)) {
    return null;
  }

  return {
    method: normalizeTreeHeightMethod(state.method),
    unit: state.unit as TreeHeightInputState['unit'],
    distance: readString(state.distance),
    angle: readString(state.angle),
    eyeHeight: readString(state.eyeHeight),
    lineOfSight: readString(state.lineOfSight),
    userHeight: readString(state.userHeight),
    userShadowLength: readString(state.userShadowLength),
    treeShadowLength: readString(state.treeShadowLength),
    distance2: readString(state.distance2),
    angle2: readString(state.angle2),
  };
}
