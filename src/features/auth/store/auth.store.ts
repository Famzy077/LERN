import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface User {
  id: string;
  email: string;
  name: string;
  username?: string | null;
  avatarUrl: string | null;
  university: string | null;
  program: string | null;
  yearOfStudy: number | null;
  onboardingCompleted: boolean;
  academicSetupCompleted: boolean;
}

interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isOnboarded: boolean;
  setAuth: (user: User, token: string, refreshToken: string) => void;
  setTokens: (token: string, refreshToken: string) => void;
  setUser: (user: User) => void;
  updateAcademicInfo: (
    details: Pick<
      User,
      'university' | 'program' | 'yearOfStudy' | 'academicSetupCompleted'
    >,
  ) => void;
  setOnboarded: (onboarded: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,
      isOnboarded: false,
      setAuth: (user, token, refreshToken) =>
        set({ user, token, refreshToken, isAuthenticated: true }),
      setTokens: (token, refreshToken) => set({ token, refreshToken }),
      setUser: (user) => set({ user }),
      updateAcademicInfo: (details) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...details } : null,
        })),
      setOnboarded: (isOnboarded) => set({ isOnboarded }),
      logout: () =>
        set({
          user: null,
          token: null,
          refreshToken: null,
          isAuthenticated: false,
        }),
    }),
    {
      name: 'slotstudy-auth',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
