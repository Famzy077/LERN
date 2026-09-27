import { apiClient } from '@/shared/services/api.client';
import { ENDPOINTS } from '@/shared/constants/endpoints';
import { ApiResponse } from '@/shared/types/api.types';
import { ProgressData } from '../types/progress.types';

class ProgressService {
  async getProgress(): Promise<ApiResponse<ProgressData>> {
    const response = await apiClient.get<ApiResponse<ProgressData>>(ENDPOINTS.PROGRESS);
    return response as any;
  }
}

export const progressService = new ProgressService();
