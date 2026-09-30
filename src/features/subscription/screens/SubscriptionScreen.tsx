import React from 'react';
import { Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {
  ArrowLeft,
  Check,
  ChevronRight,
  Crown,
  Info,
  Sparkles,
} from 'lucide-react-native';
import {
  useCancelSubscription,
  useCurrentSubscription,
  useSubscriptionPlans,
} from '../hooks/useSubscription';
import { ScreenWrapper } from '@/shared/components/layout/ScreenWrapper';
import { LoadingSkeleton } from '@/shared/components/ui/LoadingSkeleton';
import { ErrorState } from '@/shared/components/feedback/ErrorState';
import { Button } from '@/shared/components/ui/Button';
import type { SubscriptionPlan } from '../types/subscription.types';

export default function SubscriptionScreen() {
  const navigation = useNavigation<any>();
  const plansQuery = useSubscriptionPlans();
  const subscriptionQuery = useCurrentSubscription();
  const cancelMutation = useCancelSubscription();

  if (plansQuery.isLoading || subscriptionQuery.isLoading) {
    return (
      <ScreenWrapper>
        <LoadingSkeleton className="h-12 m-4" />
        <LoadingSkeleton className="h-44 m-4 rounded-3xl" />
        <LoadingSkeleton className="h-52 m-4 rounded-3xl" />
      </ScreenWrapper>
    );
  }

  if (plansQuery.isError || subscriptionQuery.isError) {
    return (
      <ScreenWrapper>
        <ErrorState
          message="We couldn’t load your subscription details."
          onRetry={() => {
            void plansQuery.refetch();
            void subscriptionQuery.refetch();
          }}
        />
      </ScreenWrapper>
    );
  }

  const plans = plansQuery.data?.data ?? [];
  const subscription = subscriptionQuery.data?.data;
  const isPro = subscription?.plan === 'pro' && subscription.isActive;

  const handleCancel = () => {
    Alert.alert(
      'Cancel your subscription?',
      'Your plan will change to Free. You can upgrade again when paid checkout is available.',
      [
        { text: 'Keep plan', style: 'cancel' },
        {
          text: 'Cancel subscription',
          style: 'destructive',
          onPress: () =>
            cancelMutation.mutate(undefined, {
              onSuccess: () =>
                Alert.alert('Subscription cancelled', 'Your plan is now Free.'),
              onError: () =>
                Alert.alert(
                  'Could not cancel subscription',
                  'Please try again in a moment.',
                ),
            }),
        },
      ],
    );
  };

  return (
    <ScreenWrapper padded={false}>
      <View className="flex-1 bg-surface dark:bg-slate-900">
        <View className="flex-row items-center px-5 pb-4 pt-3">
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel="Go back"
            onPress={() => navigation.goBack()}
            className="mr-3 h-10 w-10 items-center justify-center rounded-full bg-white dark:bg-slate-800"
          >
            <ArrowLeft size={21} color="#334155" />
          </TouchableOpacity>
          <View>
            <Text className="text-2xl font-bold text-slate-900 dark:text-slate-50">
              Your plan
            </Text>
            <Text className="text-sm text-slate-500 dark:text-slate-400">
              Choose what works for you
            </Text>
          </View>
        </View>

        <ScrollView
          className="flex-1 px-5"
          contentContainerStyle={{ paddingBottom: 32 }}
        >
          <View className="overflow-hidden rounded-3xl bg-primary p-5">
            <View className="flex-row items-center">
              <View className="h-12 w-12 items-center justify-center rounded-2xl bg-white/20">
                <Crown size={25} color="#FFFFFF" />
              </View>
              <View className="ml-3 flex-1">
                <Text className="text-xs font-bold uppercase tracking-widest text-white/75">
                  CURRENT PLAN
                </Text>
                <Text className="mt-1 text-2xl font-bold capitalize text-white">
                  {subscription?.plan || 'Free'}
                </Text>
              </View>
              <View className="rounded-full bg-white/20 px-3 py-1">
                <Text className="text-xs font-semibold text-white">
                  {subscription?.isActive ? 'Active' : 'Inactive'}
                </Text>
              </View>
            </View>
            {subscription?.expiresAt ? (
              <Text className="mt-4 text-sm text-white/85">
                {isPro ? 'Renews' : 'Ended'}{' '}
                {new Date(subscription.expiresAt).toLocaleDateString()}
              </Text>
            ) : (
              <Text className="mt-4 text-sm text-white/85">
                {isPro
                  ? 'Your Pro plan is active.'
                  : 'Start with the essentials and build a study habit.'}
              </Text>
            )}
          </View>

          <View className="mt-5 rounded-3xl bg-white p-5 dark:bg-slate-800">
            <View className="mb-4 flex-row items-center">
              <Sparkles size={20} color="#2563EB" />
              <Text className="ml-2 text-lg font-bold text-slate-900 dark:text-slate-50">
                Available plans
              </Text>
            </View>
            {plans.length ? (
              plans.map((plan, index) => (
                <PlanCard
                  key={plan.id}
                  plan={plan}
                  last={index === plans.length - 1}
                />
              ))
            ) : (
              <Text className="py-3 text-sm text-slate-500 dark:text-slate-400">
                Plans are temporarily unavailable. Please try again later.
              </Text>
            )}
          </View>

          <View className="mt-4 flex-row rounded-2xl bg-blue-50 p-4 dark:bg-slate-800">
            <Info size={19} color="#2563EB" />
            <Text className="ml-3 flex-1 text-sm leading-5 text-slate-700 dark:text-slate-300">
              In-app checkout is not available yet. No payment will be taken or
              plan activated from this screen. Contact support if you need help
              with your plan.
            </Text>
          </View>

          {isPro ? (
            <Button
              title={
                cancelMutation.isPending
                  ? 'Cancelling...'
                  : 'Cancel subscription'
              }
              onPress={handleCancel}
              loading={cancelMutation.isPending}
              variant="outline"
              className="mt-5"
            />
          ) : null}

          <TouchableOpacity
            accessibilityRole="button"
            onPress={() => navigation.navigate('HelpSupport')}
            className="mt-5 flex-row items-center rounded-2xl bg-white px-4 py-4 dark:bg-slate-800"
          >
            <Text className="flex-1 font-semibold text-slate-800 dark:text-slate-100">
              Questions about plans?
            </Text>
            <ChevronRight size={19} color="#94A3B8" />
          </TouchableOpacity>
        </ScrollView>
      </View>
    </ScreenWrapper>
  );
}

function PlanCard({ plan, last }: { plan: SubscriptionPlan; last: boolean }) {
  const features = plan.features?.length
    ? plan.features
    : ['Access to core study tools'];
  const interval =
    plan.interval === 'weekly'
      ? 'week'
      : plan.interval === 'yearly'
        ? 'year'
        : 'month';
  const price = new Intl.NumberFormat(undefined, {
    maximumFractionDigits: 2,
    minimumFractionDigits: 0,
  }).format(plan.price);

  return (
    <View
      className={`${last ? '' : 'mb-4 border-b border-slate-100 pb-4 dark:border-slate-700'}`}
    >
      <View className="flex-row items-start justify-between">
        <View className="flex-1 pr-3">
          <View className="flex-row items-center">
            <Text className="text-base font-bold text-slate-900 dark:text-slate-50">
              {plan.name}
            </Text>
            {plan.isPopular ? (
              <View className="ml-2 rounded-full bg-amber-100 px-2 py-0.5">
                <Text className="text-[10px] font-bold uppercase text-amber-800">
                  Popular
                </Text>
              </View>
            ) : null}
          </View>
          <Text className="mt-1 text-xs capitalize text-slate-500 dark:text-slate-400">
            Billed {plan.interval}
          </Text>
        </View>
        <View className="items-end">
          <Text className="text-xl font-bold text-slate-900 dark:text-slate-50">
            {plan.currency}
            {price}
          </Text>
          <Text className="text-xs text-slate-500 dark:text-slate-400">
            per {interval}
          </Text>
        </View>
      </View>
      <View className="mt-3">
        {features.map((feature) => (
          <View key={feature} className="mb-2 flex-row items-center">
            <Check size={15} color="#16A34A" />
            <Text className="ml-2 flex-1 text-sm text-slate-600 dark:text-slate-300">
              {feature}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}
