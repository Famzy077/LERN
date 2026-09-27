import { apiClient } from '@/shared/services/api.client';
import { ENDPOINTS } from '@/shared/constants/endpoints';
import { Course, CreateCourseDTO } from '../types/course.types';
import { PaginatedResponse, ApiResponse } from '@/shared/types/api.types';

export const courseService = {
  getAll: (params?: any): Promise<PaginatedResponse<Course>> =>
    apiClient.get(ENDPOINTS.COURSES, { params }) as any,
  
  getById: (id: string): Promise<ApiResponse<Course>> =>
    apiClient.get(`${ENDPOINTS.COURSES}/${id}`),
    
  create: (data: CreateCourseDTO): Promise<ApiResponse<Course>> =>
    apiClient.post(ENDPOINTS.COURSES, data),
    
  delete: (id: string): Promise<ApiResponse<void>> =>
    apiClient.delete(`${ENDPOINTS.COURSES}/${id}`),
};
