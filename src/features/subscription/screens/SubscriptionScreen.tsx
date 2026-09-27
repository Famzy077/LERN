import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ArrowLeft, Check, X } from 'lucide-react-native';
import { useSubscriptionPlans, useCurrentSubscription, useSubscribe } from '../hooks/useSubscription';
import { ScreenWrapper } from '@/shared/components/layout/ScreenWrapper';
import { LoadingSkeleton } from '@/shared/components/ui/LoadingSkeleton';
import { ErrorState } from '@/shared/components/feedback/ErrorState';
import { Button } from '@/shared/components/ui/Button';

export default function SubscriptionScreen() {
  const navigation = useNavigation<any>();
  const { data: plansData, isLoading: plansLoading, isError: plansError } = useSubscriptionPlans();
  const { data: currentSubData, isLoading: subLoading, isError: subError } = useCurrentSubscription();
  const { mutate: subscribe, isPending: isSubscribing } = useSubscribe();
  
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);

  if (plansLoading || subLoading) {
    return <ScreenWrapper><LoadingSkeleton className="flex-1 m-4" /></ScreenWrapper>;
  }

  if (plansError || subError) {
    return <ScreenWrapper><ErrorState message="An error occurred" onRetry={() => {}} /></ScreenWrapper>;
  }

  const plans = plansData?.data || [];
  const currentPlan = currentSubData?.data?.plan || 'free';

  const freeFeatures = [
    { text: '3 courses', included: true },
    { text: '5 quizzes/day', included: true },
    { text: 'Basic summaries', included: true },
    { text: 'Advanced AI summaries', included: false },
    { text: 'Priority support', included: false },
    { text: 'Offline access', included: false },
  ];

  const proFeatures = [
    { text: 'Unlimited courses', included: true },
    { text: 'Unlimited quizzes', included: true },
    { text: 'Advanced AI summaries', included: true },
    { text: 'Priority support', included: true },
    { text: 'No ads', included: true },
    { text: 'Offline access', included: true },
  ];

  const handleSubscribe = () => {
    if (selectedPlanId) {
      subscribe({ planId: selectedPlanId, paymentMethodId: 'pm_placeholder' });
    }
  };

  return (
    <View className="flex-1 bg-surface">
      <View className="flex-row items-center p-4 pt-12 bg-white dark:bg-slate-900 shadow-sm">
        <TouchableOpacity onPress={() => navigation.goBack()} className="mr-4">
          <ArrowLeft size={24} className="text-slate-900 dark:text-slate-50" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-slate-900 dark:text-slate-50">Go Pro</Text>
      </View>

      <ScrollView className="flex-1 p-4">
        <View className="items-center mb-6">
          <View className={`px-4 py-1 rounded-full ${currentPlan === 'pro' ? 'bg-yellow-100' : 'bg-slate-200'}`}>
            <Text className={`font-bold ${currentPlan === 'pro' ? 'text-yellow-700' : 'text-slate-700'}`}>
              CURRENT PLAN: {currentPlan.toUpperCase()}
            </Text>
          </View>
        </View>

        <View className="flex-row mb-8">
          <View className="flex-1 mr-2 p-4 bg-white dark:bg-slate-800 rounded-3xl">
            <Text className="text-lg font-bold text-center mb-4 text-slate-900 dark:text-slate-50">Free</Text>
            {freeFeatures.map((f, i) => (
              <View key={i} className="flex-row items-center mb-3">
                {f.included ? <Check size={16} className="text-green-500 mr-2" /> : <X size={16} className="text-red-500 mr-2" />}
                <Text className="text-sm text-slate-700 dark:text-slate-300">{f.text}</Text>
              </View>
            ))}
          </View>
          <View className="flex-1 ml-2 p-4 bg-primary rounded-3xl">
            <Text className="text-lg font-bold text-center mb-4 text-white">Pro</Text>
            {proFeatures.map((f, i) => (
              <View key={i} className="flex-row items-center mb-3">
                <Check size={16} className="text-white mr-2" />
                <Text className="text-sm text-white">{f.text}</Text>
              </View>
            ))}
          </View>
        </View>

        <View className="mb-6">
          {plans.map((plan) => (
            <TouchableOpacity
              key={plan.id}
              onPress={() => setSelectedPlanId(plan.id)}
              className={`p-4 mb-4 rounded-2xl border-2 ${selectedPlanId === plan.id ? 'border-primary bg-primary-50 dark:bg-slate-800' : 'border-transparent bg-white dark:bg-slate-800'}`}
            >
              {plan.isPopular && (
                <View className="absolute -top-3 right-4 bg-yellow-500 px-2 py-1 rounded-full z-10">
                  <Text className="text-xs font-bold text-white">MOST POPULAR</Text>
                </View>
              )}
              <View className="flex-row justify-between items-center">
                <View>
                  <Text className="text-lg font-bold text-slate-900 dark:text-slate-50 capitalize">{plan.interval}</Text>
                </View>
                <View className="items-end">
                  <Text className="text-xl font-bold text-slate-900 dark:text-slate-50">
                    {plan.currency} {plan.price}
                  </Text>
                  <Text className="text-xs text-slate-500">/{plan.interval === 'monthly' ? 'mo' : 'yr'}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <Button 
          title="Subscribe Now" 
          onPress={handleSubscribe} 
          disabled={!selectedPlanId || isSubscribing || currentPlan === 'pro'} 
          className="mb-8"
        />
      </ScrollView>
    </View>
  );
}
