import { apiClient } from '@/shared/services/api.client';
import { ENDPOINTS } from '@/shared/constants/endpoints';
import { ApiResponse } from '@/shared/types/api.types';
import { SubscriptionPlan, CurrentSubscription, SubscribeRequest } from '../types/subscription.types';

export const subscriptionService = {
  getPlans: async (): Promise<ApiResponse<SubscriptionPlan[]>> => {
    const response = await apiClient.get(`${ENDPOINTS.SUBSCRIPTION}/plans`);
    return response as any;
  },

  getCurrentSubscription: async (): Promise<ApiResponse<CurrentSubscription>> => {
    const response = await apiClient.get(ENDPOINTS.SUBSCRIPTION);
    return response as any;
  },

  subscribe: async (data: SubscribeRequest): Promise<ApiResponse<CurrentSubscription>> => {
    const response = await apiClient.post(ENDPOINTS.SUBSCRIPTION, data);
    return response as any;
  },
  
  cancelSubscription: async (): Promise<ApiResponse<void>> => {
    const response = await apiClient.delete(ENDPOINTS.SUBSCRIPTION);
    return response as any;
  }
};
