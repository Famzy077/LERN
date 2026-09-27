export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'quiz' | 'streak' | 'achievement' | 'course' | 'system';
  isRead: boolean;
  createdAt: string;
  data?: Record<string, string>;
}
