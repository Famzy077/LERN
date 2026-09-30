import { apiClient } from '@/shared/services/api.client';
import { ENDPOINTS } from '@/shared/constants/endpoints';
import { ApiResponse } from '@/shared/types/api.types';
import { UserSettings, UpdateSettingsDTO } from '../types/settings.types';

export const settingsService = {
  getSettings: async (): Promise<ApiResponse<UserSettings>> => {
    const response = await apiClient.get(ENDPOINTS.SETTINGS);
    return response as any;
  },

  updateSettings: async (data: UpdateSettingsDTO): Promise<ApiResponse<UserSettings>> => {
    const response = await apiClient.patch(ENDPOINTS.SETTINGS, data);
    return response as any;
  },

  deleteAccount: async (): Promise<ApiResponse<void>> => {
    const response = await apiClient.delete(`${ENDPOINTS.SETTINGS}/account`);
    return response as any;
  }
};
