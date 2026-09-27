import React, { useEffect } from 'react';
import { View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  interpolate,
} from 'react-native-reanimated';
import { clsx } from 'clsx';

interface LoadingSkeletonProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  className?: string;
}

export function LoadingSkeleton({
  width = '100%',
  height = 20,
  borderRadius = 12,
  className,
}: LoadingSkeletonProps) {
  const shimmer = useSharedValue(0);

  useEffect(() => {
    shimmer.value = withRepeat(withTiming(1, { duration: 1200 }), -1, true);
  }, [shimmer]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(shimmer.value, [0, 1], [0.4, 0.8]),
  }));

  return (
    <Animated.View
      style={[{ width: width as number, height, borderRadius }, animatedStyle]}
      className={clsx('bg-slate-200 dark:bg-slate-700', className)}
    />
  );
}

interface SkeletonCardProps {
  lines?: number;
  className?: string;
}

export function SkeletonCard({ lines = 3, className }: SkeletonCardProps) {
  return (
    <View className={clsx('rounded-3xl bg-white p-5 dark:bg-slate-800', className)}>
      <LoadingSkeleton width="60%" height={16} className="mb-3" />
      {Array.from({ length: lines }).map((_, i) => (
        <LoadingSkeleton
          key={i}
          width={i === lines - 1 ? '40%' : '100%'}
          height={12}
          className="mb-2"
        />
      ))}
    </View>
  );
}
