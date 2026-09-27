export interface Profile {
  id: string;
  name: string;
  email: string;
  avatarUrl: string | null;
  university: string;
  program: string;
  yearOfStudy: number;
  joinedAt: string;
  stats: {
    totalCourses: number;
    totalQuizzes: number;
    currentStreak: number;
    totalXp: number;
    level: number;
    studyHours: number;
  };
  subscription: {
    plan: 'free' | 'pro';
    expiresAt: string | null;
  };
}

export interface UpdateProfileDTO {
  name?: string;
  university?: string;
  program?: string;
  yearOfStudy?: number;
}
