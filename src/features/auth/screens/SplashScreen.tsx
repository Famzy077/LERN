import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import Animated, { FadeIn, useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import { ScreenWrapper } from '@/shared/components/layout/ScreenWrapper';
import { useAuthStore } from '../store/auth.store';

const SplashScreen = () => {
  const scale = useSharedValue(0.5);
  const navigation = useNavigation<any>();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated); // Assuming this exists

  useEffect(() => {
    scale.value = withSpring(1);
    const timer = setTimeout(() => {
      if (isAuthenticated) {
        navigation.replace('Main');
      } else {
        navigation.replace('Onboarding');
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [isAuthenticated, navigation, scale]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  return (
    <ScreenWrapper edges={[]} className="flex-1 bg-primary justify-center items-center">
      <Animated.View entering={FadeIn.duration(1000)} style={animatedStyle}>
        <Text className="text-white text-5xl font-bold tracking-widest"></Text>
      </Animated.View>
    </ScreenWrapper>
  );
};

export default SplashScreen;
