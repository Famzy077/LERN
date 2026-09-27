import React, { useState } from 'react';
import { View, TextInput, Text, type TextInputProps } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { clsx } from 'clsx';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerClassName?: string;
}

export function Input({
  label,
  error,
  leftIcon,
  rightIcon,
  containerClassName,
  className,
  onFocus,
  onBlur,
  ...rest
}: InputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const borderColor = useSharedValue(0);

  const animatedBorder = useAnimatedStyle(() => ({
    borderColor: borderColor.value === 1 ? '#2563EB' : error ? '#DC2626' : '#E2E8F0',
  }));

  const handleFocus = (e: Parameters<NonNullable<TextInputProps['onFocus']>>[0]) => {
    setIsFocused(true);
    borderColor.value = withTiming(1, { duration: 200 });
    onFocus?.(e);
  };

  const handleBlur = (e: Parameters<NonNullable<TextInputProps['onBlur']>>[0]) => {
    setIsFocused(false);
    borderColor.value = withTiming(0, { duration: 200 });
    onBlur?.(e);
  };

  return (
    <View className={clsx('mb-4', containerClassName)}>
      {label && (
        <Text className="mb-2 text-sm font-inter-medium text-slate-700 dark:text-slate-300">
          {label}
        </Text>
      )}
      <Animated.View
        style={animatedBorder}
        className={clsx(
          'flex-row items-center rounded-2xl border-2 bg-white px-4 dark:bg-slate-800',
          isFocused && 'border-primary',
          error && !isFocused && 'border-red-500',
        )}
      >
        {leftIcon && <View className="mr-3">{leftIcon}</View>}
        <TextInput
          className={clsx(
            'flex-1 py-3.5 text-base font-inter-regular text-slate-900 dark:text-slate-50',
            className,
          )}
          placeholderTextColor="#94A3B8"
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...rest}
        />
        {rightIcon && <View className="ml-3">{rightIcon}</View>}
      </Animated.View>
      {!!error && (
        <Text className="mt-1.5 text-sm font-inter-regular text-red-500">
          {error}
        </Text>
      )}
    </View>
  );
}
