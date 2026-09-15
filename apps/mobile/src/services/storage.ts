import AsyncStorage from '@react-native-async-storage/async-storage';
import type { StoredAppState } from '../domain/models';

const STORAGE_KEY = '@engpath/app-state/v1';

export async function loadAppState(): Promise<StoredAppState | null> {
  try {
    const value = await AsyncStorage.getItem(STORAGE_KEY);
    return value ? (JSON.parse(value) as StoredAppState) : null;
  } catch {
    return null;
  }
}

export async function saveAppState(state: StoredAppState): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // A local storage failure must not block a prototype learning session.
  }
}

export async function clearAppState(): Promise<void> {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
  } catch {
    // Reset remains usable in memory if local storage is unavailable.
  }
}
