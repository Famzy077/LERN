import { apiClient } from '@/shared/services/api.client';
import { ENDPOINTS } from '@/shared/constants/endpoints';
import {
  GoogleAuthRequest,
  AuthResponse,
  AcademicSetupRequest,
  Institution,
  Program,
} from '../types/auth.types';
import { ApiResponse } from '@/shared/types/api.types';

export const authService = {
  loginWithGoogle: (
    data: GoogleAuthRequest,
  ): Promise<ApiResponse<AuthResponse>> =>
    apiClient.post(ENDPOINTS.AUTH.GOOGLE, data),

  refreshToken: (
    refreshToken: string,
  ): Promise<ApiResponse<{ accessToken: string; refreshToken: string }>> =>
    apiClient.post(ENDPOINTS.AUTH.REFRESH, { refreshToken }),

  logout: (): Promise<ApiResponse<void>> =>
    apiClient.post(ENDPOINTS.AUTH.LOGOUT),

  getMe: (): Promise<ApiResponse<AuthResponse['user']>> =>
    apiClient.get(ENDPOINTS.AUTH.ME),

  getInstitutions: (search?: string): Promise<ApiResponse<Institution[]>> =>
    apiClient.get(ENDPOINTS.ACADEMIC.INSTITUTIONS, { params: { search } }),

  getPrograms: (institutionId: string): Promise<ApiResponse<Program[]>> =>
    apiClient.get(ENDPOINTS.ACADEMIC.PROGRAMS, { params: { institutionId } }),

  setupAcademic: (
    data: AcademicSetupRequest,
  ): Promise<ApiResponse<AuthResponse['user']>> =>
    apiClient.post(ENDPOINTS.ACADEMIC.SETUP, data),
};
