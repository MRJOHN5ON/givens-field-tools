export type RiskBand = 'Low' | 'Moderate' | 'High' | 'Extreme';

export type SeverityLevel = 'neutral' | 'low' | 'moderate' | 'high' | 'critical';

export type FuelModel = {
  code: string;
  name: string;
  nonBurnable: boolean;
  depth?: number;
  mx?: number;
  heatDead?: number;
  heatLive?: number;
  loadLbFt2?: number[];
  sav?: number[];
};

export type GeoResult = {
  lat: number;
  lon: number;
  label: string;
};

export type WeatherInputs = {
  windMph: number;
  rh: number;
  tempF: number;
  source: string;
};

export type FuelMoisture = {
  m1: number;
  m10: number;
  m100: number;
  herb: number;
  stem: number;
};

export type RothermelResult = {
  nonBurnable: boolean;
  spreadFtPerMin?: number;
  spreadChainsPerHr?: number;
  flameLengthFt?: number;
  reactionIntensity?: number;
  fuelCode: string;
  fuelName: string;
  slopeDeg?: number;
  windMph?: number;
  moisture1h?: number;
  etaM?: number;
  phiW?: number;
  phiS?: number;
};

export type RiskSubscore = {
  value: number;
  weight: number;
  label: string;
};

export type RiskScore = {
  score: number;
  band: RiskBand;
  subscores: {
    ros: RiskSubscore;
    flame: RiskSubscore;
    slope: RiskSubscore;
    weather: RiskSubscore;
  };
};

export type SiteFuels = {
  fuel: FuelModel;
  fbfmValue: number;
  slopeDeg: number;
  canopyPct: number;
  lat: number;
  lon: number;
};

export type NearbyFuel = {
  distanceM: number;
  bearing: string;
  fbfmValue: number;
  fuel: FuelModel;
  lat: number;
  lon: number;
};

export type SiteNote = {
  siteFuel: FuelModel;
  nearest: NearbyFuel;
  nearbyFuels: NearbyFuel[];
};

export type OutlookDay = {
  date: string;
  rhMin: number;
  windMax: number;
  tempMax: number;
  stress: number;
  level: SeverityLevel;
};

export type NwsAlert = {
  event: string;
  headline: string;
  severity: string;
  expires: string;
};

export type FireWeatherOutlook = {
  days: OutlookDay[];
  peakDays: OutlookDay[];
  summary: string | null;
  alerts: NwsAlert[];
  trend: 'steady' | 'drying' | 'heating';
  horizonDays: number;
};

export type DeviceLocationPin = {
  lat: number;
  lon: number;
};

export type WildfireRiskInputState = {
  address: string;
  deviceLocation: DeviceLocationPin | null;
  useCustomWeather: boolean;
  windOverride: string;
  humidityOverride: string;
  tempOverride: string;
};

export type WildfireRiskResult = {
  geo: GeoResult;
  env: SiteFuels;
  fire: RothermelResult;
  risk: RiskScore | null;
  weather: WeatherInputs;
  elevation: number | null;
  weatherSource: string;
  siteNote: SiteNote | null;
  outlook: FireWeatherOutlook;
};
