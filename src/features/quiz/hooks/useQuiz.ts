import { useQuery, useMutation } from "@tanstack/react-query";
import { quizService } from "../services/quiz.service";
import { QuizSubmission } from "../types/quiz.types";

export const useQuizData = (courseId?: string, quizId?: string) => {
  return useQuery({
    queryKey: ["quiz", courseId, quizId],
    queryFn: () => {
      if (quizId) return quizService.getQuizById(quizId);
      if (!courseId)
        throw new Error("A course or quiz is required to load a quiz.");
      return quizService.getQuiz(courseId);
    },
    enabled: !!courseId || !!quizId,
  });
};

export const useSubmitQuiz = () => {
  return useMutation({
    mutationFn: ({ quizId, data }: { quizId: string; data: QuizSubmission }) =>
      quizService.submitQuiz(quizId, data),
  });
};
