import { geocodeAddress } from './geocoding';
import { formatCoordinateLabel } from './location';
import { fetchFuelContext } from './landfire';
import { computeRiskScore, estimateMoisture, runRothermel } from './rothermel';
import type { GeoResult, WeatherInputs, WildfireRiskInputState, WildfireRiskResult } from './types';
import { fetchElevation, fetchFireWeatherOutlook, fetchWeather } from './weather';

async function resolveGeo(state: WildfireRiskInputState): Promise<GeoResult> {
  if (state.deviceLocation) {
    const { lat, lon } = state.deviceLocation;
    const label = state.address.trim() || formatCoordinateLabel(lat, lon);
    return { lat, lon, label };
  }

  const address = state.address.trim();
  if (!address) {
    throw new Error('Enter a property address or use your current location.');
  }

  return geocodeAddress(address);
}

function getWeatherInputs(
  state: WildfireRiskInputState,
  liveWeather: { windMph: number; rh: number; tempF: number } | null,
): WeatherInputs {
  if (state.useCustomWeather) {
    return {
      windMph: parseFloat(state.windOverride) || 5,
      rh: parseFloat(state.humidityOverride) || 40,
      tempF: parseFloat(state.tempOverride) || 70,
      source: 'Based on your custom weather inputs',
    };
  }

  if (liveWeather) {
    return { ...liveWeather, source: 'Based on current weather at this location' };
  }

  return {
    windMph: 5,
    rh: 40,
    tempF: 70,
    source: 'Based on current weather at this location',
  };
}

export async function runWildfireRiskCalculation(
  state: WildfireRiskInputState,
): Promise<WildfireRiskResult> {
  const geo = await resolveGeo(state);

  const [fuelCtx, weatherApi, elevation, outlook] = await Promise.all([
    fetchFuelContext(geo.lat, geo.lon),
    fetchWeather(geo.lat, geo.lon),
    fetchElevation(geo.lat, geo.lon),
    fetchFireWeatherOutlook(geo.lat, geo.lon),
  ]);

  const weather = getWeatherInputs(state, weatherApi);
  const moisture = estimateMoisture(weather.rh, weather.tempF);
  const analysis = fuelCtx.analysis;
  const fire = runRothermel(analysis.fuel, moisture, weather.windMph, analysis.slopeDeg);

  let risk = null;
  if (!fire.nonBurnable) {
    risk = computeRiskScore(fire, weather.rh, weather.windMph);
  }

  const weatherSource = fuelCtx.siteNote
    ? `${weather.source} · Score uses nearest wildland fuels`
    : weather.source;

  return {
    geo,
    env: fuelCtx.site,
    fire,
    risk,
    weather,
    elevation,
    weatherSource,
    siteNote: fuelCtx.siteNote,
    outlook,
  };
}

export function formatWeatherForInputs(weather: { windMph: number; rh: number; tempF: number }) {
  return {
    windOverride: weather.windMph.toFixed(1),
    humidityOverride: weather.rh.toFixed(0),
    tempOverride: weather.tempF.toFixed(0),
  };
}
