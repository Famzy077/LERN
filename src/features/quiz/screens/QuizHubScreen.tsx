import React from "react";
import { Alert, Text, TouchableOpacity, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import {
  BookOpen,
  ChevronRight,
  FileText,
  Sparkles,
} from "lucide-react-native";
import { ScreenWrapper } from "@/shared/components/layout/ScreenWrapper";
import { Button } from "@/shared/components/ui/Button";
import { EmptyState } from "@/shared/components/feedback/EmptyState";
import { SkeletonCard } from "@/shared/components/ui/LoadingSkeleton";
import {
  useRecentSummaries,
  useGenerateQuiz,
} from "@/features/ai/hooks/useSummary";
import { useTheme } from "@/shared/hooks/useTheme";

export default function QuizHubScreen() {
  const navigation = useNavigation<any>();
  const { colors } = useTheme();
  const { data: summariesResponse, isLoading } = useRecentSummaries();
  const generateQuiz = useGenerateQuiz();
  const summaries = summariesResponse?.data ?? [];

  const handleGenerateQuiz = (summaryId: string) => {
    generateQuiz.mutate(
      { summaryId, numberOfQuestions: 5 },
      {
        onSuccess: (response) => {
          if (!response.data?.id) {
            Alert.alert(
              "Quiz unavailable",
              "The quiz was generated without an ID. Please try again.",
            );
            return;
          }
          navigation.navigate("Quiz", { quizId: response.data.id });
        },
        onError: (error) => {
          Alert.alert(
            "Quiz generation failed",
            error.message || "Please try again.",
          );
        },
      },
    );
  };

  return (
    <ScreenWrapper scroll>
      <View className="mb-6 mt-4">
        <Text className="text-3xl font-inter-bold text-slate-900 dark:text-slate-50">
          Practice quizzes
        </Text>
        <Text className="mt-2 text-base font-inter-regular text-slate-500">
          Choose a processed study material to create a quiz when you are ready.
        </Text>
      </View>

      <View className="mb-8 rounded-3xl bg-primary p-6">
        <View className="mb-4 h-12 w-12 items-center justify-center rounded-2xl bg-white/20">
          <Sparkles size={24} color="#FFFFFF" />
        </View>
        <Text className="mb-2 text-xl font-inter-bold text-white">
          Learn by testing yourself
        </Text>
        <Text className="text-sm font-inter-regular leading-5 text-white/80">
          Your quiz is generated from the material you select, so questions stay
          focused on what you are studying.
        </Text>
      </View>

      <View className="mb-4 flex-row items-center justify-between">
        <Text className="text-xl font-inter-semibold text-slate-900 dark:text-slate-50">
          Choose a summary
        </Text>
        <TouchableOpacity
          accessibilityRole="button"
          onPress={() => navigation.navigate("Tabs", { screen: "AI" })}
          className="flex-row items-center"
        >
          <Text className="mr-1 text-sm font-inter-medium text-primary">
            All summaries
          </Text>
          <ChevronRight size={16} color={colors.primary} />
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <View>
          <SkeletonCard lines={2} className="mb-4" />
          <SkeletonCard lines={2} className="mb-4" />
        </View>
      ) : summaries.length ? (
        summaries.map((summary) => (
          <View
            key={summary.id}
            className="mb-4 rounded-2xl bg-white p-4 dark:bg-slate-800"
          >
            <TouchableOpacity
              accessibilityRole="button"
              onPress={() =>
                navigation.navigate("AISummary", {
                  materialId: summary.materialId,
                })
              }
              className="mb-4 flex-row items-center"
            >
              <View className="mr-3 h-11 w-11 items-center justify-center rounded-xl bg-primary-50 dark:bg-primary-900/30">
                <FileText size={21} color={colors.primary} />
              </View>
              <View className="flex-1">
                <Text className="font-inter-semibold text-slate-900 dark:text-slate-50">
                  {summary.title}
                </Text>
                <Text className="mt-1 text-sm font-inter-regular text-slate-500">
                  {summary.difficulty.toLowerCase()} ·{" "}
                  {summary.estimatedReadTime} min read
                </Text>
              </View>
              <ChevronRight size={19} color={colors.textTertiary} />
            </TouchableOpacity>
            <Button
              title="Generate quiz"
              onPress={() => handleGenerateQuiz(summary.id)}
              loading={
                generateQuiz.isPending &&
                generateQuiz.variables?.summaryId === summary.id
              }
              disabled={generateQuiz.isPending}
              fullWidth
              icon={<BookOpen size={17} color="#FFFFFF" />}
            />
          </View>
        ))
      ) : (
        <EmptyState
          title="No study material yet"
          message="Upload course material and generate a summary first. You can then create a quiz from it."
          icon={<Sparkles size={36} color={colors.textSecondary} />}
          actionLabel="Upload Material"
          onAction={() => navigation.navigate("UploadMaterial", {})}
        />
      )}
    </ScreenWrapper>
  );
}
