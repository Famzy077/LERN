import { apiClient } from '@/shared/services/api.client';
import { ENDPOINTS } from '@/shared/constants/endpoints';
import { ApiResponse, PaginatedResponse } from '@/shared/types/api.types';
import { UploadMaterialRequest, Material, AISummary, GenerateQuizFromSummary } from '../types/ai.types';

class AIService {
  async uploadMaterial(data: UploadMaterialRequest, onProgress?: (pct: number) => void): Promise<ApiResponse<Material>> {
    const formData = new FormData();
    if (data.courseId) {
      formData.append('courseId', data.courseId);
    }
    formData.append('file', {
      uri: data.file.uri,
      name: data.file.name,
      type: data.file.type,
    } as any);

    const response = await apiClient.post<ApiResponse<Material>>(ENDPOINTS.UPLOAD, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const pct = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(pct);
        }
      },
    });
    return response as any;
  }

  async getMaterials(courseId?: string): Promise<ApiResponse<Material[]>> {
    const response = await apiClient.get<ApiResponse<Material[]>>(ENDPOINTS.UPLOAD, {
      params: { courseId },
    });
    return response as any;
  }

  async getSummary(materialId: string): Promise<ApiResponse<AISummary>> {
    const response = await apiClient.get<ApiResponse<AISummary>>(`${ENDPOINTS.SUMMARIES}/${materialId}`);
    return response as any;
  }

  async getRecentSummaries(): Promise<ApiResponse<AISummary[]>> {
    const response = await apiClient.get<ApiResponse<AISummary[]>>(ENDPOINTS.SUMMARIES, {
      params: { limit: 10 },
    });
    return response as any;
  }

  async generateQuiz(data: GenerateQuizFromSummary): Promise<ApiResponse<any>> {
    const response = await apiClient.post<ApiResponse<any>>(`${ENDPOINTS.QUIZ}/generate`, data);
    return response as any;
  }
}

export const aiService = new AIService();
