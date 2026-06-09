import type { FirewoodLogWithResults, LogCalculationResult, LogTotals } from './types';

export function aggregateLogResults(
  logs: readonly FirewoodLogWithResults[],
): LogTotals {
  const calculated = logs
    .map((log) => log.results)
    .filter((result): result is LogCalculationResult => result !== null);

  const totalCords = sum(calculated.map((result) => result.cords));
  const totalFaceCords = sum(calculated.map((result) => result.faceCords));
  const totalVolumeCubicInches = sum(calculated.map((result) => result.volumeCubicInches));
  const totalVolumeCubicFeet = sum(calculated.map((result) => result.volumeCubicFeet));

  const btuValues = calculated
    .map((result) => result.btusMillions)
    .filter((value): value is number => value !== null);

  const totalBtusMillions = btuValues.length > 0 ? sum(btuValues) : null;
  const totalBtusAbsolute =
    totalBtusMillions !== null ? totalBtusMillions * 1_000_000 : null;

  return {
    totalCords,
    totalFaceCords,
    totalVolumeCubicInches,
    totalVolumeCubicFeet,
    totalBtusMillions,
    totalBtusAbsolute,
    logCount: logs.length,
    calculatedLogCount: calculated.length,
  };
}

/** @deprecated Use aggregateLogResults */
export function aggregatePileResults(
  logs: readonly FirewoodLogWithResults[],
): LogTotals & { pileCount: number; calculatedPileCount: number } {
  const totals = aggregateLogResults(logs);
  return {
    ...totals,
    pileCount: totals.logCount,
    calculatedPileCount: totals.calculatedLogCount,
  };
}

function sum(values: readonly number[]): number {
  return values.reduce((total, value) => total + value, 0);
}
