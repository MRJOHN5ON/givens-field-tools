import AsyncStorage from '@react-native-async-storage/async-storage';

export const storageKeys = {
  cordCalculator: '@givens/cord-calculator/v1',
  treeHeight: '@givens/tree-height/v1',
  wildfireRisk: '@givens/wildfire-risk/v1',
} as const;

export async function loadJson<T>(key: string): Promise<T | null> {
  try {
    const raw = await AsyncStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export async function saveJson(key: string, value: unknown): Promise<void> {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Persistence failures should not block the UI.
  }
}
