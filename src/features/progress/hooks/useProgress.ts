import { useQuery } from '@tanstack/react-query';
import { progressService } from '../services/progress.service';

export const useProgress = () => {
  return useQuery({
    queryKey: ['progress'],
    queryFn: () => progressService.getProgress(),
  });
};
