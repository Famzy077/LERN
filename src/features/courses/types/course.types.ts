export interface Course {
  id: string;
  title: string;
  subject: string;
  description: string;
  progress: number;
  totalTopics: number;
  completedTopics: number;
  lastAccessed: string;
  createdAt: string;
  materials: number;
  quizzes: number;
}

export interface CreateCourseDTO {
  title: string;
  subject: string;
  description?: string;
}
