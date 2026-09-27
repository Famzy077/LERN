import { apiClient } from '@/shared/services/api.client';
import { ENDPOINTS } from '@/shared/constants/endpoints';
import { ApiResponse } from '@/shared/types/api.types';
import { Quiz, QuizSubmission, QuizResult } from '../types/quiz.types';

class QuizService {
  async getQuiz(courseId: string): Promise<ApiResponse<Quiz>> {
    const response = await apiClient.get<ApiResponse<Quiz>>(ENDPOINTS.QUIZ, {
      params: { courseId },
    });
    return response as any;
  }

  async getQuizById(quizId: string): Promise<ApiResponse<Quiz>> {
    const response = await apiClient.get<ApiResponse<Quiz>>(`${ENDPOINTS.QUIZ}/${quizId}`);
    return response as any;
  }

  async submitQuiz(quizId: string, data: QuizSubmission): Promise<ApiResponse<QuizResult>> {
    const response = await apiClient.post<ApiResponse<QuizResult>>(`${ENDPOINTS.QUIZ}/${quizId}/submit`, data);
    return response as any;
  }

  async getResult(quizId: string): Promise<ApiResponse<QuizResult>> {
    const response = await apiClient.get<ApiResponse<QuizResult>>(`${ENDPOINTS.QUIZ}/${quizId}/result`);
    return response as any;
  }
}

export const quizService = new QuizService();
