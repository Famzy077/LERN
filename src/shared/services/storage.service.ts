import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ── Secure storage (tokens, sensitive data) ────────────────────────
export const secureStorage = {
  get: async (key: string): Promise<string | null> => {
    try {
      return await SecureStore.getItemAsync(key);
    } catch {
      return null;
    }
  },

  set: async (key: string, value: string): Promise<void> => {
    await SecureStore.setItemAsync(key, value);
  },

  remove: async (key: string): Promise<void> => {
    await SecureStore.deleteItemAsync(key);
  },
};

// ── Async storage (preferences, non-sensitive) ─────────────────────
export const asyncStorage = {
  get: async <T>(key: string): Promise<T | null> => {
    try {
      const value = await AsyncStorage.getItem(key);
      return value ? (JSON.parse(value) as T) : null;
    } catch {
      return null;
    }
  },

  set: async <T>(key: string, value: T): Promise<void> => {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  },

  remove: async (key: string): Promise<void> => {
    await AsyncStorage.removeItem(key);
  },

  clear: async (): Promise<void> => {
    await AsyncStorage.clear();
  },
};

// ── Storage keys ───────────────────────────────────────────────────
export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'slotstudy_access_token',
  REFRESH_TOKEN: 'slotstudy_refresh_token',
  USER: 'slotstudy_user',
  THEME: 'slotstudy_theme',
  ONBOARDING_COMPLETED: 'slotstudy_onboarding_completed',
  ACADEMIC_SETUP_COMPLETED: 'slotstudy_academic_setup_completed',
} as const;
