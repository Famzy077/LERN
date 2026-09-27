import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Bell, Crown, Settings, HelpCircle, LogOut, ChevronRight } from 'lucide-react-native';
import { useProfile } from '../hooks/useProfile';
import { ScreenWrapper } from '@/shared/components/layout/ScreenWrapper';
import { LoadingSkeleton } from '@/shared/components/ui/LoadingSkeleton';
import { ErrorState } from '@/shared/components/feedback/ErrorState';

export default function ProfileScreen() {
  const navigation = useNavigation<any>();
  const { data: profileResponse, isLoading, isError, refetch } = useProfile();

  if (isLoading) {
    return (
      <ScreenWrapper>
        <LoadingSkeleton className="flex-1 m-4" />
      </ScreenWrapper>
    );
  }

  if (isError || !profileResponse) {
    return (
      <ScreenWrapper>
        <ErrorState message="An error occurred" onRetry={refetch} />
      </ScreenWrapper>
    );
  }

  const profile = profileResponse.data;
  const initials = profile.name ? profile.name.substring(0, 2).toUpperCase() : 'U';

  const handleLogout = () => {
    // call logout from auth store and reset navigation
  };

  const renderMenuItem = (icon: React.ReactNode, label: string, onPress: () => void, isDestructive = false) => (
    <TouchableOpacity 
      onPress={onPress}
      className="flex-row items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800"
    >
      <View className="flex-row items-center space-x-4">
        {icon}
        <Text className={`text-base font-medium ${isDestructive ? 'text-red-500' : 'text-slate-900 dark:text-slate-50'}`}>
          {label}
        </Text>
      </View>
      <ChevronRight size={20} className="text-slate-400" />
    </TouchableOpacity>
  );

  return (
    <ScreenWrapper scroll>
      <View className="items-center mt-8 mb-6">
        <View className="relative">
          {profile.avatarUrl ? (
            <Image source={{ uri: profile.avatarUrl }} className="w-24 h-24 rounded-full" />
          ) : (
            <View className="w-24 h-24 rounded-full bg-primary items-center justify-center">
              <Text className="text-white text-3xl font-bold">{initials}</Text>
            </View>
          )}
          <View className="absolute bottom-0 right-0 bg-white dark:bg-slate-800 rounded-full px-2 py-1 shadow-sm">
            <Text className={`text-xs font-bold ${profile.subscription.plan === 'pro' ? 'text-yellow-500' : 'text-slate-500'}`}>
              {profile.subscription.plan.toUpperCase()}
            </Text>
          </View>
        </View>
        <Text className="text-xl font-bold mt-4 text-slate-900 dark:text-slate-50">{profile.name}</Text>
        <Text className="text-slate-500">{profile.university}</Text>
      </View>

      <View className="flex-row justify-between px-6 mb-8">
        <View className="bg-surface items-center flex-1 py-4 mx-1 rounded-2xl">
          <Text className="text-2xl font-bold text-slate-900 dark:text-slate-50">{profile.stats.totalCourses}</Text>
          <Text className="text-xs text-slate-500 mt-1">Courses</Text>
        </View>
        <View className="bg-surface items-center flex-1 py-4 mx-1 rounded-2xl">
          <Text className="text-2xl font-bold text-slate-900 dark:text-slate-50">{profile.stats.totalQuizzes}</Text>
          <Text className="text-xs text-slate-500 mt-1">Quizzes</Text>
        </View>
        <View className="bg-surface items-center flex-1 py-4 mx-1 rounded-2xl">
          <Text className="text-2xl font-bold text-slate-900 dark:text-slate-50">{profile.stats.currentStreak}</Text>
          <Text className="text-xs text-slate-500 mt-1">Streak</Text>
        </View>
      </View>

      <View className="bg-surface mx-4 rounded-3xl overflow-hidden mb-8">
        {renderMenuItem(<Bell size={24} className="text-slate-700 dark:text-slate-300" />, 'Notifications', () => navigation.navigate('Notifications'))}
        {renderMenuItem(<Crown size={24} className="text-yellow-500" />, 'Subscription', () => navigation.navigate('Subscription'))}
        {renderMenuItem(<Settings size={24} className="text-slate-700 dark:text-slate-300" />, 'Settings', () => navigation.navigate('Settings'))}
        {renderMenuItem(<HelpCircle size={24} className="text-slate-700 dark:text-slate-300" />, 'Help & Support', () => {})}
        {renderMenuItem(<LogOut size={24} className="text-red-500" />, 'Logout', handleLogout, true)}
      </View>
    </ScreenWrapper>
  );
}
