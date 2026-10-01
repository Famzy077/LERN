import { apiClient } from "@/shared/services/api.client";
import { ENDPOINTS } from "@/shared/constants/endpoints";
import { DashboardData } from "../types/home.types";
import { ApiResponse } from "@/shared/types/api.types";
import { useAuthStore } from "@/features/auth/store/auth.store";

export const dashboardService = {
  getDashboard: async (): Promise<ApiResponse<DashboardData>> => {
    // If we are logged in as a guest, return mock data instantly
    if (useAuthStore.getState().token === "mock_token_123") {
      return {
        data: {
          greeting: "Good evening",
          user: {
            name: "Guest Student",
            avatarUrl: null,
          },
          streak: {
            current: 3,
            weeklyData: [true, true, true, false, false, false, false],
          },
          xp: {
            total: 1250,
            level: 5,
            todayEarned: 150,
          },
          examReadiness: {
            overall: 78,
            subjects: {
              "Computer Science": 85,
              Mathematics: 62,
            },
            quizCount: 2,
          },
          recentCourses: [
            {
              id: "1",
              title: "Data Structures and Algorithms",
              subject: "Computer Science",
              progress: 45,
              lastAccessed: new Date().toISOString(),
              totalTopics: 12,
              completedTopics: 5,
            },
            {
              id: "2",
              title: "Linear Algebra",
              subject: "Mathematics",
              progress: 12,
              lastAccessed: new Date().toISOString(),
              totalTopics: 8,
              completedTopics: 1,
            },
          ],
          quickActions: [
            { id: "1", label: "Upload", icon: "upload", route: "Upload" },
            { id: "2", label: "Quiz", icon: "help-circle", route: "Quizzes" },
            { id: "3", label: "AI Summary", icon: "zap", route: "AI" },
            {
              id: "4",
              label: "Flashcards",
              icon: "layers",
              route: "Flashcards",
            },
          ],
        },
        message: "Success",
        success: true,
      };
    }

    // Otherwise, make the real API call
    return apiClient.get(ENDPOINTS.DASHBOARD);
  },
};
