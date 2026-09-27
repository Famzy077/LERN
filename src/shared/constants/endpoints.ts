const API_VERSION = '/api/v1';

export const ENDPOINTS = {
  AUTH: {
    GOOGLE: `${API_VERSION}/auth/google`,
    REFRESH: `${API_VERSION}/auth/refresh`,
    LOGOUT: `${API_VERSION}/auth/logout`,
    ME: `${API_VERSION}/auth/me`,
  },
  DASHBOARD: `${API_VERSION}/dashboard`,
  COURSES: `${API_VERSION}/courses`,
  UPLOAD: `${API_VERSION}/materials/upload`,
  MATERIALS: `${API_VERSION}/materials`,
  SUMMARIES: `${API_VERSION}/summaries`,
  QUIZ: `${API_VERSION}/quizzes`,
  PROGRESS: `${API_VERSION}/progress`,
  PROFILE: `${API_VERSION}/profile`,
  NOTIFICATIONS: `${API_VERSION}/notifications`,
  SUBSCRIPTION: `${API_VERSION}/subscriptions`,
  SETTINGS: `${API_VERSION}/settings`,
  ACADEMIC: {
    INSTITUTIONS: `${API_VERSION}/academic/institutions`,
    PROGRAMS: `${API_VERSION}/academic/programs`,
    SETUP: `${API_VERSION}/academic/setup`,
  },
} as const;
