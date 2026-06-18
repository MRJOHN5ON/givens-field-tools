import { useCallback, useRef, useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { PLANT_IDENTIFIER_CONFIG } from '@/lib/plant-identifier/config';
import { compressPhotos } from '@/lib/plant-identifier/compress';
import {
  confidencePercent,
  getCommonName,
  getScientificName,
  highestRiskFromResults,
  lookupFireRisk,
  CTA_BY_RISK,
} from '@/lib/plant-identifier/fire-risk';
import { identifyPlant } from '@/lib/plant-identifier/identify';
import type {
  CtaConfig,
  IdentifyView,
  ProcessedMatch,
  QueuedPhoto,
} from '@/lib/plant-identifier/types';

function mapNetworkError(message: string): string {
  if (
    message.includes('Network request failed') ||
    message.includes('Failed to fetch') ||
    message.includes('fetch')
  ) {
    return 'Could not reach the identification service. Check your connection and try again.';
  }
  return message;
}

export function usePlantIdentifier() {
  const [view, setView] = useState<IdentifyView>('upload');
  const [photoQueue, setPhotoQueue] = useState<QueuedPhoto[]>([]);
  const [results, setResults] = useState<ProcessedMatch[]>([]);
  const [resultPhotos, setResultPhotos] = useState<string[]>([]);
  const [cta, setCta] = useState<CtaConfig | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loadingHint, setLoadingHint] = useState<string | null>(null);
  const [quotaRemaining, setQuotaRemaining] = useState<number | null>(null);
  const [identifying, setIdentifying] = useState(false);
  const nextPhotoId = useRef(0);
  const identifyBusy = useRef(false);

  const addUris = useCallback((uris: string[]) => {
    if (!uris.length) return;
    setPhotoQueue((prev) => {
      const room = PLANT_IDENTIFIER_CONFIG.maxPhotos - prev.length;
      if (room <= 0) return prev;
      const additions = uris.slice(0, room).map((uri) => ({
        id: nextPhotoId.current++,
        uri,
      }));
      return [...prev, ...additions];
    });
    setError(null);
  }, []);

  const requestCameraPermission = useCallback(async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    return status === 'granted';
  }, []);

  const requestLibraryPermission = useCallback(async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    return status === 'granted';
  }, []);

  const takePhoto = useCallback(async () => {
    const granted = await requestCameraPermission();
    if (!granted) {
      setError('Camera permission is required to take plant photos.');
      setView('error');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images'],
      quality: 1,
      allowsEditing: false,
    });

    if (!result.canceled && result.assets.length) {
      addUris(result.assets.map((asset) => asset.uri));
    }
  }, [addUris, requestCameraPermission]);

  const pickPhotos = useCallback(async () => {
    const granted = await requestLibraryPermission();
    if (!granted) {
      setError('Photo library permission is required to upload plant photos.');
      setView('error');
      return;
    }

    const room = PLANT_IDENTIFIER_CONFIG.maxPhotos - photoQueue.length;
    if (room <= 0) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 1,
      allowsMultipleSelection: true,
      selectionLimit: room,
      allowsEditing: false,
    });

    if (!result.canceled && result.assets.length) {
      addUris(result.assets.map((asset) => asset.uri));
    }
  }, [addUris, photoQueue.length, requestLibraryPermission]);

  const removePhoto = useCallback((photoId: number) => {
    setPhotoQueue((prev) => prev.filter((item) => item.id !== photoId));
  }, []);

  const processResults = useCallback((data: Awaited<ReturnType<typeof identifyPlant>>['data'], previewUris: string[]) => {
    const top = (data.results || []).slice(0, PLANT_IDENTIFIER_CONFIG.topResults);
    const processed: ProcessedMatch[] = top.map((result, index) => {
      const riskInfo = lookupFireRisk(result);
      return {
        rank: index + 1,
        commonName: getCommonName(result),
        scientificName: getScientificName(result),
        confidence: confidencePercent(result.score),
        risk: riskInfo.risk,
        riskLabel: riskInfo.riskLabel,
        note: riskInfo.note,
      };
    });

    const highest = highestRiskFromResults(top);
    const ctaConfig = CTA_BY_RISK[highest] || CTA_BY_RISK.unknown;

    setResults(processed);
    setResultPhotos(previewUris);
    setCta({ ...ctaConfig });
    setPhotoQueue([]);
    setView('results');
  }, []);

  const identify = useCallback(async () => {
    if (identifyBusy.current) return;
    if (!photoQueue.length) {
      setError('Add at least one photo before identifying.');
      setView('error');
      return;
    }

    identifyBusy.current = true;
    setIdentifying(true);

    const previewUris = photoQueue.map((item) => item.uri);
    setLoadingHint(
      previewUris.length > 1
        ? `Analyzing ${previewUris.length} photos — this may take a few seconds`
        : 'This may take a few seconds on slower connections',
    );
    setView('loading');

    try {
      const compressed = await compressPhotos(previewUris);
      const { data, remainingRequests } = await identifyPlant(compressed);
      if (remainingRequests !== null) {
        setQuotaRemaining(remainingRequests);
      }
      processResults(data, previewUris);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Something went wrong. Please try again.';
      setError(mapNetworkError(message));
      setView('error');
    } finally {
      identifyBusy.current = false;
      setIdentifying(false);
    }
  }, [photoQueue, processResults]);

  const resetFresh = useCallback(() => {
    setPhotoQueue([]);
    setResults([]);
    setResultPhotos([]);
    setCta(null);
    setError(null);
    setLoadingHint(null);
    setView('upload');
  }, []);

  const retryFromError = useCallback(() => {
    setError(null);
    setView('upload');
  }, []);

  return {
    view,
    photoQueue,
    results,
    resultPhotos,
    cta,
    error,
    loadingHint,
    quotaRemaining,
    identifying,
    maxPhotos: PLANT_IDENTIFIER_CONFIG.maxPhotos,
    takePhoto,
    pickPhotos,
    removePhoto,
    identify,
    resetFresh,
    retryFromError,
  };
}
