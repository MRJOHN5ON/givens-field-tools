import { WILDFIRE_CONFIG } from './config';
import type { GeoResult } from './types';

const NOT_FOUND_MSG =
  'Address not found. Include street, city, and state (e.g. 123 Main St, Helena, MT).';

type NominatimHit = {
  lat: string;
  lon: string;
  display_name: string;
};

async function fetchNominatim(query: string): Promise<GeoResult | null> {
  const params = new URLSearchParams({
    q: query,
    format: 'json',
    limit: '1',
    countrycodes: 'us',
  });

  const res = await fetch(`${WILDFIRE_CONFIG.geocoderUrl}?${params}`, {
    headers: {
      Accept: 'application/json',
      'User-Agent': WILDFIRE_CONFIG.geocoderAgent,
    },
  });

  if (!res.ok) return null;
  const data = (await res.json()) as NominatimHit[];
  if (!data.length) return null;

  return {
    lat: parseFloat(data[0].lat),
    lon: parseFloat(data[0].lon),
    label: data[0].display_name,
  };
}

async function geocodeViaNominatim(address: string): Promise<GeoResult | null> {
  const queries = [address];
  const withoutZip = address.replace(/,?\s*\d{5}(-\d{4})?\s*$/i, '').trim();
  if (withoutZip && withoutZip !== address) queries.push(withoutZip);

  for (const q of queries) {
    const hit = await fetchNominatim(q);
    if (hit) return hit;
  }

  return null;
}

async function geocodeViaCensus(address: string): Promise<GeoResult> {
  const params = new URLSearchParams({
    address,
    benchmark: 'Public_AR_Current',
    format: 'json',
  });

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 15000);

  try {
    const res = await fetch(`${WILDFIRE_CONFIG.censusGeocoderUrl}?${params}`, {
      signal: controller.signal,
    });

    if (!res.ok) {
      throw new Error('Geocoding service unavailable.');
    }

    const payload = (await res.json()) as {
      result?: {
        addressMatches?: Array<{
          matchedAddress?: string;
          coordinates?: { x: number; y: number };
        }>;
      };
    };

    const match = payload.result?.addressMatches?.[0];
    if (!match?.coordinates) {
      throw new Error(NOT_FOUND_MSG);
    }

    return {
      lat: match.coordinates.y,
      lon: match.coordinates.x,
      label: match.matchedAddress || address,
    };
  } catch (err) {
    if (err instanceof Error && err.name === 'AbortError') {
      throw new Error('Geocoding timed out. Please try again.');
    }
    throw err;
  } finally {
    clearTimeout(timer);
  }
}

export async function geocodeAddress(address: string): Promise<GeoResult> {
  const nominatim = await geocodeViaNominatim(address);
  if (nominatim) return nominatim;
  return geocodeViaCensus(address);
}

export type AddressSuggestion = {
  display_name: string;
};

export async function fetchAddressSuggestions(query: string): Promise<AddressSuggestion[]> {
  const params = new URLSearchParams({
    q: query,
    format: 'json',
    addressdetails: '0',
    limit: '6',
    countrycodes: 'us',
  });

  const res = await fetch(`${WILDFIRE_CONFIG.geocoderUrl}?${params}`, {
    headers: {
      Accept: 'application/json',
      'User-Agent': WILDFIRE_CONFIG.geocoderAgent,
    },
  });

  if (!res.ok) return [];
  const data = (await res.json()) as AddressSuggestion[];
  return Array.isArray(data) ? data : [];
}
