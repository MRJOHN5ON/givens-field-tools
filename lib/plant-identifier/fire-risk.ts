import { PLANT_IDENTIFIER_SPECIES } from '@/constants/plant-identifier-species-data';
import type { PlantNetResult, PlantRiskLevel, SpeciesRiskEntry } from '@/lib/plant-identifier/types';

const GENERIC_NOTE: SpeciesRiskEntry = {
  risk: 'unknown',
  riskLabel: 'No data on file',
  displayName: null,
  names: [],
  note: 'No fire risk data on file for this species in our Montana library yet. We cover conifers, native shrubs, invasive weeds, rangeland grasses, and common landscape plants — but not every species. Contact us for an on-site assessment.',
};

export const RISK_RANK: Record<PlantRiskLevel, number> = {
  extreme: 5,
  very_high: 4,
  high: 3,
  moderate: 2,
  low: 1,
  unknown: 0,
};

export const CTA_BY_RISK = {
  extreme: {
    lead: 'This species is a fire hazard near structures.',
    action: 'Get a free defensible space quote',
    risk: 'extreme' as const,
  },
  very_high: {
    lead: 'This species is a fire hazard near structures.',
    action: 'Get a free defensible space quote',
    risk: 'very_high' as const,
  },
  high: {
    lead: 'This species is a fire hazard near structures.',
    action: 'Get a free defensible space quote',
    risk: 'high' as const,
  },
  moderate: {
    lead: 'Want an on-site assessment?',
    action: 'Get a free quote',
    risk: 'moderate' as const,
  },
  low: {
    lead: "Questions about your property's fire risk?",
    action: 'Free defensible space consultations',
    risk: 'low' as const,
  },
  unknown: {
    lead: 'Want an on-site assessment?',
    action: 'Get a free quote',
    risk: 'unknown' as const,
  },
} as const;

function normalizeText(value: string): string {
  return String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function speciesHaystack(result: PlantNetResult): string[] {
  const species = result.species || {};
  const parts = [
    species.scientificNameWithoutAuthor,
    species.scientificName,
    species.genus?.scientificNameWithoutAuthor,
    species.genus?.scientificName,
    ...(Array.isArray(species.commonNames) ? species.commonNames : []),
  ];
  return parts.map((part) => normalizeText(part || '')).filter(Boolean);
}

function matchScore(haystack: string[], entry: SpeciesRiskEntry): number {
  let best = 0;
  for (const name of entry.names) {
    const needle = normalizeText(name);
    if (!needle) continue;
    for (const candidate of haystack) {
      if (!candidate) continue;
      if (candidate === needle) {
        best = Math.max(best, 200 + needle.length);
      } else if (candidate.includes(needle)) {
        best = Math.max(best, 100 + needle.length);
      } else if (needle.length >= 5 && needle.includes(candidate)) {
        best = Math.max(best, 50 + candidate.length);
      }
    }
  }
  return best;
}

export function lookupFireRisk(result: PlantNetResult): SpeciesRiskEntry {
  const haystack = speciesHaystack(result);
  let bestEntry: SpeciesRiskEntry | null = null;
  let bestScore = 0;

  for (const entry of PLANT_IDENTIFIER_SPECIES) {
    const score = matchScore(haystack, entry);
    if (score > bestScore) {
      bestScore = score;
      bestEntry = entry;
    }
  }

  return bestScore > 0 && bestEntry ? bestEntry : GENERIC_NOTE;
}

export function getCommonName(result: PlantNetResult): string {
  const species = result.species || {};
  if (Array.isArray(species.commonNames) && species.commonNames.length) {
    return species.commonNames[0];
  }
  return species.scientificNameWithoutAuthor || 'Unknown species';
}

export function getScientificName(result: PlantNetResult): string {
  const species = result.species || {};
  const base = species.scientificNameWithoutAuthor || '';
  const auth = species.scientificNameAuthorship || '';
  if (base && auth) {
    return `${base} ${auth}`;
  }
  return species.scientificName || base || 'Unknown';
}

export function confidencePercent(score: number): number {
  return Math.round(Math.max(0, Math.min(1, score)) * 100);
}

export function highestRiskFromResults(results: PlantNetResult[]): PlantRiskLevel {
  let highest: PlantRiskLevel = 'unknown';
  for (const result of results) {
    const riskInfo = lookupFireRisk(result);
    if (RISK_RANK[riskInfo.risk] > RISK_RANK[highest]) {
      highest = riskInfo.risk;
    }
  }
  return highest;
}
