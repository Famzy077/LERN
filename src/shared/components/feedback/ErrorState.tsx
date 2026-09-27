import React from 'react';
import { View, Text } from 'react-native';
import { AlertTriangle } from 'lucide-react-native';
import { Button } from '@/shared/components/ui/Button';
import { useTheme } from '@/shared/hooks/useTheme';

interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
}

export function ErrorState({
  title = 'Something went wrong',
  message,
  onRetry,
}: ErrorStateProps) {
  const { colors } = useTheme();

  return (
    <View className="flex-1 items-center justify-center px-8 py-16">
      <View className="mb-6 h-20 w-20 items-center justify-center rounded-3xl bg-red-50 dark:bg-red-900/30">
        <AlertTriangle size={36} color={colors.error} />
      </View>
      <Text className="mb-2 text-center text-lg font-inter-semibold text-slate-900 dark:text-slate-50">
        {title}
      </Text>
      <Text className="mb-6 text-center text-sm font-inter-regular text-slate-500">
        {message}
      </Text>
      {onRetry && <Button title="Try Again" onPress={onRetry} variant="secondary" size="sm" />}
    </View>
  );
}
