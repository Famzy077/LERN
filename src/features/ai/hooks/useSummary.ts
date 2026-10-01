import { useQuery, useMutation } from "@tanstack/react-query";
import { aiService } from "../services/ai.service";
import { GenerateQuizFromSummary } from "../types/ai.types";

export const useSummary = (materialId: string) => {
  return useQuery({
    queryKey: ["summary", materialId],
    queryFn: () => aiService.getSummary(materialId),
    enabled: !!materialId,
  });
};

export const useRecentSummaries = (courseId?: string) => {
  return useQuery({
    queryKey: ["recentSummaries", courseId],
    queryFn: () => aiService.getRecentSummaries(courseId),
  });
};

export const useGenerateQuiz = () => {
  return useMutation({
    mutationFn: (data: GenerateQuizFromSummary) => aiService.generateQuiz(data),
  });
};
