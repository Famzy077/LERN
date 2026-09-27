import { create } from 'zustand';

interface QuizState {
  currentQuestionIndex: number;
  selectedAnswers: Record<string, string>;
  isRevealed: boolean;
  timerSeconds: number;
  isTimerRunning: boolean;
  
  selectAnswer: (questionId: string, label: string) => void;
  revealAnswer: () => void;
  nextQuestion: () => void;
  resetQuiz: () => void;
  setTimer: (seconds: number) => void;
  decrementTimer: () => void;
  stopTimer: () => void;
}

export const useQuizStore = create<QuizState>((set) => ({
  currentQuestionIndex: 0,
  selectedAnswers: {},
  isRevealed: false,
  timerSeconds: 0,
  isTimerRunning: false,

  selectAnswer: (questionId, label) => set((state) => ({
    selectedAnswers: { ...state.selectedAnswers, [questionId]: label }
  })),
  revealAnswer: () => set({ isRevealed: true }),
  nextQuestion: () => set((state) => ({
    currentQuestionIndex: state.currentQuestionIndex + 1,
    isRevealed: false,
  })),
  resetQuiz: () => set({
    currentQuestionIndex: 0,
    selectedAnswers: {},
    isRevealed: false,
    timerSeconds: 0,
    isTimerRunning: false,
  }),
  setTimer: (seconds) => set({ timerSeconds: seconds, isTimerRunning: true }),
  decrementTimer: () => set((state) => ({
    timerSeconds: Math.max(0, state.timerSeconds - 1)
  })),
  stopTimer: () => set({ isTimerRunning: false }),
}));
