export type WoodSpeciesId =
  | 'oak'
  | 'hickory'
  | 'black-locust'
  | 'apple'
  | 'ash'
  | 'birch'
  | 'maple'
  | 'douglas-fir'
  | 'lodgepole-pine'
  | 'ponderosa-pine'
  | 'larch-tamarack'
  | 'aspen';

export interface WoodSpecies {
  id: WoodSpeciesId;
  label: string;
  btuPerCordMillions: number;
}

export interface LogDimensions {
  bottomDiameterIn: number;
  topDiameterIn: number;
  heightFt: number;
}

export interface LogMetrics {
  volumeCubicInches: number;
  volumeCubicFeet: number;
  cords: number;
  faceCords: number;
  dimensions: LogDimensions;
}

export interface BtuEstimate {
  btusMillions: number;
  btusAbsolute: number;
  species: WoodSpeciesId;
  heatingContext: string | null;
}

export interface LogCalculationResult {
  cords: number;
  faceCords: number;
  volumeCubicInches: number;
  volumeCubicFeet: number;
  btus: number | null;
  btusMillions: number | null;
  species: WoodSpeciesId | null;
  dimensions: LogDimensions;
  heatingContext: string | null;
}

export interface LogTotals {
  totalCords: number;
  totalFaceCords: number;
  totalVolumeCubicInches: number;
  totalVolumeCubicFeet: number;
  totalBtusMillions: number | null;
  totalBtusAbsolute: number | null;
  logCount: number;
  calculatedLogCount: number;
}

export interface FirewoodLogState {
  id: string;
  name: string;
  bottomDiameter: string;
  topDiameter: string;
  height: string;
  speciesId: WoodSpeciesId | null;
}

export interface FirewoodLogWithResults extends FirewoodLogState {
  results: LogCalculationResult | null;
}

export interface DimensionValidation {
  isValid: boolean;
  value: number | null;
  error: string | null;
}
