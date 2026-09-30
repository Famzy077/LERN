import React from 'react';
import { ScrollView, RefreshControl, View } from 'react-native';
import { ScreenWrapper } from '@/shared/components/layout/ScreenWrapper';
import GreetingHeader from '../components/GreetingHeader';
import QuickActions from '../components/QuickActions';
import ContinueStudying from '../components/ContinueStudying';
import { StreakWidget } from '@/shared/components/cards/StreakWidget';
import { XPBadge } from '@/shared/components/cards/XPBadge';
import { ProgressCard } from '@/shared/components/cards/ProgressCard';
import { SkeletonCard as LoadingSkeleton } from '@/shared/components/ui/LoadingSkeleton';
import { ErrorState } from '@/shared/components/feedback/ErrorState';
import { useDashboard } from '../hooks/useDashboard';

const HomeScreen = () => {
  const { data, isLoading, isError, refetch, isRefetching } = useDashboard();

  if (isLoading) {
    return (
      <ScreenWrapper padded={false} className="flex-1 bg-surface dark:bg-slate-900">
        <View className="px-6 mt-8 mb-6 flex-row items-center justify-between">
          <View>
            <LoadingSkeleton className="h-6 w-32 mb-2 rounded-lg" />
            <LoadingSkeleton className="h-8 w-48 rounded-lg" />
          </View>
          <LoadingSkeleton className="h-12 w-12 rounded-full" />
        </View>
        
        <View className="flex-row px-6 mb-6 gap-4">
          <LoadingSkeleton className="flex-1 h-32 rounded-3xl" />
          <LoadingSkeleton className="flex-1 h-32 rounded-3xl" />
        </View>

        <View className="px-6 mb-8">
          <LoadingSkeleton className="w-full h-48 rounded-3xl" />
        </View>

        <View className="px-6 mb-8 flex-row flex-wrap justify-between gap-y-4">
          <LoadingSkeleton className="w-[48%] aspect-square rounded-3xl" />
          <LoadingSkeleton className="w-[48%] aspect-square rounded-3xl" />
          <LoadingSkeleton className="w-[48%] aspect-square rounded-3xl" />
          <LoadingSkeleton className="w-[48%] aspect-square rounded-3xl" />
        </View>
      </ScreenWrapper>
    );
  }

  if (isError || !data?.data) {
    return (
      <ScreenWrapper padded={false} className="flex-1 bg-surface dark:bg-slate-900 justify-center">
        <ErrorState message="Failed to load dashboard" onRetry={refetch} />
      </ScreenWrapper>
    );
  }

  const dashboard = data.data;

  return (
    <ScreenWrapper padded={false} className="flex-1 bg-surface dark:bg-slate-900">
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
        }
      >
        <GreetingHeader
          greeting={dashboard.greeting}
          name={dashboard.user.name}
          avatarUrl={dashboard.user.avatarUrl}
        />
        
        <View className="px-6 mb-6 flex-row gap-4">
          <View className="flex-1 justify-center">
            <StreakWidget currentStreak={dashboard.streak.current} weeklyData={dashboard.streak.weeklyData} showWeekly={false} />
          </View>
          <View className="flex-1 justify-center">
            <XPBadge xp={dashboard.xp.total} level={dashboard.xp.level} />
          </View>
        </View>

        <View className="px-6 mb-8">
          <ProgressCard
            title="Exam Readiness"
            value={dashboard.examReadiness.overall}
            subtitle={`${dashboard.examReadiness.overall}% ready for upcoming exams`}
          />
        </View>

        <QuickActions actions={dashboard.quickActions} />

        <ContinueStudying courses={dashboard.recentCourses} />
      </ScrollView>
    </ScreenWrapper>
  );
};

export default HomeScreen;
