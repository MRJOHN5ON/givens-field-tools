export const WILDFIRE_CONFIG = {
  geocoderUrl: 'https://nominatim.openstreetmap.org/search',
  censusGeocoderUrl: 'https://geocoding.geo.census.gov/geocoder/locations/onelineaddress',
  geocoderAgent:
    'GivensFireForestry-WildfireRiskTool/1.0 (https://www.givensfireandforestry.com; contact@givensfireandforestry.com)',
  landfireBase: 'https://lfps.usgs.gov/arcgis/rest/services',
  landfireLayers: {
    fbfm40: 'Landfire_LF2024/LF2024_FBFM40_CONUS/ImageServer',
    slope: 'Landfire_Topo/LF2020_SlpD_CONUS/ImageServer',
    canopy: 'Landfire_LF2024/LF2024_CC_CONUS/ImageServer',
  },
  scoreWeights: { ros: 0.4, flame: 0.3, slope: 0.2, weather: 0.1 },
  scoreCaps: { rosChainsPerHr: 30, flameLengthFt: 25, slopePercent: 50 },
  nearbyDistancesM: [150, 300, 500] as const,
  nearbyBearings: [
    { deg: 0, label: 'north' },
    { deg: 45, label: 'northeast' },
    { deg: 90, label: 'east' },
    { deg: 135, label: 'southeast' },
    { deg: 180, label: 'south' },
    { deg: 225, label: 'southwest' },
    { deg: 270, label: 'west' },
    { deg: 315, label: 'northwest' },
  ] as const,
  nwsUserAgent:
    'GivensFireForestry-WildfireRiskTool/1.0 (https://www.givensfireandforestry.com; contact@givensfireandforestry.com)',
} as const;

export const NOAA_SEASONAL_LINKS = [
  { label: 'CPC Drought Outlook', url: 'https://www.cpc.ncep.noaa.gov/products/Drought/' },
  {
    label: 'CPC Seasonal Outlook',
    url: 'https://www.cpc.ncep.noaa.gov/products/predictions/long_range/',
  },
  { label: 'Drought.gov Conditions', url: 'https://www.drought.gov/current-conditions' },
] as const;

export const DATA_SOURCES = [
  {
    label: 'US fuel-layer maps',
    url: 'https://landfire.gov/',
    note: 'LANDFIRE program (fuel models, slope, canopy)',
  },
  {
    label: 'Open-Meteo',
    url: 'https://open-meteo.com/',
    note: 'current weather & 16-day forecast',
  },
  {
    label: 'National Weather Service',
    url: 'https://www.weather.gov/',
    note: 'fire weather alerts',
  },
  {
    label: 'US Census Geocoder',
    url: 'https://geocoding.geo.census.gov/',
    note: 'US rural addresses',
  },
  {
    label: 'OpenStreetMap',
    url: 'https://www.openstreetmap.org/',
    note: 'address search',
  },
] as const;
