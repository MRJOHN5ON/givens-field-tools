/// <reference types="node" />
import assert from 'node:assert/strict';
import test from 'node:test';
import { aggregateLogResults } from './aggregate';
import {
  calculateBtuEstimate,
  calculateCordsFromVolumeCubicInches,
  calculateLogMetrics,
  calculateLogResult,
  calculateLogVolumeCubicInches,
  formatHeatingContext,
} from './calculations';
import { createFirewoodLog } from './piles';

test('calculateLogVolumeCubicInches uses frustum formula (matches website)', () => {
  const volume = calculateLogVolumeCubicInches(24, 12, 30);
  assert.ok(Math.abs(volume - 95_001.762) < 0.01);
});

test('calculateLogMetrics converts volume to cords via 221184 cu in per cord', () => {
  const result = calculateLogMetrics(24, 12, 30);

  assert.ok(Math.abs(result.volumeCubicInches - 95_001.762) < 0.01);
  assert.ok(Math.abs(result.cords - 0.4295) < 0.001);
  assert.ok(Math.abs(result.faceCords - result.cords * 3) < 0.0001);
});

test('calculateCordsFromVolumeCubicInches matches one full cord at 221184 cu in', () => {
  assert.equal(calculateCordsFromVolumeCubicInches(221_184), 1);
});

test('calculateBtuEstimate multiplies cords by species BTU value', () => {
  const estimate = calculateBtuEstimate(2, 'oak');

  assert.equal(estimate.btusMillions, 52.8);
  assert.equal(estimate.btusAbsolute, 52_800_000);
  assert.equal(estimate.species, 'oak');
});

test('calculateLogResult returns null for invalid dimensions', () => {
  const log = createFirewoodLog(1);
  log.height = '0';
  log.bottomDiameter = '24';
  log.topDiameter = '12';

  assert.equal(calculateLogResult(log), null);
});

test('calculateLogResult omits BTU when species is not selected', () => {
  const log = createFirewoodLog(1);
  log.bottomDiameter = '24';
  log.topDiameter = '12';
  log.height = '30';

  const result = calculateLogResult(log)!;
  assert.ok(result);
  assert.equal(result.btus, null);
  assert.equal(result.btusMillions, null);
  assert.equal(result.species, null);
});

test('calculateLogResult allows zero top diameter for pointed tops', () => {
  const log = createFirewoodLog(1);
  log.bottomDiameter = '20';
  log.topDiameter = '0';
  log.height = '20';

  const result = calculateLogResult(log);
  assert.ok(result);
  assert.ok(result!.cords > 0);
});

test('aggregateLogResults sums calculated logs and BTU totals', () => {
  const logA = createFirewoodLog(1);
  logA.bottomDiameter = '24';
  logA.topDiameter = '12';
  logA.height = '30';
  logA.speciesId = 'oak';

  const logB = createFirewoodLog(2);
  logB.bottomDiameter = '18';
  logB.topDiameter = '18';
  logB.height = '16';
  logB.speciesId = 'aspen';

  const totals = aggregateLogResults([
    { ...logA, results: calculateLogResult(logA)! },
    { ...logB, results: calculateLogResult(logB)! },
  ]);

  assert.equal(totals.calculatedLogCount, 2);
  assert.ok(totals.totalCords > 0);
  assert.ok(totals.totalFaceCords > totals.totalCords);
  assert.ok(totals.totalBtusMillions && totals.totalBtusMillions > 0);
});

test('formatHeatingContext returns readable copy', () => {
  const message = formatHeatingContext(12);
  assert.ok(message?.includes('day'));
});
