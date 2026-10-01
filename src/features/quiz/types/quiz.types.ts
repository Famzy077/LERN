export interface QuizQuestion {
  id: string;
  text: string;
  options: {
    label: string; // A, B, C, D
    text: string;
  }[];
  correctAnswer: string; // label
  explanation: string;
}

export interface Quiz {
  id: string;
  courseId: string;
  title: string;
  questions: QuizQuestion[];
  timeLimit: number; // seconds
  totalQuestions: number;
}

export interface QuizSubmission {
  quizId: string;
  idempotencyKey: string;
  answers: { questionId: string; selectedAnswer: string }[];
  timeTaken: number;
}

export interface QuizResult {
  id: string;
  quizId: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  wrongAnswers: number;
  timeTaken: number;
  xpEarned: number;
  grade: string;
  questions: {
    id: string;
    text: string;
    selectedAnswer: string;
    correctAnswer: string;
    isCorrect: boolean;
    explanation: string;
  }[];
}
