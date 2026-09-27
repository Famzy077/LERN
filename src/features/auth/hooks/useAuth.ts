import { useMutation, useQuery } from '@tanstack/react-query';
import { authService } from '../services/auth.service';
import { GoogleAuthRequest, AcademicSetupRequest } from '../types/auth.types';
import { useAuthStore } from '../store/auth.store';

export const useGoogleLogin = () => {
  const setAuth = useAuthStore((state) => state.setAuth); // Assuming setAuth exists
  return useMutation({
    mutationFn: (data: GoogleAuthRequest) => authService.loginWithGoogle(data),
    onSuccess: (response) => {
      if (response.success && response.data) {
        setAuth(response.data.user, response.data.accessToken, response.data.refreshToken);
      }
    },
  });
};

export const useLogout = () => {
  const clearAuth = useAuthStore((state) => state.logout); // Assuming clearAuth exists
  return useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      clearAuth();
    },
  });
};

export const useInstitutions = (search?: string) => {
  return useQuery({
    queryKey: ['institutions', search],
    queryFn: () => authService.getInstitutions(search),
  });
};

export const usePrograms = (institutionId: string) => {
  return useQuery({
    queryKey: ['programs', institutionId],
    queryFn: () => authService.getPrograms(institutionId),
    enabled: !!institutionId,
  });
};

export const useAcademicSetup = () => {
  return useMutation({
    mutationFn: (data: AcademicSetupRequest) => authService.setupAcademic(data),
  });
};
