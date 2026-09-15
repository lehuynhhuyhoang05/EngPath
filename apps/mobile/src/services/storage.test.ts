import AsyncStorage from '@react-native-async-storage/async-storage';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { StoredAppState } from '../domain/models';
import { clearAppState, loadAppState, parseStoredAppState, saveAppState, serializeAppState } from './storage';

vi.mock('@react-native-async-storage/async-storage', () => ({
  default: {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
  },
}));

const mockStorage = vi.mocked(AsyncStorage);

const state: StoredAppState = {
  profile: { grade: 9, goalId: 'school-support' },
  diagnosticDraft: { grade: 9, answers: { q1: 1 }, currentIndex: 1 },
  completedLessonIds: ['lesson-present-simple-01'],
  completedSessions: 2,
};

describe('local app storage', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('serializes state with a schema version envelope', () => {
    expect(JSON.parse(serializeAppState(state))).toEqual({
      schemaVersion: 2,
      state,
    });
  });

  it('loads the current schema envelope', async () => {
    mockStorage.getItem.mockResolvedValue(serializeAppState(state));

    await expect(loadAppState()).resolves.toEqual(state);
  });

  it('migrates the raw v1 state shape', () => {
    expect(parseStoredAppState(JSON.stringify({
      completedLessonIds: [],
      completedSessions: 0,
    }))).toEqual({
      completedLessonIds: [],
      completedSessions: 0,
    });
  });

  it('falls back safely when stored data is corrupt', async () => {
    mockStorage.getItem.mockResolvedValue('{not-json');

    await expect(loadAppState()).resolves.toBeNull();
  });

  it('does not throw when local persistence fails', async () => {
    mockStorage.setItem.mockRejectedValue(new Error('quota exceeded'));
    mockStorage.removeItem.mockRejectedValue(new Error('locked'));

    await expect(saveAppState(state)).resolves.toBeUndefined();
    await expect(clearAppState()).resolves.toBeUndefined();
  });
});
