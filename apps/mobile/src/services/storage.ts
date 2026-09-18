import AsyncStorage from '@react-native-async-storage/async-storage';
import type { StoredAppState } from '../domain/models';

const STORAGE_KEY = '@engpath/app-state/v1';
const STORAGE_SCHEMA_VERSION = 3;

interface StoredEnvelope {
  schemaVersion: number;
  state: StoredAppState;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isStoredState(value: unknown): value is StoredAppState {
  return isRecord(value)
    && Array.isArray(value.completedLessonIds)
    && typeof value.completedSessions === 'number';
}

function normalizeStoredState(state: StoredAppState): StoredAppState {
  return {
    ...state,
    lessonDrafts: isRecord(state.lessonDrafts) ? state.lessonDrafts : {},
    masteryStates: isRecord(state.masteryStates) ? state.masteryStates : {},
    mistakeRecords: Array.isArray(state.mistakeRecords) ? state.mistakeRecords : [],
    contentReports: Array.isArray(state.contentReports) ? state.contentReports : [],
  };
}

export function parseStoredAppState(serialized: string): StoredAppState | null {
  try {
    const parsed: unknown = JSON.parse(serialized);

    if (isRecord(parsed) && 'schemaVersion' in parsed && 'state' in parsed) {
      const envelope = parsed as Partial<StoredEnvelope>;
      return isStoredState(envelope.state) ? normalizeStoredState(envelope.state) : null;
    }

    return isStoredState(parsed) ? normalizeStoredState(parsed) : null;
  } catch {
    return null;
  }
}

export function serializeAppState(state: StoredAppState): string {
  const envelope: StoredEnvelope = { schemaVersion: STORAGE_SCHEMA_VERSION, state };
  return JSON.stringify(envelope);
}

export async function loadAppState(): Promise<StoredAppState | null> {
  try {
    const value = await AsyncStorage.getItem(STORAGE_KEY);
    return value ? parseStoredAppState(value) : null;
  } catch {
    return null;
  }
}

export async function saveAppState(state: StoredAppState): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, serializeAppState(state));
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
