import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notificationService } from '../services/notification.service';
import { Notification } from '../types/notification.types';
import { PaginatedResponse } from '@/shared/types/api.types';

export const useNotifications = () => {
  return useQuery({
    queryKey: ['notifications'],
    queryFn: () => notificationService.getAll(),
  });
};

export const useMarkAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => notificationService.markAsRead(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['notifications'] });
      const previous = queryClient.getQueryData<PaginatedResponse<Notification>>(['notifications']);
      
      if (previous) {
        queryClient.setQueryData<PaginatedResponse<Notification>>(['notifications'], {
          ...previous,
          data: previous.data.map((n) => n.id === id ? { ...n, isRead: true } : n)
        });
      }
      return { previous };
    },
    onError: (err, id, context) => {
      if (context?.previous) {
        queryClient.setQueryData(['notifications'], context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
};

export const useMarkAllAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => notificationService.markAllAsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
};
