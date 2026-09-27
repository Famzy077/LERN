import React from 'react';
import { View, ScrollView, type ViewProps } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useTheme } from '@/shared/hooks/useTheme';
import { clsx } from 'clsx';

interface ScreenWrapperProps extends ViewProps {
  scroll?: boolean;
  padded?: boolean;
  edges?: ('top' | 'bottom' | 'left' | 'right')[];
  children: React.ReactNode;
}

export function ScreenWrapper({
  scroll = false,
  padded = true,
  edges = ['top'],
  children,
  className,
  ...rest
}: ScreenWrapperProps) {
  const { isDark } = useTheme();

  const content = (
    <View className={clsx(padded && 'px-5', 'flex-1', className)} {...rest}>
      {children}
    </View>
  );

  return (
    <SafeAreaView
      edges={edges}
      className="flex-1 bg-white dark:bg-slate-900"
    >
      <StatusBar style={isDark ? 'light' : 'dark'} />
      {scroll ? (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          {content}
        </ScrollView>
      ) : (
        content
      )}
    </SafeAreaView>
  );
}
