/// <reference types="node" />
import assert from 'node:assert/strict';
import test from 'node:test';
import {
  buildTreeHeightResult,
  calculateHeightFromAngle,
  calculateHeightFromClinometer,
  calculateHeightFromLineOfSight,
  calculateHeightFromShadow,
  calculateHeightFromTriangulation,
  calculateTreeHeight,
} from './calculations';
import { convertLength, toMeters } from './units';

const EMPTY_SHADOW_FIELDS = {
  userHeight: '',
  userShadowLength: '',
  treeShadowLength: '',
};

const EMPTY_TRIANGULATION_FIELDS = {
  distance2: '',
  angle2: '',
};

test('calculateHeightFromAngle uses tangent relationship', () => {
  const result = calculateHeightFromAngle(40, 45, null, 'ft');

  assert.ok(result);
  const expectedM = toMeters(40, 'ft') * Math.tan((45 * Math.PI) / 180);
  assert.ok(Math.abs(result.heightM - expectedM) < 0.01);
});

test('calculateHeightFromAngle adds optional eye height', () => {
  const withoutEye = calculateHeightFromAngle(40, 45, null, 'ft');
  const withEye = calculateHeightFromAngle(40, 45, 5.5, 'ft');

  assert.ok(withoutEye);
  assert.ok(withEye);
  assert.ok(withEye.heightM > withoutEye.heightM);
});

test('calculateHeightFromLineOfSight uses Pythagorean theorem', () => {
  const result = calculateHeightFromLineOfSight(30, 50, 'ft');

  assert.ok(result);
  const baseM = toMeters(30, 'ft');
  const sightM = toMeters(50, 'ft');
  const expectedM = Math.sqrt(sightM ** 2 - baseM ** 2);
  assert.ok(Math.abs(result.heightM - expectedM) < 0.01);
});

test('calculateHeightFromShadow uses similar triangles', () => {
  const result = calculateHeightFromShadow(6, 4, 20, 'ft');

  assert.ok(result);
  assert.ok(Math.abs(result.heightM - toMeters(30, 'ft')) < 0.01);
});

test('calculateHeightFromClinometer requires eye height', () => {
  const result = calculateHeightFromClinometer(25, 40, 5.5, 'ft');

  assert.ok(result);
  const expectedM =
    toMeters(25, 'ft') * Math.tan((40 * Math.PI) / 180) + toMeters(5.5, 'ft');
  assert.ok(Math.abs(result.heightM - expectedM) < 0.01);
});

test('calculateHeightFromTriangulation averages two estimates', () => {
  const result = calculateHeightFromTriangulation(20, 35, 25, 30, 'ft');

  assert.ok(result);
  const height1 = toMeters(20, 'ft') * Math.tan((35 * Math.PI) / 180);
  const height2 = toMeters(25, 'ft') * Math.tan((30 * Math.PI) / 180);
  assert.ok(Math.abs(result.heightM - (height1 + height2) / 2) < 0.01);
});

test('calculateTreeHeight supports angle method', () => {
  const result = calculateTreeHeight({
    method: 'angle',
    unit: 'm',
    distance: '12',
    angle: '35',
    eyeHeight: '',
    lineOfSight: '',
    ...EMPTY_SHADOW_FIELDS,
    ...EMPTY_TRIANGULATION_FIELDS,
  });

  assert.ok(result);
  assert.equal(result.method, 'angle');
  assert.ok(result.heightM > 0);
});

test('calculateTreeHeight supports line-of-sight method', () => {
  const result = calculateTreeHeight({
    method: 'line-of-sight',
    unit: 'ft',
    distance: '30',
    angle: '',
    eyeHeight: '',
    lineOfSight: '50',
    ...EMPTY_SHADOW_FIELDS,
    ...EMPTY_TRIANGULATION_FIELDS,
  });

  assert.ok(result);
  assert.equal(result.method, 'line-of-sight');
});

test('calculateTreeHeight supports clinometer method', () => {
  const result = calculateTreeHeight({
    method: 'clinometer',
    unit: 'ft',
    distance: '25',
    angle: '40',
    eyeHeight: '5.5',
    lineOfSight: '',
    ...EMPTY_SHADOW_FIELDS,
    ...EMPTY_TRIANGULATION_FIELDS,
  });

  assert.ok(result);
  assert.equal(result.method, 'clinometer');
});

test('calculateTreeHeight supports triangulation method', () => {
  const result = calculateTreeHeight({
    method: 'triangulation',
    unit: 'ft',
    distance: '20',
    angle: '35',
    eyeHeight: '',
    lineOfSight: '',
    ...EMPTY_SHADOW_FIELDS,
    distance2: '25',
    angle2: '30',
  });

  assert.ok(result);
  assert.equal(result.method, 'triangulation');
});

test('calculateTreeHeight preserves inputs when switching methods in state', () => {
  const state = {
    method: 'shadow' as const,
    unit: 'ft' as const,
    distance: '25',
    angle: '30',
    eyeHeight: '5.5',
    lineOfSight: '40',
    userHeight: '6',
    userShadowLength: '4',
    treeShadowLength: '18',
    distance2: '22',
    angle2: '28',
  };

  const shadowResult = calculateTreeHeight(state);
  assert.ok(shadowResult);
  assert.equal(shadowResult.method, 'shadow');

  const angleResult = calculateTreeHeight({ ...state, method: 'angle' });
  assert.ok(angleResult);
  assert.equal(angleResult.method, 'angle');
});

test('buildTreeHeightResult returns both imperial and metric values', () => {
  const result = buildTreeHeightResult(
    toMeters(30, 'ft'),
    'angle',
    'ft',
    {
      method: 'angle',
      unit: 'ft',
      distance: 40,
      angle: 45,
      eyeHeight: null,
      lineOfSight: null,
      userHeight: null,
      userShadowLength: null,
      treeShadowLength: null,
      distance2: null,
      angle2: null,
    },
    [],
    [],
  );

  assert.ok(Math.abs(result.heightFt - 30) < 0.01);
  assert.ok(result.heightM > 0);
});

test('unit conversion helpers are consistent', () => {
  const meters = toMeters(10, 'ft');
  assert.ok(Math.abs(convertLength(meters, 'm', 'ft') - 10) < 0.001);
});
