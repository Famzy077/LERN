import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { FileUp, Sparkles, FileText, ChevronRight } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { ScreenWrapper } from '@/shared/components/layout/ScreenWrapper';
import { EmptyState } from '@/shared/components/feedback/EmptyState';
import { useTheme } from '@/shared/hooks/useTheme';
import { useRecentSummaries } from '@/features/ai/hooks/useSummary';
import { SkeletonCard } from '@/shared/components/ui/LoadingSkeleton';
import type { MainScreenProps } from '@/navigation/types';

export default function AIHubScreen() {
  const navigation = useNavigation<MainScreenProps<'Tabs'>['navigation']>();
  const { colors } = useTheme();
  const { data: summariesResponse, isLoading } = useRecentSummaries();

  const summaries = summariesResponse?.data ?? [];

  return (
    <ScreenWrapper scroll>
      <View className="mb-6 mt-4">
        <Text className="text-3xl font-inter-bold text-slate-900 dark:text-slate-50">
          AI Assistant
        </Text>
        <Text className="text-base font-inter-regular text-slate-500">
          Upload materials and get instant summaries
        </Text>
      </View>

      <TouchableOpacity
        onPress={() => navigation.navigate('UploadMaterial', {})}
        activeOpacity={0.8}
        className="mb-8 overflow-hidden rounded-3xl bg-primary"
      >
        <View className="flex-row items-center justify-between p-6">
          <View className="flex-1">
            <View className="mb-3 h-12 w-12 items-center justify-center rounded-2xl bg-white/20">
              <FileUp size={24} color="#FFFFFF" />
            </View>
            <Text className="mb-1 text-xl font-inter-bold text-white">
              Upload New Material
            </Text>
            <Text className="text-sm font-inter-medium text-white/80">
              PDF, DOCX, Images
            </Text>
          </View>
          <Sparkles size={48} color="#FFFFFF" opacity={0.2} />
        </View>
      </TouchableOpacity>

      <View className="mb-4 flex-row items-center justify-between">
        <Text className="text-xl font-inter-semibold text-slate-900 dark:text-slate-50">
          Recent Summaries
        </Text>
      </View>

      {isLoading ? (
        <View>
          <SkeletonCard lines={2} className="mb-4" />
          <SkeletonCard lines={2} className="mb-4" />
        </View>
      ) : summaries.length > 0 ? (
        summaries.map((summary) => (
          <TouchableOpacity
            key={summary.id}
            onPress={() => navigation.navigate('AISummary', { materialId: summary.materialId })}
            className="mb-4 flex-row items-center rounded-2xl bg-white p-4 dark:bg-slate-800"
          >
            <View className="mr-4 h-12 w-12 items-center justify-center rounded-xl bg-primary-50 dark:bg-primary-900/30">
              <FileText size={24} color={colors.primary} />
            </View>
            <View className="flex-1">
              <Text className="text-base font-inter-medium text-slate-900 dark:text-slate-50">
                {summary.title}
              </Text>
              <Text className="text-sm font-inter-regular text-slate-500">
                {summary.difficulty} • {summary.estimatedReadTime} min read
              </Text>
            </View>
            <ChevronRight size={20} color={colors.textTertiary} />
          </TouchableOpacity>
        ))
      ) : (
        <EmptyState
          title="No summaries yet"
          message="Upload a document to generate your first AI summary."
          icon={<Sparkles size={36} color={colors.textSecondary} />}
          actionLabel="Upload Material"
          onAction={() => navigation.navigate('UploadMaterial', {})}
        />
      )}
    </ScreenWrapper>
  );
}
