/// <reference types="node" />
import assert from 'node:assert/strict';
import test from 'node:test';
import { FUEL_MODELS } from './fuel-models';
import { computeRiskScore, estimateMoisture, runRothermel } from './rothermel';

test('estimateMoisture returns increasing dead fuel moistures', () => {
  const moisture = estimateMoisture(30, 85);
  assert.ok(moisture.m1 >= 2);
  assert.ok(moisture.m10 >= moisture.m1);
  assert.ok(moisture.m100 >= moisture.m10);
});

test('runRothermel returns non-burnable for urban fuel', () => {
  const result = runRothermel(FUEL_MODELS.NB1, estimateMoisture(40, 70), 5, 0);
  assert.equal(result.nonBurnable, true);
  assert.equal(result.fuelCode, 'NB1');
});

test('runRothermel produces spread and flame for timber litter', () => {
  const fuel = FUEL_MODELS.TL3;
  const moisture = estimateMoisture(20, 90);
  const result = runRothermel(fuel, moisture, 12, 15);

  assert.equal(result.nonBurnable, false);
  assert.ok((result.spreadChainsPerHr ?? 0) > 0);
  assert.ok((result.flameLengthFt ?? 0) > 0);
});

test('computeRiskScore returns band and weighted subscores', () => {
  const fire = runRothermel(FUEL_MODELS.SH7, estimateMoisture(15, 95), 20, 25);
  const risk = computeRiskScore(fire, 15, 20);

  assert.ok(risk.score >= 0 && risk.score <= 100);
  assert.ok(['Low', 'Moderate', 'High', 'Extreme'].includes(risk.band));
  assert.equal(risk.subscores.ros.weight, 0.4);
  assert.equal(risk.subscores.flame.weight, 0.3);
});
