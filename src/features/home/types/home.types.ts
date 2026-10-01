export interface DashboardData {
  greeting: string;
  user: {
    name: string;
    avatarUrl: string | null;
  };
  streak: {
    current: number;
    weeklyData: boolean[];
  };
  xp: {
    total: number;
    level: number;
    todayEarned: number;
  };
  examReadiness: {
    overall: number;
    subjects: Record<string, number>;
    quizCount: number;
  };
  recentCourses: {
    id: string;
    title: string;
    subject: string;
    progress: number;
    lastAccessed: string;
    totalTopics: number;
    completedTopics: number;
  }[];
  quickActions: {
    id: string;
    label: string;
    icon: string;
    route: string;
  }[];
}
