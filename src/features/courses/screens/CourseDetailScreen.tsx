import React from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  BookOpen,
  CalendarDays,
  FileText,
  Sparkles,
} from "lucide-react-native";
import { ScreenWrapper } from "@/shared/components/layout/ScreenWrapper";
import { Button } from "@/shared/components/ui/Button";
import { EmptyState } from "@/shared/components/feedback/EmptyState";
import { ErrorState } from "@/shared/components/feedback/ErrorState";
import { useMaterials } from "@/features/ai/hooks/useUpload";
import {
  useGenerateQuiz,
  useRecentSummaries,
} from "@/features/ai/hooks/useSummary";
import { useCourse } from "../hooks/useCourses";
import type { MainScreenProps } from "@/navigation/types";

const formatDate = (date: string) => {
  const value = new Date(date);
  return Number.isNaN(value.getTime())
    ? null
    : value.toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
};

const CourseDetailScreen = ({
  navigation,
  route,
}: MainScreenProps<"CourseDetail">) => {
  const courseId = route.params.courseId;
  const {
    data: courseResponse,
    isLoading: courseLoading,
    isError: courseError,
    error: courseErrorDetails,
    refetch: refetchCourse,
  } = useCourse(courseId);
  const {
    data: materialsResponse,
    isLoading: materialsLoading,
    isError: materialsError,
    error: materialsErrorDetails,
    refetch: refetchMaterials,
  } = useMaterials(courseId);
  const {
    data: summariesResponse,
    isLoading: summariesLoading,
    isError: summariesError,
    error: summariesErrorDetails,
    refetch: refetchSummaries,
  } = useRecentSummaries(courseId);
  const generateQuiz = useGenerateQuiz();

  if (courseLoading) {
    return (
      <ScreenWrapper padded={false}>
        <View className="flex-1 items-center justify-center bg-surface dark:bg-slate-900">
          <ActivityIndicator accessibilityLabel="Loading course" size="large" />
        </View>
      </ScreenWrapper>
    );
  }

  const course = courseResponse?.data;
  if (courseError || !course) {
    return (
      <ScreenWrapper padded={false}>
        <ErrorState
          title="Could not load course"
          message={
            courseErrorDetails?.message ??
            "This course could not be found. Please try again."
          }
          onRetry={() => void refetchCourse()}
        />
      </ScreenWrapper>
    );
  }

  const materials = materialsResponse?.data ?? [];
  const summaries = summariesResponse?.data ?? [];
  const hasProgress =
    typeof course.progress === "number" && Number.isFinite(course.progress);
  const progress = hasProgress
    ? Math.max(0, Math.min(100, course.progress))
    : 0;
  const hasTopicProgress =
    typeof course.completedTopics === "number" &&
    Number.isFinite(course.completedTopics) &&
    typeof course.totalTopics === "number" &&
    Number.isFinite(course.totalTopics);
  const createdAt = formatDate(course.createdAt);

  const openUpload = () =>
    navigation.navigate("UploadMaterial", { courseId: course.id });

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
          navigation.navigate("Quiz", {
            quizId: response.data.id,
            mode: "practice",
          });
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
    <ScreenWrapper padded={false}>
      <View className="flex-1 bg-surface dark:bg-slate-900">
        <View className="flex-row items-center border-b border-slate-100 px-4 py-3 dark:border-slate-800">
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel="Go back to courses"
            onPress={() => navigation.goBack()}
            className="mr-3 rounded-xl px-3 py-2"
          >
            <Text className="font-inter-semibold text-primary">Back</Text>
          </TouchableOpacity>
          <Text
            className="flex-1 text-lg font-inter-semibold text-slate-900 dark:text-slate-50"
            numberOfLines={1}
          >
            Course details
          </Text>
          <Button
            title="Upload"
            size="sm"
            onPress={openUpload}
            accessibilityLabel={`Upload material to ${course.title}`}
          />
        </View>

        <ScrollView
          className="flex-1"
          contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
          accessibilityLabel={`${course.title} course details`}
        >
          <View className="mb-5 rounded-3xl bg-white p-5 dark:bg-slate-800">
            <Text className="mb-2 text-2xl font-inter-bold text-slate-900 dark:text-slate-50">
              {course.title}
            </Text>
            <View className="mb-4 flex-row flex-wrap items-center">
              <View className="mr-2 rounded-full bg-primary-50 px-3 py-1 dark:bg-primary-900/30">
                <Text className="font-inter-medium text-primary">
                  {course.subject}
                </Text>
              </View>
              {createdAt && (
                <View className="flex-row items-center">
                  <CalendarDays size={14} color="#64748B" />
                  <Text className="ml-1 text-sm text-slate-500">
                    Added {createdAt}
                  </Text>
                </View>
              )}
            </View>
            {!!course.description && (
              <Text className="text-base leading-6 text-slate-600 dark:text-slate-300">
                {course.description}
              </Text>
            )}
          </View>

          {(hasProgress || hasTopicProgress) && (
            <View className="mb-6 rounded-3xl bg-white p-5 dark:bg-slate-800">
              <Text className="mb-4 text-lg font-inter-semibold text-slate-900 dark:text-slate-50">
                Your progress
              </Text>
              {hasProgress && (
                <>
                  <View className="mb-2 flex-row items-center justify-between">
                    <Text className="text-sm text-slate-500">
                      Learning activity
                    </Text>
                    <Text className="font-inter-semibold text-primary">
                      {Math.round(progress)}%
                    </Text>
                  </View>
                  <View
                    accessibilityRole="progressbar"
                    accessibilityLabel="Learning activity"
                    accessibilityValue={{
                      min: 0,
                      max: 100,
                      now: progress,
                    }}
                    className="mb-3 h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700"
                  >
                    <View
                      className="h-full rounded-full bg-primary"
                      style={{ width: `${progress}%` }}
                    />
                  </View>
                </>
              )}
              {hasTopicProgress && (
                <Text className="text-sm text-slate-500">
                  {course.completedTopics} of {course.totalTopics} materials
                  processed
                </Text>
              )}
            </View>
          )}

          <View className="mb-6">
            <View className="mb-3 flex-row items-center justify-between">
              <Text className="text-xl font-inter-semibold text-slate-900 dark:text-slate-50">
                Materials
              </Text>
              {!materialsLoading && !materialsError && (
                <Text className="text-sm text-slate-500">
                  {materials.length}
                </Text>
              )}
            </View>
            {materialsLoading ? (
              <ActivityIndicator accessibilityLabel="Loading course materials" />
            ) : materialsError ? (
              <View className="rounded-2xl bg-white p-4 dark:bg-slate-800">
                <Text className="mb-3 text-sm text-slate-500">
                  {materialsErrorDetails?.message ??
                    "Course materials could not be loaded."}
                </Text>
                <Button
                  title="Retry"
                  size="sm"
                  variant="secondary"
                  onPress={() => void refetchMaterials()}
                />
              </View>
            ) : materials.length ? (
              materials.map((material) => (
                <View
                  key={material.id}
                  className="mb-3 flex-row items-center rounded-2xl bg-white p-4 dark:bg-slate-800"
                >
                  <View className="mr-3 h-11 w-11 items-center justify-center rounded-xl bg-primary-50 dark:bg-primary-900/30">
                    <FileText size={21} color="#2563EB" />
                  </View>
                  <View className="flex-1">
                    <Text
                      className="font-inter-semibold text-slate-900 dark:text-slate-50"
                      numberOfLines={2}
                    >
                      {material.fileName}
                    </Text>
                    <Text className="mt-1 text-sm text-slate-500">
                      {material.status.toLowerCase()}
                    </Text>
                  </View>
                </View>
              ))
            ) : (
              <View className="rounded-3xl bg-white dark:bg-slate-800">
                <EmptyState
                  title="No materials yet"
                  message="Upload notes or a document to add study material to this course."
                  icon={<FileText size={36} color="#64748B" />}
                  actionLabel="Upload material"
                  onAction={openUpload}
                />
              </View>
            )}
          </View>

          <View>
            <View className="mb-3 flex-row items-center">
              <Sparkles size={20} color="#2563EB" />
              <Text className="ml-2 text-xl font-inter-semibold text-slate-900 dark:text-slate-50">
                Summaries and quizzes
              </Text>
            </View>
            {summariesLoading ? (
              <ActivityIndicator accessibilityLabel="Loading course summaries" />
            ) : summariesError ? (
              <View className="rounded-2xl bg-white p-4 dark:bg-slate-800">
                <Text className="mb-3 text-sm text-slate-500">
                  {summariesErrorDetails?.message ??
                    "Available summaries could not be loaded."}
                </Text>
                <Button
                  title="Retry"
                  size="sm"
                  variant="secondary"
                  onPress={() => void refetchSummaries()}
                />
              </View>
            ) : summaries.length ? (
              summaries.map((summary) => (
                <View
                  key={summary.id}
                  className="mb-3 rounded-2xl bg-white p-4 dark:bg-slate-800"
                >
                  <Text className="mb-1 font-inter-semibold text-slate-900 dark:text-slate-50">
                    {summary.title}
                  </Text>
                  <Text className="mb-4 text-sm text-slate-500">
                    {summary.difficulty.toLowerCase()} ·{" "}
                    {summary.estimatedReadTime} min read
                  </Text>
                  <View className="flex-row">
                    <Button
                      title="View summary"
                      variant="secondary"
                      size="sm"
                      className="mr-2 flex-1"
                      accessibilityLabel={`View summary: ${summary.title}`}
                      onPress={() =>
                        navigation.navigate("AISummary", {
                          materialId: summary.materialId,
                        })
                      }
                    />
                    <Button
                      title="Generate quiz"
                      size="sm"
                      className="flex-1"
                      icon={<BookOpen size={15} color="#FFFFFF" />}
                      accessibilityLabel={`Generate quiz from ${summary.title}`}
                      onPress={() => handleGenerateQuiz(summary.id)}
                      loading={
                        generateQuiz.isPending &&
                        generateQuiz.variables?.summaryId === summary.id
                      }
                      disabled={generateQuiz.isPending}
                    />
                  </View>
                </View>
              ))
            ) : (
              <View className="rounded-3xl bg-white dark:bg-slate-800">
                <EmptyState
                  title="No summaries available"
                  message="Summaries will appear here after this course’s material has been processed."
                  icon={<Sparkles size={36} color="#64748B" />}
                />
              </View>
            )}
          </View>
        </ScrollView>
      </View>
    </ScreenWrapper>
  );
};

export default CourseDetailScreen;
