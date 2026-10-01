import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { BookOpen } from "lucide-react-native";
import Animated, { FadeInRight } from "react-native-reanimated";
import { useTheme } from "@/shared/hooks/useTheme";
import { Badge } from "@/shared/components/ui/Badge";
import { clsx } from "clsx";

interface CourseCardProps {
  id: string;
  title: string;
  subject: string;
  progress: number; // 0-100
  lastAccessed?: string;
  totalTopics: number;
  completedTopics: number;
  onPress: (id: string) => void;
  index?: number;
  className?: string;
}

export function CourseCard({
  id,
  title,
  subject,
  progress,
  lastAccessed,
  totalTopics,
  completedTopics,
  onPress,
  index = 0,
  className,
}: CourseCardProps) {
  const { colors } = useTheme();

  return (
    <Animated.View entering={FadeInRight.delay(index * 100).springify()}>
      <TouchableOpacity
        onPress={() => onPress(id)}
        activeOpacity={0.7}
        className={clsx(
          "rounded-3xl bg-white p-5 dark:bg-slate-800",
          className,
        )}
      >
        <View className="mb-3 flex-row items-center justify-between">
          <View className="h-10 w-10 items-center justify-center rounded-xl bg-primary-100 dark:bg-primary-900">
            <BookOpen size={20} color={colors.primary} />
          </View>
          <Badge label={subject} variant="neutral" />
        </View>

        <Text
          className="mb-1 text-base font-inter-semibold text-slate-900 dark:text-slate-50"
          numberOfLines={2}
        >
          {title}
        </Text>

        <Text className="mb-3 text-xs font-inter-regular text-slate-500">
          {completedTopics}/{totalTopics} materials processed
        </Text>

        {/* Progress bar */}
        <View className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700">
          <View
            className="h-full rounded-full bg-primary"
            style={{ width: `${progress}%` }}
          />
        </View>

        <View className="mt-2 flex-row items-center justify-between">
          <Text className="text-xs font-inter-medium text-primary">
            {progress}% learning activity
          </Text>
          {lastAccessed && (
            <Text className="text-xs font-inter-regular text-slate-400">
              {lastAccessed}
            </Text>
          )}
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}
