import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { ThemeMode } from '@/shared/types/common.types';

interface SettingsState {
  themeMode: ThemeMode;
  notificationsEnabled: boolean;
  studyReminderTime: string | null;
  hapticFeedback: boolean;
  setThemeMode: (mode: ThemeMode) => void;
  setNotificationsEnabled: (enabled: boolean) => void;
  setStudyReminderTime: (time: string | null) => void;
  setHapticFeedback: (enabled: boolean) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      themeMode: 'system',
      notificationsEnabled: true,
      studyReminderTime: null,
      hapticFeedback: true,
      setThemeMode: (mode) => set({ themeMode: mode }),
      setNotificationsEnabled: (enabled) => set({ notificationsEnabled: enabled }),
      setStudyReminderTime: (time) => set({ studyReminderTime: time }),
      setHapticFeedback: (enabled) => set({ hapticFeedback: enabled }),
    }),
    {
      name: 'cramly-settings',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
