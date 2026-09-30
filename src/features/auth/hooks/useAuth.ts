import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authService } from '../services/auth.service';
import { GoogleAuthRequest, AcademicSetupRequest } from '../types/auth.types';
import { useAuthStore } from '../store/auth.store';

export const useGoogleLogin = () => {
  const setAuth = useAuthStore((state) => state.setAuth); // Assuming setAuth exists
  return useMutation({
    mutationFn: (data: GoogleAuthRequest) => authService.loginWithGoogle(data),
    onSuccess: (response) => {
      if (response.success && response.data) {
        setAuth(
          response.data.user,
          response.data.accessToken,
          response.data.refreshToken,
        );
      }
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();
  const clearAuth = useAuthStore((state) => state.logout);
  return useMutation({
    mutationFn: () => authService.logout(),
    onSettled: () => {
      clearAuth();
      queryClient.clear();
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
  const queryClient = useQueryClient();
  const updateAcademicInfo = useAuthStore((state) => state.updateAcademicInfo);

  return useMutation({
    mutationFn: (data: AcademicSetupRequest) => authService.setupAcademic(data),
    onSuccess: (response) => {
      if (response.data) {
        updateAcademicInfo({
          university: response.data.university,
          program: response.data.program,
          yearOfStudy: response.data.yearOfStudy,
          academicSetupCompleted: response.data.academicSetupCompleted,
        });
      }
      void queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });
};
