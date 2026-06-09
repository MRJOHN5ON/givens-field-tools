import type { FirewoodLogState } from './types';

let logCounter = 0;

export function createLogId(): string {
  logCounter += 1;
  return `log-${Date.now()}-${logCounter}`;
}

export function createDefaultLogName(index: number): string {
  return `Log ${index}`;
}

export function createFirewoodLog(index: number, id = createLogId()): FirewoodLogState {
  return {
    id,
    name: createDefaultLogName(index),
    bottomDiameter: '',
    topDiameter: '',
    height: '',
    speciesId: null,
  };
}

/** @deprecated Use createFirewoodLog — kept for import stability during migration. */
export const createFirewoodPile = createFirewoodLog;

/** @deprecated Use createDefaultLogName */
export const createDefaultPileName = createDefaultLogName;

/** @deprecated Use createLogId */
export const createPileId = createLogId;
