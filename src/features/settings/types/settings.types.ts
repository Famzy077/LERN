export interface UserSettings {
  notifications: {
    pushEnabled: boolean;
    emailEnabled: boolean;
    studyReminders: boolean;
    reminderTime: string;
  };
  preferences: {
    theme: 'light' | 'dark' | 'system';
    hapticFeedback: boolean;
    autoPlay: boolean;
    language: string;
  };
  account: {
    email: string;
    connectedAccounts: string[];
  };
}

export interface UpdateSettingsDTO {
  notifications?: Partial<UserSettings['notifications']>;
  preferences?: Partial<UserSettings['preferences']>;
}
