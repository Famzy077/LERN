import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { CheckCircle, XCircle } from 'lucide-react-native';
import { ScreenWrapper } from '@/shared/components/layout/ScreenWrapper';
import { Button } from '@/shared/components/ui/Button';
import { ProgressCard } from '@/shared/components/cards/ProgressCard';
import { XPBadge } from '@/shared/components/cards/XPBadge';
import { LoadingSkeleton } from '@/shared/components/ui/LoadingSkeleton';
import { ErrorState } from '@/shared/components/feedback/ErrorState';
import { useQuizResult } from '../hooks/useQuizResult';

export default function QuizResultScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const quizId = route.params?.quizId;

  const { data: response, isLoading, isError, error, refetch } = useQuizResult(quizId);

  if (isLoading) {
    return (
      <ScreenWrapper>
        <View className="flex-1 p-4 bg-surface dark:bg-slate-900 items-center justify-center">
          <LoadingSkeleton className="h-48 w-48 rounded-full mb-8" />
          <LoadingSkeleton className="h-12 w-full mb-4 rounded-3xl" />
          <LoadingSkeleton className="h-12 w-full mb-4 rounded-3xl" />
        </View>
      </ScreenWrapper>
    );
  }

  if (isError || !response?.data) {
    return (
      <ScreenWrapper>
        <ErrorState
          title="Failed to load results"
          message={error?.message || 'Unknown error occurred'}
          onRetry={refetch}
        />
      </ScreenWrapper>
    );
  }

  const result = response.data;
  const accuracy = Math.round((result.correctAnswers / result.totalQuestions) * 100);

  const renderQuestion = ({ item, index }: { item: any; index: number }) => (
    <View className="bg-white dark:bg-slate-800 p-4 rounded-3xl mb-4 border border-slate-100 dark:border-slate-700">
      <View className="flex-row items-start mb-2">
        <Text className="text-slate-900 dark:text-slate-50 font-bold mr-2">{index + 1}.</Text>
        <Text className="text-slate-900 dark:text-slate-50 flex-1">{item.text}</Text>
        {item.isCorrect ? (
          <CheckCircle size={20} className="text-success text-green-600 ml-2" />
        ) : (
          <XCircle size={20} className="text-error text-red-600 ml-2" />
        )}
      </View>
      <View className="mt-2 pl-6">
        <Text className={`text-sm mb-1 ${item.isCorrect ? 'text-green-600' : 'text-red-600'}`}>
          Your answer: {item.selectedAnswer}
        </Text>
        {!item.isCorrect && (
          <Text className="text-sm text-green-600 mb-2">
            Correct answer: {item.correctAnswer}
          </Text>
        )}
        <Text className="text-slate-500 text-xs mt-2 italic">{item.explanation}</Text>
      </View>
    </View>
  );

  return (
    <ScreenWrapper>
      <ScrollView className="flex-1 bg-surface dark:bg-slate-900">
        <View className="items-center p-6 pt-12">
          <Text className="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-8">Quiz Completed!</Text>
          
          <View className="items-center justify-center mb-8 relative">
            <ProgressCard value={accuracy} title="Accuracy" size="lg" />
            <View className="absolute items-center justify-center">
              <Text className="text-4xl font-bold text-slate-900 dark:text-slate-50">{result.score}</Text>
              <Text className="text-slate-500">Points</Text>
            </View>
          </View>
          
          <Text className="text-5xl font-extrabold text-primary mb-8">{result.grade}</Text>

          <View className="flex-row justify-around w-full mb-8 bg-white dark:bg-slate-800 p-4 rounded-3xl">
            <View className="items-center">
              <Text className="text-slate-500 mb-1">XP Earned</Text>
              <XPBadge xp={result.xpEarned} />
            </View>
            <View className="w-[1px] h-full bg-slate-200 dark:bg-slate-700" />
            <View className="items-center">
              <Text className="text-slate-500 mb-1">Time</Text>
              <Text className="text-lg font-bold text-slate-900 dark:text-slate-50">
                {Math.floor(result.timeTaken / 60)}m {result.timeTaken % 60}s
              </Text>
            </View>
            <View className="w-[1px] h-full bg-slate-200 dark:bg-slate-700" />
            <View className="items-center">
              <Text className="text-slate-500 mb-1">Accuracy</Text>
              <Text className="text-lg font-bold text-slate-900 dark:text-slate-50">{accuracy}%</Text>
            </View>
          </View>
        </View>

        <View className="px-4 pb-8">
          <Text className="text-xl font-bold text-slate-900 dark:text-slate-50 mb-4">Question Breakdown</Text>
          <FlatList
            data={result.questions}
            renderItem={renderQuestion}
            keyExtractor={item => item.id}
            scrollEnabled={false}
          />
        </View>
      </ScrollView>

      <View className="p-4 bg-white dark:bg-slate-800 border-t border-slate-100 dark:border-slate-700">
        <Button
          title="Review Answers"
          variant="outline"
          onPress={() => navigation.navigate('Quiz', { quizId, reviewMode: true })}
          className="mb-3"
        />
        <Button
          title="Back to Home"
          onPress={() => navigation.navigate('Home')}
          className="w-full bg-primary"
        />
      </View>
    </ScreenWrapper>
  );
}
