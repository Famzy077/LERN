import React from "react";
import { View, Text, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { ScreenWrapper } from "@/shared/components/layout/ScreenWrapper";
import { Button } from "@/shared/components/ui/Button";
import { ProgressCard } from "@/shared/components/cards/ProgressCard";
import { LoadingSkeleton } from "@/shared/components/ui/LoadingSkeleton";
import { ErrorState } from "@/shared/components/feedback/ErrorState";
import { StreakWidget } from "@/shared/components/cards/StreakWidget";
import { useProgress } from "../hooks/useProgress";

export default function ProgressScreen() {
  const navigation = useNavigation<any>();
  const { data: response, isLoading, isError, error, refetch } = useProgress();

  if (isLoading) {
    return (
      <ScreenWrapper>
        <ScrollView className="flex-1 p-4 bg-surface dark:bg-slate-900">
          <LoadingSkeleton className="h-10 w-48 mb-8 mt-4 rounded-lg" />
          <LoadingSkeleton className="h-56 w-full mb-6 rounded-3xl" />
          <View className="flex-row justify-between mb-6 space-x-4">
            <LoadingSkeleton className="h-24 flex-1 rounded-3xl" />
            <LoadingSkeleton className="h-24 flex-1 rounded-3xl" />
            <LoadingSkeleton className="h-24 flex-1 rounded-3xl" />
          </View>
          <LoadingSkeleton className="h-40 w-full mb-6 rounded-3xl" />
          <View className="flex-row justify-between mb-6 space-x-4">
            <LoadingSkeleton className="h-48 flex-1 rounded-3xl" />
            <LoadingSkeleton className="h-48 flex-1 rounded-3xl" />
          </View>
        </ScrollView>
      </ScreenWrapper>
    );
  }

  if (isError || !response?.data) {
    return (
      <ScreenWrapper>
        <ErrorState
          title="Failed to load progress"
          message={error?.message || "Could not fetch your progress"}
          onRetry={refetch}
        />
      </ScreenWrapper>
    );
  }

  const progress = response.data;
  const maxHours = Math.max(
    ...progress.weeklyStudyHours.map((d) => d.hours),
    1,
  );
  const hasWeeklyQuizPractice = progress.weeklyStudyHours.some(
    (day) => day.hours > 0,
  );

  return (
    <ScreenWrapper className="scrollbar-hide" padded={false}>
      <ScrollView className="flex-1 bg-surface dark:bg-slate-900">
        <View className="p-4 pt-8">
          <Text className="text-3xl font-extrabold text-slate-900 dark:text-slate-50 mb-8">
            Progress
          </Text>
          <Button
            title="Practise a quiz"
            onPress={() => navigation.navigate("QuizHub")}
            className="mb-6"
            accessibilityLabel="Choose a study summary and practise with a quiz"
          />

          {/* Weekly Study Hours Chart */}
          <View className="bg-white dark:bg-slate-800 p-6 rounded-3xl mb-6 shadow-sm">
            <Text className="text-lg font-bold text-slate-900 dark:text-slate-50 mb-2">
              Weekly quiz practice
            </Text>
            <Text className="mb-5 text-xs text-slate-500 dark:text-slate-400">
              Time spent in timed quizzes only—not total study time.
            </Text>
            {hasWeeklyQuizPractice ? (
              <View className="flex-row justify-between items-end h-40">
                {progress.weeklyStudyHours.map((day, idx) => {
                  const heightPct = (day.hours / maxHours) * 100;
                  return (
                    <View key={idx} className="items-center flex-1">
                      <View className="w-full flex-row justify-center h-32 items-end pb-2">
                        <View
                          className="w-8 bg-primary rounded-t-lg"
                          style={{ height: `${heightPct}%`, minHeight: 4 }}
                        />
                      </View>
                      <Text className="text-slate-500 text-xs mt-2">
                        {day.day}
                      </Text>
                    </View>
                  );
                })}
              </View>
            ) : (
              <View className="items-center rounded-2xl bg-slate-50 px-4 py-8 dark:bg-slate-700/50">
                <Text className="text-center text-sm text-slate-600 dark:text-slate-300">
                  Timed quiz practice will appear here after your first quiz.
                </Text>
              </View>
            )}
          </View>

          {/* Stats Cards Row */}
          <View className="flex-row gap-2 justify-between mb-6 space-x-4">
            <View className="bg-white dark:bg-slate-800 p-2 rounded-3xl flex-1 items-center shadow-sm">
              <Text className="text-2xl font-bold text-primary mb-1">
                {progress.totalStudyTime.toFixed(1)}h
              </Text>
              <Text className="text-slate-500 text-xs text-center">
                Quiz practice time
              </Text>
            </View>
            <View className="bg-white dark:bg-slate-800 p-2 rounded-3xl flex-1 items-center shadow-sm">
              <Text className="text-2xl font-bold text-primary mb-1">
                {progress.coursesCompleted}
              </Text>
              <Text className="text-slate-500 text-xs text-center">
                Fully Processed Courses
              </Text>
            </View>
            <View className="bg-white dark:bg-slate-800 p-2 rounded-3xl flex-1 items-center shadow-sm">
              <Text className="text-2xl font-bold text-primary mb-1">
                {progress.totalQuizzesTaken}
              </Text>
              <Text className="text-slate-500 text-xs text-center">
                Quizzes Taken
              </Text>
            </View>
          </View>

          {/* Subject Performance */}
          <View className="bg-white dark:bg-slate-800 p-6 rounded-3xl mb-6 shadow-sm">
            <Text className="text-lg font-bold text-slate-900 dark:text-slate-50 mb-2">
              Subject Performance
            </Text>
            <Text className="mb-4 text-xs text-slate-500 dark:text-slate-400">
              Average quiz score for each subject. Revisit lower-scoring
              subjects in your course materials.
            </Text>
            {progress.subjectPerformance.length ? (
              progress.subjectPerformance.map((subj, idx) => (
                <View key={idx} className="mb-4">
                  <View className="flex-row justify-between mb-2">
                    <Text className="text-slate-700 dark:text-slate-300 font-semibold">
                      {subj.subject}
                    </Text>
                    <Text className="text-slate-500">
                      {Math.round(subj.score)}%
                    </Text>
                  </View>
                  <View className="w-full h-3 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                    <View
                      className="h-full rounded-full"
                      style={{
                        width: `${Math.max(0, Math.min(100, subj.score))}%`,
                        backgroundColor: subj.color || "#3b82f6",
                      }}
                    />
                  </View>
                </View>
              ))
            ) : (
              <Text className="text-sm text-slate-500 dark:text-slate-400">
                Take a quiz linked to a course to see subject-level results
                here.
              </Text>
            )}
          </View>

          {/* Quiz Accuracy and Streak */}
          <View className="flex-row gap-4 space-x-4 mb-6">
            <View className="bg-white dark:bg-slate-800 p-6 rounded-3xl flex-1 items-center shadow-sm">
              <Text className="text-lg font-bold text-slate-900 dark:text-slate-50 mb-4">
                Quiz Accuracy
              </Text>
              <ProgressCard
                value={progress.quizAccuracy}
                title="Quiz Accuracy"
                size="lg"
              />
              <Text className="text-3xl font-bold text-slate-900 dark:text-slate-50 mt-4">
                {progress.quizAccuracy}%
              </Text>
              <Text className="mt-2 text-center text-xs text-slate-500 dark:text-slate-400">
                Average score across completed quizzes
              </Text>
            </View>

            <View className="flex-1 justify-center">
              <StreakWidget
                currentStreak={progress.studyStreak.current}
                weeklyData={progress.studyStreak.thisMonth
                  .slice(-7)
                  .map((v) => v > 0)}
                showWeekly={false}
              />
            </View>
          </View>

          {/* XP Progression */}
          <View className="bg-white dark:bg-slate-800 p-6 rounded-3xl mb-8 shadow-sm">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-lg font-bold text-slate-900 dark:text-slate-50">
                Level {progress.xpProgression.level}
              </Text>
              <Text className="text-slate-500">
                {progress.xpProgression.current} /{" "}
                {progress.xpProgression.nextLevelXp} XP
              </Text>
            </View>
            <View className="w-full h-4 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
              <View
                className="h-full bg-yellow-400 rounded-full"
                style={{
                  width: `${(progress.xpProgression.current / progress.xpProgression.nextLevelXp) * 100}%`,
                }}
              />
            </View>
          </View>
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
}
