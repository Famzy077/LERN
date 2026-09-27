import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { profileService } from '../services/profile.service';
import { UpdateProfileDTO } from '../types/profile.types';

export const useProfile = () => {
  return useQuery({
    queryKey: ['profile'],
    queryFn: () => profileService.getProfile(),
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: UpdateProfileDTO) => profileService.updateProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });
};
