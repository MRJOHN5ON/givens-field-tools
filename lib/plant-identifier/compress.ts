import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';
import { PLANT_IDENTIFIER_CONFIG } from '@/lib/plant-identifier/config';

export type CompressedPhoto = {
  uri: string;
  name: string;
  type: string;
};

function scaleDimensions(
  width: number,
  height: number,
  maxSize: number,
): { width: number; height: number } {
  if (width <= maxSize && height <= maxSize) {
    return { width, height };
  }
  if (width >= height) {
    return { width: maxSize, height: Math.round(height * (maxSize / width)) };
  }
  return { width: Math.round(width * (maxSize / height)), height: maxSize };
}

export async function compressPhoto(uri: string): Promise<CompressedPhoto> {
  const probe = await manipulateAsync(uri, [], { compress: 1, format: SaveFormat.JPEG });
  const dims = scaleDimensions(
    probe.width,
    probe.height,
    PLANT_IDENTIFIER_CONFIG.maxDimension,
  );

  const resized = await manipulateAsync(
    uri,
    [{ resize: { width: dims.width, height: dims.height } }],
    {
      compress: PLANT_IDENTIFIER_CONFIG.jpegQuality,
      format: SaveFormat.JPEG,
    },
  );

  return {
    uri: resized.uri,
    name: 'plant-photo.jpg',
    type: 'image/jpeg',
  };
}

export async function compressPhotos(uris: string[]): Promise<CompressedPhoto[]> {
  return Promise.all(uris.map(compressPhoto));
}
