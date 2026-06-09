import * as Location from 'expo-location';
import { WILDFIRE_CONFIG } from './config';
import type { GeoResult } from './types';

export async function requestDeviceLocationPermission(): Promise<boolean> {
  const { status } = await Location.requestForegroundPermissionsAsync();
  return status === Location.PermissionStatus.GRANTED;
}

export async function getDeviceCoordinates(): Promise<{ lat: number; lon: number }> {
  const position = await Location.getCurrentPositionAsync({
    accuracy: Location.Accuracy.Balanced,
  });

  return {
    lat: position.coords.latitude,
    lon: position.coords.longitude,
  };
}

export async function reverseGeocodeCoordinates(lat: number, lon: number): Promise<string> {
  const params = new URLSearchParams({
    lat: String(lat),
    lon: String(lon),
    format: 'json',
    zoom: '18',
    addressdetails: '1',
  });

  const res = await fetch(`${WILDFIRE_CONFIG.geocoderUrl}/reverse?${params}`, {
    headers: {
      Accept: 'application/json',
      'User-Agent': WILDFIRE_CONFIG.geocoderAgent,
    },
  });

  if (!res.ok) {
    return formatCoordinateLabel(lat, lon);
  }

  const data = (await res.json()) as { display_name?: string };
  return data.display_name?.trim() || formatCoordinateLabel(lat, lon);
}

export function formatCoordinateLabel(lat: number, lon: number) {
  return `Your location (${lat.toFixed(5)}, ${lon.toFixed(5)})`;
}

export async function resolveDeviceLocation(): Promise<GeoResult> {
  const granted = await requestDeviceLocationPermission();
  if (!granted) {
    throw new Error('Location permission is required to use your current position.');
  }

  const { lat, lon } = await getDeviceCoordinates();
  const label = await reverseGeocodeCoordinates(lat, lon);

  return { lat, lon, label };
}
