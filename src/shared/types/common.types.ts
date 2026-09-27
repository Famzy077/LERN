export type ThemeMode = 'light' | 'dark' | 'system';

export interface SelectOption {
  label: string;
  value: string;
}

export interface TabItem {
  key: string;
  label: string;
  icon: string;
}

export type LoadingState = 'idle' | 'loading' | 'success' | 'error';
