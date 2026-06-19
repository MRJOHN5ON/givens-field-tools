import { File } from 'expo-file-system';
import { fetch } from 'expo/fetch';
import { PLANT_IDENTIFIER_CONFIG } from '@/lib/plant-identifier/config';
import type { CompressedPhoto } from '@/lib/plant-identifier/compress';
import type { PlantNetResponse } from '@/lib/plant-identifier/types';

function buildFormData(photos: CompressedPhoto[]): FormData {
  const form = new FormData();
  for (const photo of photos) {
    form.append('images', new File(photo.uri), photo.name);
    form.append('organs', 'auto');
  }
  return form;
}

function apiErrorMessage(status: number, data: PlantNetResponse): string {
  const raw = data.message || data.error || data.status;
  if (typeof raw === 'string' && raw.trim()) {
    if (raw.includes('remote IP not allowed') || raw.includes('Origin not allowed')) {
      return 'Plant identification could not reach the API. The proxy may need a redeploy, or Pl@ntNet API key settings may need updating.';
    }
    if (status === 404 || raw.includes('Species not found')) {
      return 'No plant species matched that photo. Try a closer shot of leaves, flowers, fruit, or bark in good light.';
    }
    return raw;
  }
  if (status === 404) {
    return 'No plant species matched that photo. Try a closer shot of leaves, flowers, fruit, or bark in good light.';
  }
  if (status === 401 || status === 403) {
    return 'Identification service authentication failed. Please try again later.';
  }
  return 'Identification failed. Please try another photo.';
}

export type IdentifyResult = {
  data: PlantNetResponse;
  remainingRequests: number | null;
};

export async function identifyPlant(photos: CompressedPhoto[]): Promise<IdentifyResult> {
  const url = PLANT_IDENTIFIER_CONFIG.plantnetProxyUrl;
  if (!url) {
    throw new Error('Plant identification is not configured yet. Please check back soon.');
  }

  const response = await fetch(url, {
    method: 'POST',
    body: buildFormData(photos),
  });

  let data: PlantNetResponse = {};
  try {
    data = (await response.json()) as PlantNetResponse;
  } catch {
    data = {};
  }

  const remaining =
    typeof data.remainingIdentificationRequests === 'number'
      ? data.remainingIdentificationRequests
      : null;

  if (response.status === 429) {
    throw new Error('Our plant ID tool has hit its daily limit — check back tomorrow!');
  }

  if (response.status < 200 || response.status >= 300) {
    throw new Error(apiErrorMessage(response.status, data));
  }

  if (!data.results?.length) {
    throw new Error('No matches found. Try a clearer photo of leaves, bark, or the whole plant.');
  }

  return { data, remainingRequests: remaining };
}
