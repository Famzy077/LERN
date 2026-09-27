import React, { useState, useRef } from 'react';
import { View, Text, ScrollView, Dimensions, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Brain, Sparkles, BarChart3 } from 'lucide-react-native';
import { ScreenWrapper } from '@/shared/components/layout/ScreenWrapper';
import { Button } from '@/shared/components/ui/Button';
import { useAuthStore } from '../store/auth.store';

const { width } = Dimensions.get('window');

const SLIDES = [
  {
    id: '1',
    title: 'Learn Faster',
    description: 'Use AI to generate flashcards and summaries instantly.',
    Icon: Brain,
  },
  {
    id: '2',
    title: 'Study Smarter',
    description: 'Personalized quizzes tailored to your syllabus.',
    Icon: Sparkles,
  },
  {
    id: '3',
    title: 'Track Progress',
    description: 'Monitor your learning streak and exam readiness.',
    Icon: BarChart3,
  },
];

const OnboardingScreen = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);
  const navigation = useNavigation<any>();
  const setOnboarded = useAuthStore((state) => state.setOnboarded); // Assuming exists

  const handleScroll = (event: any) => {
    const slideSize = event.nativeEvent.layoutMeasurement.width;
    const index = event.nativeEvent.contentOffset.x / slideSize;
    setCurrentIndex(Math.round(index));
  };

  const completeOnboarding = () => {
    setOnboarded(true);
    navigation.replace('Login');
  };

  const nextSlide = () => {
    if (currentIndex < SLIDES.length - 1) {
      scrollViewRef.current?.scrollTo({ x: (currentIndex + 1) * width, animated: true });
    } else {
      completeOnboarding();
    }
  };

  return (
    <ScreenWrapper className="flex-1 bg-surface dark:bg-slate-900">
      <View className="flex-row justify-end p-6">
        <TouchableOpacity onPress={completeOnboarding}>
          <Text className="text-slate-500 font-medium">Skip</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        className="flex-1"
      >
        {SLIDES.map((slide) => (
          <View key={slide.id} style={{ width }} className="items-center justify-center p-8">
            <View className="bg-primary/10 p-6 rounded-full mb-8">
              <slide.Icon size={80} className="text-primary" />
            </View>
            <Text className="text-3xl font-bold text-slate-900 dark:text-slate-50 mb-4 text-center">
              {slide.title}
            </Text>
            <Text className="text-lg text-slate-500 text-center">
              {slide.description}
            </Text>
          </View>
        ))}
      </ScrollView>

      <View className="p-8">
        <View className="flex-row justify-center space-x-2 mb-8">
          {SLIDES.map((_, index) => (
            <View
              key={index}
              className={`h-2 rounded-full transition-all ${
                index === currentIndex ? 'w-8 bg-primary' : 'w-2 bg-slate-300 dark:bg-slate-700'
              }`}
            />
          ))}
        </View>
        <Button
          title={currentIndex === SLIDES.length - 1 ? 'Get Started' : 'Next'}
          onPress={nextSlide}
          className="w-full"
        />
      </View>
    </ScreenWrapper>
  );
};

export default OnboardingScreen;
