import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  type TouchableOpacityProps,
} from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { clsx } from 'clsx';

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends Omit<TouchableOpacityProps, 'children'> {
  title: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
}

const containerStyles: Record<ButtonVariant, string> = {
  primary: 'bg-primary active:bg-primary-dark',
  secondary: 'bg-primary-light dark:bg-primary-900 active:bg-primary-200',
  outline: 'bg-transparent border-2 border-primary dark:border-primary-400',
  ghost: 'bg-transparent active:bg-slate-100 dark:active:bg-slate-800',
};

const textStyles: Record<ButtonVariant, string> = {
  primary: 'text-white',
  secondary: 'text-primary dark:text-primary-400',
  outline: 'text-primary dark:text-primary-400',
  ghost: 'text-primary dark:text-primary-400',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-4 py-2 rounded-xl',
  md: 'px-6 py-3.5 rounded-2xl',
  lg: 'px-8 py-4 rounded-3xl',
};

const textSizeStyles: Record<ButtonSize, string> = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
};

export function Button({
  title,
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  disabled,
  className,
  ...rest
}: ButtonProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.97, { damping: 15, stiffness: 400 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 400 });
  };

  return (
    <AnimatedTouchable
      style={animatedStyle}
      className={clsx(
        'flex-row items-center justify-center',
        containerStyles[variant],
        sizeStyles[size],
        fullWidth && 'w-full',
        disabled && 'opacity-50',
        className,
      )}
      disabled={disabled || loading}
      activeOpacity={0.8}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'primary' ? '#FFFFFF' : '#2563EB'}
        />
      ) : (
        <>
          {icon && iconPosition === 'left' && (
            <Animated.View className="mr-2">{icon}</Animated.View>
          )}
          <Text
            className={clsx(
              'font-inter-semibold',
              textStyles[variant],
              textSizeStyles[size],
            )}
          >
            {title}
          </Text>
          {icon && iconPosition === 'right' && (
            <Animated.View className="ml-2">{icon}</Animated.View>
          )}
        </>
      )}
    </AnimatedTouchable>
  );
}
