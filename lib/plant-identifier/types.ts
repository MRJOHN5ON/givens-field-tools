export type PlantRiskLevel =
  | 'extreme'
  | 'very_high'
  | 'high'
  | 'moderate'
  | 'low'
  | 'unknown';

export type SpeciesRiskEntry = {
  risk: PlantRiskLevel;
  riskLabel: string;
  names: string[];
  displayName: string | null;
  note: string;
};

export type PlantNetSpecies = {
  scientificNameWithoutAuthor?: string;
  scientificName?: string;
  scientificNameAuthorship?: string;
  commonNames?: string[];
  genus?: {
    scientificNameWithoutAuthor?: string;
    scientificName?: string;
  };
};

export type PlantNetResult = {
  score: number;
  species: PlantNetSpecies;
};

export type PlantNetResponse = {
  results?: PlantNetResult[];
  remainingIdentificationRequests?: number;
  message?: string;
  error?: string;
  status?: string;
};

export type QueuedPhoto = {
  id: number;
  uri: string;
};

export type ProcessedMatch = {
  rank: number;
  commonName: string;
  scientificName: string;
  confidence: number;
  risk: PlantRiskLevel;
  riskLabel: string;
  note: string;
};

export type IdentifyView = 'upload' | 'loading' | 'results' | 'error';

export type CtaConfig = {
  lead: string;
  action: string;
  risk: PlantRiskLevel;
};
