import { WILDFIRE_CONFIG } from './config';
import { mapLandfireValue } from './fuel-models';
import type { FuelModel, NearbyFuel, SiteFuels, SiteNote } from './types';

async function landfireSample(layerPath: string, lat: number, lon: number): Promise<number | null> {
  const geometry = JSON.stringify({ x: lon, y: lat, spatialReference: { wkid: 4326 } });
  const params = new URLSearchParams({
    geometry,
    geometryType: 'esriGeometryPoint',
    returnFirstOnly: 'true',
    sampleCount: '1',
    sampleDistance: '0',
    units: 'esriSRUnit_Meter',
    f: 'json',
  });

  const url = `${WILDFIRE_CONFIG.landfireBase}/${layerPath}/getSamples?${params}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Fuel map data unavailable.');

  const data = (await res.json()) as {
    samples?: Array<{ value?: string | number }>;
  };

  const sample = data.samples?.[0];
  if (!sample || sample.value === 'NoData' || sample.value === '-9999') return null;
  return parseFloat(String(sample.value));
}

function offsetLatLon(lat: number, lon: number, distanceM: number, bearingDeg: number) {
  const earth = 6378137;
  const br = (bearingDeg * Math.PI) / 180;
  const latR = (lat * Math.PI) / 180;
  const lonR = (lon * Math.PI) / 180;
  const ang = distanceM / earth;
  const lat2 = Math.asin(
    Math.sin(latR) * Math.cos(ang) + Math.cos(latR) * Math.sin(ang) * Math.cos(br),
  );
  const lon2 =
    lonR +
    Math.atan2(
      Math.sin(br) * Math.sin(ang) * Math.cos(latR),
      Math.cos(ang) - Math.sin(latR) * Math.sin(lat2),
    );

  return {
    lat: (lat2 * 180) / Math.PI,
    lon: (((lon2 * 180) / Math.PI + 540) % 360) - 180,
  };
}

async function fetchPointFuels(lat: number, lon: number): Promise<SiteFuels | null> {
  const [fbfmVal, slopeVal, canopyVal] = await Promise.all([
    landfireSample(WILDFIRE_CONFIG.landfireLayers.fbfm40, lat, lon),
    landfireSample(WILDFIRE_CONFIG.landfireLayers.slope, lat, lon),
    landfireSample(WILDFIRE_CONFIG.landfireLayers.canopy, lat, lon),
  ]);

  if (fbfmVal === null) return null;
  const fuel = mapLandfireValue(Math.round(fbfmVal));
  if (!fuel) return null;

  return {
    fuel,
    fbfmValue: Math.round(fbfmVal),
    slopeDeg: slopeVal !== null ? slopeVal : 0,
    canopyPct: canopyVal !== null ? Math.round(canopyVal) : 0,
    lat,
    lon,
  };
}

async function sampleNearbyWildlandFuels(lat: number, lon: number) {
  const jobs: Array<{ distanceM: number; bearing: string; lat: number; lon: number }> = [];

  for (const distanceM of WILDFIRE_CONFIG.nearbyDistancesM) {
    for (const bearing of WILDFIRE_CONFIG.nearbyBearings) {
      const point = offsetLatLon(lat, lon, distanceM, bearing.deg);
      jobs.push({ distanceM, bearing: bearing.label, ...point });
    }
  }

  const results = await Promise.all(
    jobs.map(async (job) => {
      const fbfmVal = await landfireSample(WILDFIRE_CONFIG.landfireLayers.fbfm40, job.lat, job.lon);
      if (fbfmVal === null) return null;
      const fuel = mapLandfireValue(Math.round(fbfmVal));
      if (!fuel || fuel.nonBurnable) return null;

      return {
        distanceM: job.distanceM,
        bearing: job.bearing,
        fbfmValue: Math.round(fbfmVal),
        fuel,
        lat: job.lat,
        lon: job.lon,
      } satisfies NearbyFuel;
    }),
  );

  const burnable = results.filter((item): item is NearbyFuel => item !== null).sort((a, b) => a.distanceM - b.distanceM);
  const unique: NearbyFuel[] = [];
  const seen = new Set<string>();

  for (const item of burnable) {
    if (seen.has(item.fuel.code)) continue;
    seen.add(item.fuel.code);
    unique.push(item);
  }

  return {
    nearest: burnable[0] ?? null,
    unique: unique.slice(0, 5),
  };
}

export type FuelContext = {
  site: SiteFuels;
  analysis: {
    fuel: FuelModel;
    slopeDeg: number;
    canopyPct: number;
    lat: number;
    lon: number;
    source: 'site' | 'nearby-wildland';
  };
  siteNote: SiteNote | null;
};

export async function fetchFuelContext(lat: number, lon: number): Promise<FuelContext> {
  const site = await fetchPointFuels(lat, lon);
  if (!site) {
    throw new Error(
      'No fuel data for this location. CONUS coverage only — try a nearby rural address.',
    );
  }

  let nearby = { nearest: null as NearbyFuel | null, unique: [] as NearbyFuel[] };
  if (site.fuel.nonBurnable) {
    nearby = await sampleNearbyWildlandFuels(lat, lon);
  }

  let analysis: FuelContext['analysis'] = {
    fuel: site.fuel,
    slopeDeg: site.slopeDeg,
    canopyPct: site.canopyPct,
    lat,
    lon,
    source: 'site',
  };

  let siteNote: SiteNote | null = null;

  if (site.fuel.nonBurnable && nearby.nearest) {
    const nbSlope = await landfireSample(
      WILDFIRE_CONFIG.landfireLayers.slope,
      nearby.nearest.lat,
      nearby.nearest.lon,
    );

    analysis = {
      fuel: nearby.nearest.fuel,
      slopeDeg: nbSlope !== null ? nbSlope : site.slopeDeg,
      canopyPct: site.canopyPct,
      lat: nearby.nearest.lat,
      lon: nearby.nearest.lon,
      source: 'nearby-wildland',
    };

    siteNote = {
      siteFuel: site.fuel,
      nearest: nearby.nearest,
      nearbyFuels: nearby.unique,
    };
  }

  return { site, analysis, siteNote };
}
