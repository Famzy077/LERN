import type { NavigatorScreenParams } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { CompositeScreenProps } from '@react-navigation/native';

// ── Tab Navigator ──────────────────────────────────────────────────
export type TabParamList = {
  Home: undefined;
  Courses: undefined;
  AI: undefined;
  Progress: undefined;
  Profile: undefined;
};

// ── Auth Stack ─────────────────────────────────────────────────────
export type AuthStackParamList = {
  Splash: undefined;
  Onboarding: undefined;
  Login: undefined;
  AcademicSetup: undefined;
};

// ── Main Stack (wraps tabs + modal screens) ────────────────────────
export type MainStackParamList = {
  Tabs: NavigatorScreenParams<TabParamList>;
  UploadMaterial: { courseId?: string };
  AISummary: { materialId: string };
  Quiz: { courseId: string; quizId?: string };
  QuizResult: { quizId: string };
  Notifications: undefined;
  Subscription: undefined;
  Settings: undefined;
};

// ── Root Stack ─────────────────────────────────────────────────────
export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  Main: NavigatorScreenParams<MainStackParamList>;
};

// ── Screen prop types ──────────────────────────────────────────────
export type AuthScreenProps<T extends keyof AuthStackParamList> =
  NativeStackScreenProps<AuthStackParamList, T>;

export type MainScreenProps<T extends keyof MainStackParamList> =
  NativeStackScreenProps<MainStackParamList, T>;

export type TabScreenProps<T extends keyof TabParamList> = CompositeScreenProps<
  BottomTabScreenProps<TabParamList, T>,
  NativeStackScreenProps<MainStackParamList>
>;

// ── Global declaration for useNavigation ───────────────────────────
declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
