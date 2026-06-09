import { useCallback, useEffect, useMemo, useState } from 'react';
import { calculateTreeHeight } from '@/lib/tree-height/calculations';
import type {
  LengthUnit,
  TreeHeightInputState,
  TreeHeightMethod,
  TreeHeightResult,
  TreeHeightTier,
} from '@/lib/tree-height/types';
import {
  ADVANCED_METHODS,
  getTreeHeightTier,
  STANDARD_METHODS,
} from '@/lib/tree-height/types';
import { sanitizeTreeHeightState } from '@/lib/persistence/tree-height';
import { loadJson, saveJson, storageKeys } from '@/lib/persistence/storage';

const DEFAULT_STATE: TreeHeightInputState = {
  method: 'angle',
  unit: 'ft',
  distance: '',
  angle: '',
  eyeHeight: '',
  lineOfSight: '',
  userHeight: '',
  userShadowLength: '',
  treeShadowLength: '',
  distance2: '',
  angle2: '',
};

function defaultMethodForTier(tier: TreeHeightTier): TreeHeightMethod {
  return tier === 'advanced' ? ADVANCED_METHODS[0] : STANDARD_METHODS[0];
}

export function useTreeHeightCalculator() {
  const [state, setState] = useState<TreeHeightInputState>(DEFAULT_STATE);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    let mounted = true;

    loadJson(storageKeys.treeHeight).then((saved) => {
      if (!mounted) return;

      const restored = sanitizeTreeHeightState(saved);
      if (restored) {
        setState(restored);
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
      saveJson(storageKeys.treeHeight, state);
    }, 400);

    return () => clearTimeout(timer);
  }, [state, isHydrated]);

  const tier = useMemo(() => getTreeHeightTier(state.method), [state.method]);

  const result = useMemo<TreeHeightResult | null>(
    () => calculateTreeHeight(state),
    [state],
  );

  const setMethod = useCallback((method: TreeHeightMethod) => {
    setState((current) => ({ ...current, method }));
  }, []);

  const setTier = useCallback((nextTier: TreeHeightTier) => {
    setState((current) => {
      const currentTier = getTreeHeightTier(current.method);
      if (currentTier === nextTier) {
        return current;
      }

      return {
        ...current,
        method: defaultMethodForTier(nextTier),
      };
    });
  }, []);

  const setUnit = useCallback((unit: LengthUnit) => {
    setState((current) => ({ ...current, unit }));
  }, []);

  const updateField = useCallback(
    <K extends keyof TreeHeightInputState>(field: K, value: TreeHeightInputState[K]) => {
      setState((current) => ({ ...current, [field]: value }));
    },
    [],
  );

  return {
    state,
    tier,
    result,
    setMethod,
    setTier,
    setUnit,
    updateField,
  };
}
