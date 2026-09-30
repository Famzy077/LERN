import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { profileService } from "../services/profile.service";
import type { ProfilePictureFile } from "../services/profile.service";
import { UpdateProfileDTO } from "../types/profile.types";
import { useAuthStore } from "@/features/auth/store/auth.store";

export const useProfile = (enabled = true) => {
  return useQuery({
    queryKey: ["profile"],
    queryFn: () => profileService.getProfile(),
    enabled,
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateProfileDTO) => profileService.updateProfile(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      const user = useAuthStore.getState().user;
      if (user && response.data) {
        useAuthStore.getState().setUser({
          ...user,
          name: response.data.name,
          username: response.data.username,
          avatarUrl: response.data.avatarUrl,
        });
      }
    },
  });
};

export const useUploadAvatar = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: ProfilePictureFile) => profileService.uploadAvatar(file),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      const user = useAuthStore.getState().user;
      if (user && response.data) {
        useAuthStore.getState().setUser({
          ...user,
          name: response.data.name,
          username: response.data.username,
          avatarUrl: response.data.avatarUrl,
        });
      }
    },
  });
};
