import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { subscriptionService } from '../services/subscription.service';
import { SubscribeRequest } from '../types/subscription.types';

export const useSubscriptionPlans = () => {
  return useQuery({
    queryKey: ['subscription-plans'],
    queryFn: () => subscriptionService.getPlans(),
  });
};

export const useCurrentSubscription = () => {
  return useQuery({
    queryKey: ['current-subscription'],
    queryFn: () => subscriptionService.getCurrentSubscription(),
  });
};

export const useSubscribe = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: SubscribeRequest) => subscriptionService.subscribe(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['current-subscription'] });
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });
};

export const useCancelSubscription = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: () => subscriptionService.cancelSubscription(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['current-subscription'] });
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });
};
