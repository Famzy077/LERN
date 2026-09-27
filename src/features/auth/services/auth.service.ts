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
  loginWithGoogle: async (data: GoogleAuthRequest): Promise<ApiResponse<AuthResponse>> => {
    // For development UI testing, since there is no backend yet, we simulate a successful API response
    // If you want to hit the real endpoint, uncomment the apiClient call below:
    // return apiClient.post(ENDPOINTS.AUTH.GOOGLE, data);
    
    return new Promise((resolve) => setTimeout(() => resolve({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: '123',
          email: 'test@example.com',
          name: 'Famzy',
          avatarUrl: null,
          university: null,
          program: null,
          yearOfStudy: null,
          onboardingCompleted: true,
          academicSetupCompleted: false,
        },
        accessToken: 'mock_access_token',
        refreshToken: 'mock_refresh_token',
      }
    }), 1000));
  },

  refreshToken: (refreshToken: string): Promise<ApiResponse<{ accessToken: string; refreshToken: string }>> =>
    apiClient.post(ENDPOINTS.AUTH.REFRESH, { refreshToken }),

  logout: (): Promise<ApiResponse<void>> => apiClient.post('/auth/logout'),

  getMe: (): Promise<ApiResponse<AuthResponse['user']>> =>
    apiClient.get('/auth/me'),

  getInstitutions: async (search?: string): Promise<ApiResponse<Institution[]>> => {
    // Mock for UI testing
    return new Promise(resolve => setTimeout(() => resolve({
      success: true,
      message: 'Success',
      data: [
        { id: 'inst1', name: 'Harvard University', country: 'USA' },
        { id: 'inst2', name: 'MIT', country: 'USA' },
        { id: 'inst3', name: 'Oxford University', country: 'UK' }
      ]
    }), 500));
  },

  getPrograms: async (institutionId: string): Promise<ApiResponse<Program[]>> => {
    // Mock for UI testing
    return new Promise(resolve => setTimeout(() => resolve({
      success: true,
      message: 'Success',
      data: [
        { id: 'prog1', name: 'Computer Science', duration: 4 },
        { id: 'prog2', name: 'Medicine', duration: 5 }
      ]
    }), 500));
  },

  setupAcademic: async (data: AcademicSetupRequest): Promise<ApiResponse<AuthResponse['user']>> => {
    // Mock for UI testing
    return new Promise((resolve) => setTimeout(() => resolve({
      success: true,
      message: 'Setup complete',
      data: {
        id: '123',
        email: 'test@example.com',
        name: 'Famzy',
        avatarUrl: null,
        university: data.institutionId,
        program: data.programId,
        yearOfStudy: data.yearOfStudy,
        onboardingCompleted: true,
        academicSetupCompleted: true,
      }
    }), 1000));
  },
};
