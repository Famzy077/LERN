import React, { useEffect } from 'react';
import {
  Alert,
  ScrollView,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {
  ArrowLeft,
  Bell,
  ChevronRight,
  CircleHelp,
  Info,
  Moon,
  ShieldAlert,
  Volume2,
} from 'lucide-react-native';
import {
  useUserSettings,
  useUpdateSettings,
  useDeleteAccount,
} from '../hooks/useSettings';
import { useProfile } from '@/features/profile/hooks/useProfile';
import { useSettingsStore } from '../store/settings.store';
import { ScreenWrapper } from '@/shared/components/layout/ScreenWrapper';
import { LoadingSkeleton } from '@/shared/components/ui/LoadingSkeleton';
import { ErrorState } from '@/shared/components/feedback/ErrorState';

type ThemeMode = 'light' | 'dark' | 'system';

export default function SettingsScreen() {
  const navigation = useNavigation<any>();
  const { data: settingsData, isLoading, isError, refetch } = useUserSettings();
  const { data: profileData } = useProfile();
  const updateMutation = useUpdateSettings();
  const deleteMutation = useDeleteAccount();
  const themeMode = useSettingsStore((state) => state.themeMode);
  const setThemeMode = useSettingsStore((state) => state.setThemeMode);
  const setHapticFeedback = useSettingsStore(
    (state) => state.setHapticFeedback,
  );

  useEffect(() => {
    const serverTheme = settingsData?.data.preferences.theme;
    if (serverTheme) setThemeMode(serverTheme);
  }, [settingsData?.data.preferences.theme, setThemeMode]);

  const updateSetting = (
    values: Parameters<typeof updateMutation.mutate>[0],
    onSuccess?: () => void,
  ) => {
    updateMutation.mutate(values, {
      onSuccess,
      onError: () =>
        Alert.alert(
          'Could not save setting',
          'Please check your connection and try again.',
        ),
    });
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete account permanently?',
      'Your account and associated study data will be deleted. This cannot be undone.',
      [
        { text: 'Keep account', style: 'cancel' },
        {
          text: 'Delete account',
          style: 'destructive',
          onPress: () =>
            deleteMutation.mutate(undefined, {
              onError: () =>
                Alert.alert(
                  'Could not delete account',
                  'Please try again or contact support.',
                ),
            }),
        },
      ],
    );
  };

  if (isLoading) {
    return (
      <ScreenWrapper>
        <LoadingSkeleton className="h-10 m-4" />
        <LoadingSkeleton className="h-48 m-4 rounded-3xl" />
        <LoadingSkeleton className="h-48 m-4 rounded-3xl" />
      </ScreenWrapper>
    );
  }

  if (isError || !settingsData?.data) {
    return (
      <ScreenWrapper>
        <ErrorState
          message="We couldn’t load your settings."
          onRetry={refetch}
        />
      </ScreenWrapper>
    );
  }

  const settings = settingsData.data;

  return (
    <ScreenWrapper padded={false}>
      <View className="flex-1 bg-surface dark:bg-slate-900">
        <View className="flex-row items-center px-5 pb-4 pt-3">
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel="Go back"
            onPress={() => navigation.goBack()}
            className="mr-3 h-10 w-10 items-center justify-center rounded-full bg-white dark:bg-slate-800"
          >
            <ArrowLeft size={21} color="#334155" />
          </TouchableOpacity>
          <View>
            <Text className="text-2xl font-bold text-slate-900 dark:text-slate-50">
              Settings
            </Text>
            <Text className="text-sm text-slate-500 dark:text-slate-400">
              Make SlotStudy yours
            </Text>
          </View>
        </View>

        <ScrollView
          className="flex-1 px-5"
          contentContainerStyle={{ paddingBottom: 32 }}
        >
          <SectionTitle title="Appearance" />
          <View className="mb-6 rounded-3xl bg-white p-4 dark:bg-slate-800">
            <View className="mb-4 flex-row items-center">
              <IconTile icon={Moon} />
              <View className="ml-3">
                <Text className="font-semibold text-slate-900 dark:text-slate-50">
                  App theme
                </Text>
                <Text className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                  Choose your preferred look
                </Text>
              </View>
            </View>
            <View className="flex-row rounded-2xl bg-slate-100 p-1 dark:bg-slate-900">
              {(['system', 'light', 'dark'] as ThemeMode[]).map((theme) => {
                const selected = themeMode === theme;
                return (
                  <TouchableOpacity
                    key={theme}
                    accessibilityRole="radio"
                    accessibilityState={{ checked: selected }}
                    onPress={() =>
                      updateSetting({ preferences: { theme } }, () =>
                        setThemeMode(theme),
                      )
                    }
                    disabled={updateMutation.isPending}
                    className={`flex-1 items-center rounded-xl py-2.5 ${
                      selected ? 'bg-primary' : ''
                    }`}
                  >
                    <Text
                      className={`text-sm font-semibold capitalize ${
                        selected
                          ? 'text-white'
                          : 'text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      {theme}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          <SectionTitle title="Notifications" />
          <View className="mb-6 rounded-3xl bg-white px-4 dark:bg-slate-800">
            <SettingSwitch
              icon={Bell}
              label="Push notifications"
              description="Study updates on this device"
              value={settings.notifications.pushEnabled}
              disabled={updateMutation.isPending}
              onChange={(pushEnabled) =>
                updateSetting({ notifications: { pushEnabled } })
              }
            />
            <SettingSwitch
              label="Email notifications"
              description="Important account and study updates"
              value={settings.notifications.emailEnabled}
              disabled={updateMutation.isPending}
              onChange={(emailEnabled) =>
                updateSetting({ notifications: { emailEnabled } })
              }
            />
            <SettingSwitch
              label="Study reminders"
              description={`Daily reminder · ${settings.notifications.reminderTime || 'time not set'}`}
              value={settings.notifications.studyReminders}
              disabled={updateMutation.isPending}
              onChange={(studyReminders) =>
                updateSetting({ notifications: { studyReminders } })
              }
              last
            />
          </View>

          <SectionTitle title="Study experience" />
          <View className="mb-6 rounded-3xl bg-white px-4 dark:bg-slate-800">
            <SettingSwitch
              icon={Volume2}
              label="Haptic feedback"
              description="Subtle feedback as you use the app"
              value={settings.preferences.hapticFeedback}
              disabled={updateMutation.isPending}
              onChange={(hapticFeedback) =>
                updateSetting({ preferences: { hapticFeedback } }, () =>
                  setHapticFeedback(hapticFeedback),
                )
              }
              last
            />
          </View>

          <SectionTitle title="Account & help" />
          <View className="mb-6 overflow-hidden rounded-3xl bg-white dark:bg-slate-800">
            <View className="px-4 py-4">
              <Text className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Signed in as
              </Text>
              <Text className="mt-1 font-medium text-slate-900 dark:text-slate-50">
                {settings.account.email}
              </Text>
            </View>
            <TouchableOpacity
              accessibilityRole="button"
              onPress={() => navigation.navigate('AcademicDetails')}
              className="flex-row items-center border-t border-slate-100 px-4 py-4 dark:border-slate-700"
            >
              <View className="flex-1">
                <Text className="font-medium text-slate-900 dark:text-slate-50">
                  University & program
                </Text>
                <Text className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  {profileData?.data.university || 'Add your education details'}
                </Text>
              </View>
              <ChevronRight size={18} color="#94A3B8" />
            </TouchableOpacity>
            <TouchableOpacity
              accessibilityRole="button"
              onPress={() => navigation.navigate('HelpSupport')}
              className="flex-row items-center border-t border-slate-100 px-4 py-4 dark:border-slate-700"
            >
              <CircleHelp size={19} color="#475569" />
              <Text className="ml-3 flex-1 font-medium text-slate-800 dark:text-slate-100">
                Help & support
              </Text>
              <ChevronRight size={18} color="#94A3B8" />
            </TouchableOpacity>
            <TouchableOpacity
              accessibilityRole="button"
              onPress={handleDeleteAccount}
              disabled={deleteMutation.isPending}
              className="flex-row items-center border-t border-slate-100 px-4 py-4 dark:border-slate-700"
            >
              <ShieldAlert size={19} color="#DC2626" />
              <Text className="ml-3 flex-1 font-semibold text-red-600">
                {deleteMutation.isPending
                  ? 'Deleting account...'
                  : 'Delete account'}
              </Text>
              {deleteMutation.isPending ? null : (
                <ChevronRight size={18} color="#94A3B8" />
              )}
            </TouchableOpacity>
          </View>

          <View className="mb-4 flex-row items-center justify-center">
            <Info size={14} color="#94A3B8" />
            <Text className="ml-2 text-xs text-slate-400">
              SlotStudy · Version 1.0.0
            </Text>
          </View>
        </ScrollView>
      </View>
    </ScreenWrapper>
  );
}

function SectionTitle({ title }: { title: string }) {
  return (
    <Text className="mb-2 ml-1 text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
      {title}
    </Text>
  );
}

function IconTile({ icon: Icon }: { icon: typeof Moon }) {
  return (
    <View className="h-10 w-10 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-700">
      <Icon size={19} color="#475569" />
    </View>
  );
}

function SettingSwitch({
  icon,
  label,
  description,
  value,
  disabled,
  onChange,
  last = false,
}: {
  icon?: typeof Bell;
  label: string;
  description: string;
  value: boolean;
  disabled: boolean;
  onChange: (value: boolean) => void;
  last?: boolean;
}) {
  return (
    <View
      className={`flex-row items-center py-4 ${
        last ? '' : 'border-b border-slate-100 dark:border-slate-700'
      }`}
    >
      {icon ? <IconTile icon={icon} /> : null}
      <View className={icon ? 'ml-3 flex-1' : 'flex-1'}>
        <Text className="font-medium text-slate-900 dark:text-slate-50">
          {label}
        </Text>
        <Text className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
          {description}
        </Text>
      </View>
      <Switch
        value={value}
        onValueChange={onChange}
        disabled={disabled}
        trackColor={{ false: '#CBD5E1', true: '#93C5FD' }}
        thumbColor={value ? '#2563EB' : '#F8FAFC'}
      />
    </View>
  );
}
