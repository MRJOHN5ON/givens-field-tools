import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  confidencePercent,
  getCommonName,
  getScientificName,
  lookupFireRisk,
} from '@/lib/plant-identifier/fire-risk';
import type { PlantNetResult } from '@/lib/plant-identifier/types';

function makeResult(overrides: Partial<PlantNetResult> = {}): PlantNetResult {
  return {
    score: 0.82,
    species: {
      scientificNameWithoutAuthor: 'Pinus ponderosa',
      commonNames: ['Ponderosa Pine'],
    },
    ...overrides,
  };
}

describe('plant identifier fire-risk lookup', () => {
  it('matches ponderosa pine to high fire risk', () => {
    const risk = lookupFireRisk(makeResult());
    assert.equal(risk.risk, 'high');
    assert.equal(risk.displayName, 'Ponderosa Pine');
    assert.match(risk.note, /High fire risk/i);
  });

  it('returns generic note for unknown species', () => {
    const risk = lookupFireRisk(
      makeResult({
        species: {
          scientificNameWithoutAuthor: 'Totally unknownus plantus',
          commonNames: ['Mystery Plant'],
        },
      }),
    );
    assert.equal(risk.risk, 'unknown');
    assert.match(risk.note, /No fire risk data on file/i);
  });

  it('formats names and confidence', () => {
    const result = makeResult({
      score: 0.756,
      species: {
        scientificNameWithoutAuthor: 'Pinus ponderosa',
        scientificNameAuthorship: 'Douglas ex C.Lawson',
        commonNames: ['Ponderosa Pine'],
      },
    });
    assert.equal(getCommonName(result), 'Ponderosa Pine');
    assert.equal(getScientificName(result), 'Pinus ponderosa Douglas ex C.Lawson');
    assert.equal(confidencePercent(result.score), 76);
  });
});
