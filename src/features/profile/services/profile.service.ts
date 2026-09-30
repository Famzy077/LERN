import { apiClient } from "@/shared/services/api.client";
import { ENDPOINTS } from "@/shared/constants/endpoints";
import { ApiResponse } from "@/shared/types/api.types";
import { Profile, UpdateProfileDTO } from "../types/profile.types";

export interface ProfilePictureFile {
  uri: string;
  name: string;
  type: string;
}

export const profileService = {
  getProfile: async (): Promise<ApiResponse<Profile>> => {
    const response = await apiClient.get(ENDPOINTS.PROFILE);
    return response as any;
  },

  updateProfile: async (
    data: UpdateProfileDTO,
  ): Promise<ApiResponse<Profile>> => {
    const response = await apiClient.patch(ENDPOINTS.PROFILE, data);
    return response as any;
  },

  uploadAvatar: async (
    file: ProfilePictureFile,
  ): Promise<ApiResponse<Profile>> => {
    const formData = new FormData();
    formData.append("file", {
      uri: file.uri,
      name: file.name,
      type: file.type,
    } as any);
    return apiClient.upload<Profile>(`${ENDPOINTS.PROFILE}/avatar`, formData);
  },
};
