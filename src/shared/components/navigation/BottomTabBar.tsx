import React from 'react';
import { View, Text, TouchableOpacity, Platform } from 'react-native';
import { Home, BookOpen, Sparkles, BarChart3, User } from 'lucide-react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useTheme } from '@/shared/hooks/useTheme';
import { clsx } from 'clsx';

const TAB_ICONS = {
  Home: Home,
  Courses: BookOpen,
  AI: Sparkles,
  Progress: BarChart3,
  Profile: User,
} as const;

type TabKey = keyof typeof TAB_ICONS;

interface TabButtonProps {
  label: string;
  isFocused: boolean;
  onPress: () => void;
  onLongPress: () => void;
  iconKey: TabKey;
}

function TabButton({ label, isFocused, onPress, onLongPress, iconKey }: TabButtonProps) {
  const { colors } = useTheme();
  const scale = useSharedValue(1);
  const Icon = TAB_ICONS[iconKey];

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.9, { damping: 15, stiffness: 400 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 400 });
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      onLongPress={onLongPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={0.7}
      className="flex-1 items-center justify-center py-2"
    >
      <Animated.View style={animatedStyle} className="items-center">
        <View
          className={clsx(
            'mb-1 items-center justify-center rounded-2xl',
            isFocused
              ? 'h-12 w-14 bg-primary-100 dark:bg-primary-900/40'
              : 'h-12 w-14',
          )}
        >
          <Icon
            size={24}
            color={isFocused ? colors.primary : colors.textSecondary}
            fill={isFocused && iconKey === 'Home' ? colors.primary : 'none'}
          />
        </View>
        <Text
          className={clsx(
            'text-xs',
            isFocused
              ? 'font-inter-semibold text-primary dark:text-primary-400'
              : 'font-inter-medium text-slate-500 dark:text-slate-400',
          )}
        >
          {label}
        </Text>
      </Animated.View>
    </TouchableOpacity>
  );
}

export function BottomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      className="border-t border-slate-100 bg-white dark:border-slate-700 dark:bg-slate-900"
      style={{ paddingBottom: Math.max(insets.bottom, 8) }}
    >
      <View className="mx-4 mt-1 flex-row rounded-3xl bg-slate-50 px-2 py-1 dark:bg-slate-800">
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const label =
            (typeof options.tabBarLabel === 'string'
              ? options.tabBarLabel
              : options.title) ?? route.name;
          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name, route.params);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: 'tabLongPress',
              target: route.key,
            });
          };

          return (
            <TabButton
              key={route.key}
              label={label}
              isFocused={isFocused}
              onPress={onPress}
              onLongPress={onLongPress}
              iconKey={route.name as TabKey}
            />
          );
        })}
      </View>
    </View>
  );
}
