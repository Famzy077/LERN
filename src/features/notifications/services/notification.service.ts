import { apiClient } from '@/shared/services/api.client';
import { ENDPOINTS } from '@/shared/constants/endpoints';
import { PaginatedResponse, ApiResponse } from '@/shared/types/api.types';
import { Notification } from '../types/notification.types';

export const notificationService = {
  getAll: async (): Promise<PaginatedResponse<Notification>> => {
    const response = await apiClient.get(ENDPOINTS.NOTIFICATIONS);
    return response as any;
  },

  markAsRead: async (id: string): Promise<ApiResponse<Notification>> => {
    const response = await apiClient.patch(`${ENDPOINTS.NOTIFICATIONS}/${id}`, { isRead: true });
    return response as any;
  },

  markAllAsRead: async (): Promise<ApiResponse<void>> => {
    const response = await apiClient.patch(`${ENDPOINTS.NOTIFICATIONS}/read-all`);
    return response as any;
  }
};
