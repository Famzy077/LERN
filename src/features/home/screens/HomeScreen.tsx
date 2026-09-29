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
      <ScreenWrapper padded={false} className="flex-1 bg-surface dark:bg-slate-900 px-6">
        <LoadingSkeleton className="h-20 mb-6 mt-4" />
        <LoadingSkeleton className="h-32 mb-6" />
        <View className="flex-row justify-between mb-6">
          <LoadingSkeleton className="w-[48%] aspect-square" />
          <LoadingSkeleton className="w-[48%] aspect-square" />
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
          <View className="flex-1">
            <StreakWidget currentStreak={dashboard.streak.current} weeklyData={dashboard.streak.weeklyData} />
          </View>
          <View className="flex-1">
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
