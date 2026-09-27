import { apiClient } from '@/shared/services/api.client';
import { ENDPOINTS } from '@/shared/constants/endpoints';
import { DashboardData } from '../types/home.types';
import { ApiResponse } from '@/shared/types/api.types';

export const dashboardService = {
  getDashboard: (): Promise<ApiResponse<DashboardData>> =>
    apiClient.get(ENDPOINTS.DASHBOARD), // Assuming ENDPOINTS.DASHBOARD exists
};
