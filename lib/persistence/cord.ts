import type { FirewoodLogState } from '@/lib/cord-calculator/types';

export type CordCalculatorPersisted = {
  logs: FirewoodLogState[];
  activeLogId: string | null;
};

export function sanitizeCordCalculatorState(
  value: unknown,
): CordCalculatorPersisted | null {
  if (!value || typeof value !== 'object') return null;

  const record = value as Record<string, unknown>;

  const logs = extractLogs(record);
  if (logs.length === 0) return null;

  const activeLogId = resolveActiveLogId(record, logs);

  return { logs, activeLogId };
}

function extractLogs(record: Record<string, unknown>): FirewoodLogState[] {
  if (Array.isArray(record.logs)) {
    return record.logs.filter(isFirewoodLogState);
  }

  if (Array.isArray(record.piles)) {
    return record.piles.filter(isLegacyPileState).map(migrateLegacyPile);
  }

  return [];
}

function resolveActiveLogId(
  record: Record<string, unknown>,
  logs: FirewoodLogState[],
): string {
  const candidate =
    typeof record.activeLogId === 'string'
      ? record.activeLogId
      : typeof record.activePileId === 'string'
        ? record.activePileId
        : null;

  if (candidate && logs.some((log) => log.id === candidate)) {
    return candidate;
  }

  return logs[0].id;
}

function isFirewoodLogState(value: unknown): value is FirewoodLogState {
  if (!value || typeof value !== 'object') return false;
  const log = value as Partial<FirewoodLogState>;
  return (
    typeof log.id === 'string' &&
    typeof log.name === 'string' &&
    typeof log.bottomDiameter === 'string' &&
    typeof log.topDiameter === 'string' &&
    typeof log.height === 'string' &&
    (log.speciesId === null || typeof log.speciesId === 'string')
  );
}

type LegacyPileState = {
  id: string;
  name: string;
  speciesId: FirewoodLogState['speciesId'];
};

function isLegacyPileState(value: unknown): value is LegacyPileState {
  if (!value || typeof value !== 'object') return false;
  const pile = value as Partial<LegacyPileState>;
  return typeof pile.id === 'string' && typeof pile.name === 'string';
}

function migrateLegacyPile(pile: LegacyPileState): FirewoodLogState {
  return {
    id: pile.id,
    name: pile.name,
    bottomDiameter: '',
    topDiameter: '',
    height: '',
    speciesId: pile.speciesId ?? null,
  };
}
