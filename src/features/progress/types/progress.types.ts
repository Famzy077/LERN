export interface ProgressData {
  weeklyStudyHours: { day: string; hours: number }[];
  subjectPerformance: { subject: string; score: number; color: string }[];
  quizAccuracy: number;
  totalQuizzesTaken: number;
  studyStreak: {
    current: number;
    longest: number;
    thisMonth: number[];
  };
  xpProgression: {
    current: number;
    level: number;
    nextLevelXp: number;
    history: { date: string; xp: number }[];
  };
  totalStudyTime: number;
  coursesCompleted: number;
  coursesInProgress: number;
}
