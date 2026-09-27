import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { Check, X } from 'lucide-react-native';
import { clsx } from 'clsx';

type OptionState = 'default' | 'selected' | 'correct' | 'wrong' | 'disabled';

interface QuizOptionProps {
  label: string; // A, B, C, D
  text: string;
  state: OptionState;
  onPress: () => void;
  disabled?: boolean;
}

const stateStyles: Record<OptionState, { container: string; text: string }> = {
  default: {
    container: 'border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800',
    text: 'text-slate-900 dark:text-slate-50',
  },
  selected: {
    container: 'border-primary bg-primary-50 dark:border-primary-400 dark:bg-primary-900/30',
    text: 'text-primary dark:text-primary-400',
  },
  correct: {
    container: 'border-green-500 bg-green-50 dark:border-green-400 dark:bg-green-900/30',
    text: 'text-green-700 dark:text-green-400',
  },
  wrong: {
    container: 'border-red-500 bg-red-50 dark:border-red-400 dark:bg-red-900/30',
    text: 'text-red-700 dark:text-red-400',
  },
  disabled: {
    container: 'border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800 opacity-50',
    text: 'text-slate-400 dark:text-slate-500',
  },
};

const labelBgStyles: Record<OptionState, string> = {
  default: 'bg-slate-100 dark:bg-slate-700',
  selected: 'bg-primary-100 dark:bg-primary-800',
  correct: 'bg-green-100 dark:bg-green-800',
  wrong: 'bg-red-100 dark:bg-red-800',
  disabled: 'bg-slate-100 dark:bg-slate-700',
};

export function QuizOption({ label, text, state, onPress, disabled }: QuizOptionProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePress = () => {
    scale.value = withSpring(0.97, { damping: 15, stiffness: 400 });
    setTimeout(() => {
      scale.value = withSpring(1, { damping: 15, stiffness: 400 });
    }, 100);
    onPress();
  };

  const styles = stateStyles[state];

  return (
    <Animated.View style={animatedStyle}>
      <TouchableOpacity
        onPress={handlePress}
        disabled={disabled || state === 'disabled'}
        activeOpacity={0.7}
        className={clsx(
          'mb-3 flex-row items-center rounded-2xl border-2 p-4',
          styles.container,
        )}
      >
        {/* Label circle */}
        <View
          className={clsx(
            'mr-4 h-10 w-10 items-center justify-center rounded-full',
            labelBgStyles[state],
          )}
        >
          {state === 'correct' ? (
            <Check size={18} color="#16A34A" strokeWidth={3} />
          ) : state === 'wrong' ? (
            <X size={18} color="#DC2626" strokeWidth={3} />
          ) : (
            <Text className={clsx('text-sm font-inter-bold', styles.text)}>
              {label}
            </Text>
          )}
        </View>

        {/* Option text */}
        <Text
          className={clsx('flex-1 text-base font-inter-medium', styles.text)}
          numberOfLines={3}
        >
          {text}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
}
