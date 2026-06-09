import { useCallback, useEffect, useState } from 'react';
import { loadJson, saveJson, storageKeys } from '@/lib/persistence/storage';
import { formatWildfireError } from '@/lib/wildfire-risk/errors';
import { resolveDeviceLocation } from '@/lib/wildfire-risk/location';
import { formatWeatherForInputs, runWildfireRiskCalculation } from '@/lib/wildfire-risk/run-calculation';
import type { WildfireRiskInputState, WildfireRiskResult } from '@/lib/wildfire-risk/types';

const DEFAULT_STATE: WildfireRiskInputState = {
  address: '',
  deviceLocation: null,
  useCustomWeather: false,
  windOverride: '',
  humidityOverride: '',
  tempOverride: '',
};

export type WildfireStatus = {
  message: string;
  type: 'loading' | 'error' | '';
};

export function useWildfireRiskCalculator() {
  const [state, setState] = useState<WildfireRiskInputState>(DEFAULT_STATE);
  const [result, setResult] = useState<WildfireRiskResult | null>(null);
  const [status, setStatus] = useState<WildfireStatus>({ message: '', type: '' });
  const [calculating, setCalculating] = useState(false);
  const [locating, setLocating] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    let mounted = true;

    loadJson<WildfireRiskInputState>(storageKeys.wildfireRisk).then((saved) => {
      if (!mounted) return;
      if (saved) {
        setState((current) => ({
          ...current,
          ...saved,
          deviceLocation: saved.deviceLocation ?? null,
        }));
      }
      setIsHydrated(true);
    });

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!isHydrated) return;

    const timer = setTimeout(() => {
      saveJson(storageKeys.wildfireRisk, {
        address: state.address,
        deviceLocation: state.deviceLocation,
        useCustomWeather: state.useCustomWeather,
        windOverride: state.windOverride,
        humidityOverride: state.humidityOverride,
        tempOverride: state.tempOverride,
      });
    }, 400);

    return () => clearTimeout(timer);
  }, [state, isHydrated]);

  const updateField = useCallback(
    <K extends keyof WildfireRiskInputState>(field: K, value: WildfireRiskInputState[K]) => {
      setState((current) => {
        if (field === 'address') {
          return {
            ...current,
            address: value as string,
            deviceLocation: null,
          };
        }
        return { ...current, [field]: value };
      });
    },
    [],
  );

  const useCurrentLocation = useCallback(async () => {
    if (locating || calculating) return;

    setLocating(true);
    setStatus({ message: 'Getting your location…', type: 'loading' });

    try {
      const geo = await resolveDeviceLocation();
      setState((current) => ({
        ...current,
        address: geo.label,
        deviceLocation: { lat: geo.lat, lon: geo.lon },
      }));
      setStatus({ message: '', type: '' });
    } catch (err) {
      setStatus({ message: formatWildfireError(err), type: 'error' });
    } finally {
      setLocating(false);
    }
  }, [calculating, locating]);

  const calculate = useCallback(async () => {
    if (calculating) return;

    const hasAddress = Boolean(state.address.trim());
    const hasDeviceLocation = Boolean(state.deviceLocation);

    if (!hasAddress && !hasDeviceLocation) {
      setStatus({ message: 'Enter a property address or use your current location.', type: 'error' });
      return;
    }

    setCalculating(true);
    setResult(null);
    setStatus({
      message: hasDeviceLocation ? 'Loading fuels, weather, and 16-day outlook…' : 'Finding address…',
      type: 'loading',
    });

    try {
      if (!hasDeviceLocation) {
        setStatus({ message: 'Loading fuels, weather, and 16-day outlook…', type: 'loading' });
      }

      const payload = await runWildfireRiskCalculation(state);

      if (!state.useCustomWeather) {
        const formatted = formatWeatherForInputs({
          windMph: payload.weather.windMph,
          rh: payload.weather.rh,
          tempF: payload.weather.tempF,
        });
        setState((current) => ({ ...current, ...formatted }));
      }

      setResult(payload);
      setStatus({ message: '', type: '' });
    } catch (err) {
      setStatus({ message: formatWildfireError(err), type: 'error' });
    } finally {
      setCalculating(false);
    }
  }, [calculating, state]);

  return {
    state,
    result,
    status,
    calculating,
    locating,
    updateField,
    useCurrentLocation,
    calculate,
  };
}
