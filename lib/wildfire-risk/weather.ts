import { WILDFIRE_CONFIG } from './config';
import type { FireWeatherOutlook, NwsAlert, OutlookDay, SeverityLevel } from './types';

function average(values: Array<number | null | undefined>) {
  const nums = values.filter((v): v is number => Number.isFinite(v));
  if (!nums.length) return null;
  return nums.reduce((a, b) => a + b, 0) / nums.length;
}

function assessDayFireStress(
  rhMin: number | null,
  windMax: number | null,
  tempMax: number | null,
): { stress: number; level: SeverityLevel } {
  let stress = 0;
  if (rhMin !== null && rhMin < 12) stress += 4;
  else if (rhMin !== null && rhMin < 20) stress += 3;
  else if (rhMin !== null && rhMin < 30) stress += 1;
  if (windMax !== null && windMax >= 20) stress += 2;
  else if (windMax !== null && windMax >= 12) stress += 1;
  if (tempMax !== null && tempMax >= 100) stress += 2;
  else if (tempMax !== null && tempMax >= 90) stress += 1;

  let level: SeverityLevel = 'low';
  if (stress >= 5) level = 'critical';
  else if (stress >= 3) level = 'high';
  else if (stress >= 2) level = 'moderate';

  return { stress, level };
}

async function fetchNwsAlerts(lat: number, lon: number): Promise<NwsAlert[]> {
  try {
    const res = await fetch(`https://api.weather.gov/alerts/active?point=${lat},${lon}`, {
      headers: {
        'User-Agent': WILDFIRE_CONFIG.nwsUserAgent,
        Accept: 'application/geo+json',
      },
    });

    if (!res.ok) return [];

    const data = (await res.json()) as {
      features?: Array<{ properties?: Record<string, string> }>;
    };

    const fireTerms = /fire|red flag|smoke|air quality/i;
    return (data.features || [])
      .map((f) => f.properties)
      .filter((p): p is Record<string, string> => Boolean(p))
      .filter((p) => fireTerms.test(`${p.event || ''} ${p.headline || ''}`))
      .map((p) => ({
        event: p.event,
        headline: p.headline,
        severity: p.severity,
        expires: p.expires,
      }));
  } catch {
    return [];
  }
}

function formatShortDate(isoDate: string) {
  if (!isoDate) return '';
  const d = new Date(`${isoDate}T12:00:00`);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function fmtNum(value: number | null | undefined, digits: number) {
  return Number.isFinite(value) ? (value as number).toFixed(digits) : '—';
}

export async function fetchFireWeatherOutlook(lat: number, lon: number): Promise<FireWeatherOutlook> {
  const params = new URLSearchParams({
    latitude: String(lat),
    longitude: String(lon),
    daily: 'relative_humidity_2m_min,wind_speed_10m_max,temperature_2m_max',
    wind_speed_unit: 'mph',
    temperature_unit: 'fahrenheit',
    forecast_days: '16',
    timezone: 'auto',
  });

  const [dailyRes, alerts] = await Promise.all([
    fetch(`https://api.open-meteo.com/v1/forecast?${params}`),
    fetchNwsAlerts(lat, lon),
  ]);

  if (!dailyRes.ok) {
    return { days: [], peakDays: [], summary: null, alerts, trend: 'steady', horizonDays: 0 };
  }

  const data = (await dailyRes.json()) as {
    daily?: {
      time?: string[];
      relative_humidity_2m_min?: number[];
      wind_speed_10m_max?: number[];
      temperature_2m_max?: number[];
    };
  };

  const d = data.daily ?? {};
  const days: OutlookDay[] = (d.time || []).map((date, i) => {
    const rhMin = d.relative_humidity_2m_min?.[i] ?? 0;
    const windMax = d.wind_speed_10m_max?.[i] ?? 0;
    const tempMax = d.temperature_2m_max?.[i] ?? 0;
    const assessed = assessDayFireStress(rhMin, windMax, tempMax);
    return { date, rhMin, windMax, tempMax, ...assessed };
  });

  const ranked = [...days].sort((a, b) => b.stress - a.stress);
  const peakDays = ranked.filter((day) => day.stress >= 2).slice(0, 5);
  const firstRh = average(days.slice(0, 3).map((day) => day.rhMin));
  const lastRh = average(days.slice(-3).map((day) => day.rhMin));
  const firstTemp = average(days.slice(0, 3).map((day) => day.tempMax));
  const lastTemp = average(days.slice(-3).map((day) => day.tempMax));

  let trend: FireWeatherOutlook['trend'] = 'steady';
  if (lastRh !== null && firstRh !== null && lastRh < firstRh - 8) trend = 'drying';
  if (lastTemp !== null && firstTemp !== null && lastTemp > firstTemp + 8) trend = 'heating';

  let summary: string | null = null;
  if (peakDays.length) {
    const worst = peakDays[0];
    const dateLabel = formatShortDate(worst.date);
    summary = `Peak fire-weather stress around ${dateLabel}: RH near ${fmtNum(worst.rhMin, 0)}%, winds to ${fmtNum(worst.windMax, 0)} mph, highs near ${fmtNum(worst.tempMax, 0)}°F.`;
    if (trend === 'drying' || trend === 'heating') {
      summary += ' Conditions trend hotter and drier over the next two weeks.';
    }
  } else {
    summary = 'No major drying or wind spikes in the 16-day outlook — still watch daily shifts.';
  }

  return { days, peakDays, summary, alerts, trend, horizonDays: days.length };
}

export async function fetchWeather(lat: number, lon: number) {
  const params = new URLSearchParams({
    latitude: String(lat),
    longitude: String(lon),
    current: 'wind_speed_10m,relative_humidity_2m,temperature_2m',
    wind_speed_unit: 'mph',
    temperature_unit: 'fahrenheit',
    timezone: 'auto',
  });

  const res = await fetch(`https://api.open-meteo.com/v1/forecast?${params}`);
  if (!res.ok) throw new Error('Weather data unavailable.');

  const data = (await res.json()) as {
    current?: {
      wind_speed_10m?: number;
      relative_humidity_2m?: number;
      temperature_2m?: number;
    };
  };

  const c = data.current ?? {};
  return {
    windMph: c.wind_speed_10m ?? 5,
    rh: c.relative_humidity_2m ?? 40,
    tempF: c.temperature_2m ?? 70,
  };
}

export async function fetchElevation(lat: number, lon: number): Promise<number | null> {
  const params = new URLSearchParams({ latitude: String(lat), longitude: String(lon) });
  const res = await fetch(`https://api.open-meteo.com/v1/elevation?${params}`);
  if (!res.ok) return null;

  const data = (await res.json()) as { elevation?: number[] };
  return data.elevation ? data.elevation[0] : null;
}
