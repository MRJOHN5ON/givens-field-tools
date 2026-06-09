import { useCallback, useEffect, useMemo, useState } from 'react';
import { aggregateLogResults } from '@/lib/cord-calculator/aggregate';
import { calculateLogResult } from '@/lib/cord-calculator/calculations';
import {
  createDefaultLogName,
  createFirewoodLog,
} from '@/lib/cord-calculator/piles';
import type {
  FirewoodLogState,
  FirewoodLogWithResults,
  WoodSpeciesId,
} from '@/lib/cord-calculator/types';
import { sanitizeCordCalculatorState } from '@/lib/persistence/cord';
import { loadJson, saveJson, storageKeys } from '@/lib/persistence/storage';

type LogField = 'bottomDiameter' | 'topDiameter' | 'height' | 'name';

export function logHasMeasurements(log: FirewoodLogState): boolean {
  return Boolean(
    log.bottomDiameter.trim() ||
      log.topDiameter.trim() ||
      log.height.trim() ||
      log.speciesId,
  );
}

export function useCordCalculator() {
  const [logs, setLogs] = useState<FirewoodLogState[]>(() => [createFirewoodLog(1)]);
  const [activeLogId, setActiveLogId] = useState<string | undefined>(undefined);
  const [isHydrated, setIsHydrated] = useState(false);
  const resolvedActiveLogId = activeLogId ?? logs[0]?.id ?? '';

  useEffect(() => {
    let mounted = true;

    loadJson(storageKeys.cordCalculator).then((saved) => {
      if (!mounted) return;

      const restored = sanitizeCordCalculatorState(saved);
      if (restored) {
        setLogs(restored.logs);
        setActiveLogId(restored.activeLogId ?? undefined);
      }

      setIsHydrated(true);
    });

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!isHydrated) return;

    const timer = setTimeout(() => {
      saveJson(storageKeys.cordCalculator, {
        logs,
        activeLogId: activeLogId ?? null,
      });
    }, 400);

    return () => clearTimeout(timer);
  }, [logs, activeLogId, isHydrated]);

  const logsWithResults = useMemo<FirewoodLogWithResults[]>(
    () =>
      logs.map((log) => ({
        ...log,
        results: calculateLogResult(log),
      })),
    [logs],
  );

  const totals = useMemo(
    () => aggregateLogResults(logsWithResults),
    [logsWithResults],
  );

  const activeLog = useMemo(
    () =>
      logsWithResults.find((log) => log.id === resolvedActiveLogId) ??
      logsWithResults[0],
    [resolvedActiveLogId, logsWithResults],
  );

  const updateLog = useCallback((logId: string, patch: Partial<FirewoodLogState>) => {
    setLogs((current) =>
      current.map((log) => {
        if (log.id !== logId) return log;
        return { ...log, ...patch };
      }),
    );
  }, []);

  const updateLogField = useCallback(
    (logId: string, field: LogField, value: string) => {
      updateLog(logId, { [field]: value });
    },
    [updateLog],
  );

  const setLogSpecies = useCallback((logId: string, speciesId: WoodSpeciesId | null) => {
    updateLog(logId, { speciesId });
  }, [updateLog]);

  const renameLog = useCallback((logId: string, name: string) => {
    updateLog(logId, { name });
  }, [updateLog]);

  const finalizeLogName = useCallback(
    (logId: string, name: string, logIndex: number) => {
      const trimmed = name.trim();
      updateLog(logId, {
        name: trimmed || createDefaultLogName(logIndex + 1),
      });
    },
    [updateLog],
  );

  const addLog = useCallback(() => {
    const nextIndex = logs.length + 1;
    const log = createFirewoodLog(nextIndex);
    setLogs((current) => [...current, log]);
    setActiveLogId(log.id);
  }, [logs.length]);

  const removeLog = useCallback(
    (logId: string) => {
      setLogs((current) => {
        if (current.length <= 1) return current;
        const next = current.filter((log) => log.id !== logId);
        if (resolvedActiveLogId === logId) {
          setActiveLogId(next[0]?.id);
        }
        return next;
      });
    },
    [resolvedActiveLogId],
  );

  const clearLog = useCallback((logId: string) => {
    updateLog(logId, {
      bottomDiameter: '',
      topDiameter: '',
      height: '',
      speciesId: null,
    });
  }, [updateLog]);

  const resetAllLogs = useCallback(() => {
    const log = createFirewoodLog(1);
    setLogs([log]);
    setActiveLogId(log.id);
  }, []);

  const hasAnyMeasurements = useMemo(
    () => logs.some(logHasMeasurements),
    [logs],
  );

  const activeLogHasMeasurements = useMemo(
    () => (activeLog ? logHasMeasurements(activeLog) : false),
    [activeLog],
  );

  return {
    logs: logsWithResults,
    totals,
    activeLog,
    activeLogId: resolvedActiveLogId,
    hasAnyMeasurements,
    activeLogHasMeasurements,
    setActiveLogId,
    updateLogField,
    setLogSpecies,
    renameLog,
    finalizeLogName,
    addLog,
    removeLog,
    clearLog,
    resetAllLogs,
  };
}
