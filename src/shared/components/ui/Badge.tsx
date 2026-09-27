import React from 'react';
import { View, Text } from 'react-native';
import { clsx } from 'clsx';

type BadgeVariant = 'primary' | 'success' | 'error' | 'warning' | 'neutral';

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  icon?: React.ReactNode;
  className?: string;
}

const variantStyles: Record<BadgeVariant, { container: string; text: string }> = {
  primary: {
    container: 'bg-primary-100 dark:bg-primary-900',
    text: 'text-primary dark:text-primary-400',
  },
  success: {
    container: 'bg-green-50 dark:bg-green-900/30',
    text: 'text-green-600 dark:text-green-400',
  },
  error: {
    container: 'bg-red-50 dark:bg-red-900/30',
    text: 'text-red-600 dark:text-red-400',
  },
  warning: {
    container: 'bg-amber-50 dark:bg-amber-900/30',
    text: 'text-amber-600 dark:text-amber-400',
  },
  neutral: {
    container: 'bg-slate-100 dark:bg-slate-700',
    text: 'text-slate-600 dark:text-slate-300',
  },
};

export function Badge({ label, variant = 'primary', icon, className }: BadgeProps) {
  const styles = variantStyles[variant];

  return (
    <View
      className={clsx(
        'flex-row items-center self-start rounded-full px-3 py-1.5',
        styles.container,
        className,
      )}
    >
      {icon && <View className="mr-1.5">{icon}</View>}
      <Text className={clsx('text-xs font-inter-semibold', styles.text)}>
        {label}
      </Text>
    </View>
  );
}
