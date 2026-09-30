import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { aiService } from '../services/ai.service';
import { UploadMaterialRequest } from '../types/ai.types';

export const useUploadMaterial = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ data, onProgress }: { data: UploadMaterialRequest; onProgress?: (pct: number) => void }) =>
      aiService.uploadMaterial(data, onProgress),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['materials'] });
    },
  });
};

export const useProcessMaterial = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (materialId: string) => aiService.processMaterial(materialId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['materials'] });
      queryClient.invalidateQueries({ queryKey: ['recentSummaries'] });
    },
  });
};

export const useMaterials = (courseId?: string) => {
  return useQuery({
    queryKey: ['materials', courseId],
    queryFn: () => aiService.getMaterials(courseId),
  });
};
