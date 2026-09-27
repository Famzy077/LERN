import React from 'react';
import { View, Text } from 'react-native';
import { FileQuestion } from 'lucide-react-native';
import { Button } from '@/shared/components/ui/Button';
import { useTheme } from '@/shared/hooks/useTheme';

interface EmptyStateProps {
  title: string;
  message: string;
  icon?: React.ReactNode;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({
  title,
  message,
  icon,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  const { colors } = useTheme();

  return (
    <View className="flex-1 items-center justify-center px-8 py-16">
      <View className="mb-6 h-20 w-20 items-center justify-center rounded-3xl bg-slate-100 dark:bg-slate-800">
        {icon ?? <FileQuestion size={36} color={colors.textSecondary} />}
      </View>
      <Text className="mb-2 text-center text-lg font-inter-semibold text-slate-900 dark:text-slate-50">
        {title}
      </Text>
      <Text className="mb-6 text-center text-sm font-inter-regular text-slate-500">
        {message}
      </Text>
      {actionLabel && onAction && (
        <Button title={actionLabel} onPress={onAction} size="sm" />
      )}
    </View>
  );
}
