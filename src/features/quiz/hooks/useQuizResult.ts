import { useQuery } from '@tanstack/react-query';
import { quizService } from '../services/quiz.service';

export const useQuizResult = (quizId: string) => {
  return useQuery({
    queryKey: ['quizResult', quizId],
    queryFn: () => quizService.getResult(quizId),
    enabled: !!quizId,
  });
};
