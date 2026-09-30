import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { settingsService } from '../services/settings.service';
import { UpdateSettingsDTO } from '../types/settings.types';
import { useAuthStore } from '@/features/auth/store/auth.store';

export const useUserSettings = () => {
  return useQuery({
    queryKey: ['settings'],
    queryFn: () => settingsService.getSettings(),
  });
};

export const useUpdateSettings = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateSettingsDTO) =>
      settingsService.updateSettings(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] });
    },
  });
};

export const useDeleteAccount = () => {
  const queryClient = useQueryClient();
  const clearAuth = useAuthStore((state) => state.logout);

  return useMutation({
    mutationFn: () => settingsService.deleteAccount(),
    onSuccess: () => {
      clearAuth();
      queryClient.clear();
    },
  });
};
