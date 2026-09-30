import { apiClient } from '@/shared/services/api.client';
import { ENDPOINTS } from '@/shared/constants/endpoints';
import { ApiResponse } from '@/shared/types/api.types';
import { Profile, UpdateProfileDTO } from '../types/profile.types';

export const profileService = {
  getProfile: async (): Promise<ApiResponse<Profile>> => {
    const response = await apiClient.get(ENDPOINTS.PROFILE);
    return response as any;
  },

  updateProfile: async (data: UpdateProfileDTO): Promise<ApiResponse<Profile>> => {
    const response = await apiClient.patch(ENDPOINTS.PROFILE, data);
    return response as any;
  },
};
