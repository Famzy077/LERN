import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Switch, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ArrowLeft } from 'lucide-react-native';
import { useUserSettings, useUpdateSettings, useDeleteAccount } from '../hooks/useSettings';
import { ScreenWrapper } from '@/shared/components/layout/ScreenWrapper';
import { LoadingSkeleton } from '@/shared/components/ui/LoadingSkeleton';

export default function SettingsScreen() {
  const navigation = useNavigation<any>();
  const { data: settingsData, isLoading } = useUserSettings();
  const { mutate: updateSettings } = useUpdateSettings();
  const { mutate: deleteAccount } = useDeleteAccount();

  // In a real implementation, we would also sync with `useSettingsStore` for local theme state,
  // but keeping it simple based on the requirements.
  const handleThemeChange = (theme: 'light' | 'dark' | 'system') => {
    updateSettings({ preferences: { theme } });
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      "Delete Account",
      "Are you sure you want to permanently delete your account? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", style: "destructive", onPress: () => deleteAccount() }
      ]
    );
  };

  if (isLoading || !settingsData) {
    return <ScreenWrapper><LoadingSkeleton className="flex-1 m-4" /></ScreenWrapper>;
  }

  const settings = settingsData.data;

  return (
    <View className="flex-1 bg-surface">
      <View className="flex-row items-center p-4 pt-12 bg-white dark:bg-slate-900 shadow-sm">
        <TouchableOpacity onPress={() => navigation.goBack()} className="mr-4">
          <ArrowLeft size={24} className="text-slate-900 dark:text-slate-50" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-slate-900 dark:text-slate-50">Settings</Text>
      </View>

      <ScrollView className="flex-1 p-4">
        {/* Appearance */}
        <Text className="text-sm font-bold text-slate-500 mb-2 uppercase ml-2">Appearance</Text>
        <View className="bg-white dark:bg-slate-800 rounded-2xl mb-6 p-4">
          <Text className="text-base font-medium text-slate-900 dark:text-slate-50 mb-3">Theme</Text>
          <View className="flex-row bg-slate-100 dark:bg-slate-900 rounded-xl p-1">
            {['system', 'light', 'dark'].map((t) => (
              <TouchableOpacity
                key={t}
                onPress={() => handleThemeChange(t as any)}
                className={`flex-1 py-2 rounded-lg items-center ${settings.preferences.theme === t ? 'bg-primary' : 'bg-transparent'}`}
              >
                <Text className={`capitalize font-medium ${settings.preferences.theme === t ? 'text-white' : 'text-slate-600 dark:text-slate-400'}`}>
                  {t}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Notifications */}
        <Text className="text-sm font-bold text-slate-500 mb-2 uppercase ml-2">Notifications</Text>
        <View className="bg-white dark:bg-slate-800 rounded-2xl mb-6 p-4">
          <View className="flex-row justify-between items-center py-2 border-b border-slate-100 dark:border-slate-700">
            <Text className="text-base font-medium text-slate-900 dark:text-slate-50">Push Notifications</Text>
            <Switch 
              value={settings.notifications.pushEnabled} 
              onValueChange={(val) => updateSettings({ notifications: { pushEnabled: val } })}
            />
          </View>
          <View className="flex-row justify-between items-center py-2 border-b border-slate-100 dark:border-slate-700">
            <Text className="text-base font-medium text-slate-900 dark:text-slate-50">Email Notifications</Text>
            <Switch 
              value={settings.notifications.emailEnabled} 
              onValueChange={(val) => updateSettings({ notifications: { emailEnabled: val } })}
            />
          </View>
          <View className="flex-row justify-between items-center py-2">
            <Text className="text-base font-medium text-slate-900 dark:text-slate-50">Study Reminders</Text>
            <Switch 
              value={settings.notifications.studyReminders} 
              onValueChange={(val) => updateSettings({ notifications: { studyReminders: val } })}
            />
          </View>
        </View>

        {/* General */}
        <Text className="text-sm font-bold text-slate-500 mb-2 uppercase ml-2">General</Text>
        <View className="bg-white dark:bg-slate-800 rounded-2xl mb-6 p-4">
          <View className="flex-row justify-between items-center py-2">
            <Text className="text-base font-medium text-slate-900 dark:text-slate-50">Haptic Feedback</Text>
            <Switch 
              value={settings.preferences.hapticFeedback} 
              onValueChange={(val) => updateSettings({ preferences: { hapticFeedback: val } })}
            />
          </View>
        </View>

        {/* Account */}
        <Text className="text-sm font-bold text-slate-500 mb-2 uppercase ml-2">Account</Text>
        <View className="bg-white dark:bg-slate-800 rounded-2xl mb-6 p-4">
          <View className="flex-row justify-between items-center py-2 border-b border-slate-100 dark:border-slate-700">
            <Text className="text-base font-medium text-slate-900 dark:text-slate-50">Email</Text>
            <Text className="text-base text-slate-500">{settings.account.email}</Text>
          </View>
          <TouchableOpacity onPress={handleDeleteAccount} className="py-2 mt-2">
            <Text className="text-base font-medium text-red-500">Delete Account</Text>
          </TouchableOpacity>
        </View>

        {/* About */}
        <Text className="text-sm font-bold text-slate-500 mb-2 uppercase ml-2">About</Text>
        <View className="bg-white dark:bg-slate-800 rounded-2xl mb-8 p-4">
          <View className="flex-row justify-between items-center py-2 border-b border-slate-100 dark:border-slate-700">
            <Text className="text-base font-medium text-slate-900 dark:text-slate-50">Version</Text>
            <Text className="text-base text-slate-500">1.0.0</Text>
          </View>
          <TouchableOpacity className="py-2 border-b border-slate-100 dark:border-slate-700">
            <Text className="text-base font-medium text-slate-900 dark:text-slate-50">Terms of Service</Text>
          </TouchableOpacity>
          <TouchableOpacity className="py-2 mt-1">
            <Text className="text-base font-medium text-slate-900 dark:text-slate-50">Privacy Policy</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
