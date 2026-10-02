import React, { useEffect, useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Linking,
  Modal,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Camera, ImagePlus, X } from "lucide-react-native";
import { Button } from "@/shared/components/ui/Button";
import { AppAlert as Alert } from "@/shared/components/feedback/AppAlert";
import { Input } from "@/shared/components/ui/Input";
import { useUpdateProfile, useUploadAvatar } from "../hooks/useProfile";
import type { Profile } from "../types/profile.types";
import type { ProfilePictureFile } from "../services/profile.service";

interface EditProfileModalProps {
  visible: boolean;
  profile: Profile;
  onClose: () => void;
}

const MAX_AVATAR_BYTES = 5 * 1024 * 1024;
const USERNAME_PATTERN = /^[a-zA-Z0-9_]{3,20}$/;

export default function EditProfileModal({
  visible,
  profile,
  onClose,
}: EditProfileModalProps) {
  const [name, setName] = useState(profile.name);
  const [username, setUsername] = useState(profile.username ?? "");
  const [picture, setPicture] = useState<ProfilePictureFile | null>(null);
  const updateProfile = useUpdateProfile();
  const uploadAvatar = useUploadAvatar();
  const isSaving = updateProfile.isPending || uploadAvatar.isPending;

  useEffect(() => {
    if (visible) {
      setName(profile.name);
      setUsername(profile.username ?? "");
      setPicture(null);
    }
  }, [visible, profile.name, profile.username]);

  const choosePicture = async () => {
    try {
      const permission =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        Alert.alert(
          "Photo access needed",
          "Allow SlotStudy to access your photos so you can choose a profile picture.",
          [
            { text: "Not now", style: "cancel" },
            { text: "Open Settings", onPress: () => Linking.openSettings() },
          ],
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.85,
        preferredAssetRepresentationMode:
          ImagePicker.UIImagePickerPreferredAssetRepresentationMode.Compatible,
      });
      if (result.canceled) return;

      const asset = result.assets[0];
      const mimeType = asset.mimeType;
      if (asset.fileSize && asset.fileSize > MAX_AVATAR_BYTES) {
        Alert.alert("Image is too large", "Choose an image smaller than 5 MB.");
        return;
      }
      if (
        !mimeType ||
        !["image/jpeg", "image/png", "image/webp"].includes(mimeType)
      ) {
        Alert.alert("Unsupported image", "Choose a JPG, PNG, or WebP image.");
        return;
      }
      setPicture({
        uri: asset.uri,
        name: asset.fileName || `profile-picture.${mimeType.split("/")[1]}`,
        type: mimeType || "image/jpeg",
      });
    } catch {
      Alert.alert(
        "Could not open photos",
        "Please try selecting your picture again.",
      );
    }
  };

  const saveProfile = async () => {
    const trimmedName = name.trim();
    const trimmedUsername = username.trim().toLowerCase();
    if (!trimmedName) {
      Alert.alert("Name required", "Enter your full name before saving.");
      return;
    }
    if (trimmedName.length > 100) {
      Alert.alert(
        "Name is too long",
        "Your name must be 100 characters or fewer.",
      );
      return;
    }
    if (trimmedUsername && !USERNAME_PATTERN.test(trimmedUsername)) {
      Alert.alert(
        "Check your username",
        "Use 3–20 letters, numbers, or underscores.",
      );
      return;
    }

    const detailsChanged =
      trimmedName !== profile.name ||
      trimmedUsername !== (profile.username ?? "").toLowerCase();

    try {
      if (picture) await uploadAvatar.mutateAsync(picture);
      if (detailsChanged) {
        await updateProfile.mutateAsync({
          name: trimmedName,
          ...(trimmedUsername
            ? { username: trimmedUsername }
            : profile.username
              ? { username: null }
              : {}),
        });
      }
      onClose();
    } catch (error) {
      Alert.alert(
        "Could not save profile",
        error instanceof Error
          ? error.message
          : "Please check your connection and try again.",
      );
    }
  };

  const previewUri = picture?.uri ?? profile.avatarUrl;
  const initials =
    name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase() || "U";

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        className="flex-1 bg-surface dark:bg-slate-900"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View className="flex-row items-center justify-between border-b border-slate-100 px-5 py-4 dark:border-slate-800">
          <View>
            <Text className="text-xl font-bold text-slate-900 dark:text-slate-50">
              Edit profile
            </Text>
            <Text className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Update how you appear in SlotStudy
            </Text>
          </View>
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel="Close profile editor"
            onPress={onClose}
            className="h-10 w-10 items-center justify-center rounded-full bg-white dark:bg-slate-800"
          >
            <X size={20} color="#64748B" />
          </TouchableOpacity>
        </View>

        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ padding: 20, paddingBottom: 36 }}
        >
          <View className="mb-7 items-center">
            <TouchableOpacity
              accessibilityRole="button"
              accessibilityLabel="Choose a profile picture"
              onPress={choosePicture}
              disabled={isSaving}
              className="relative"
            >
              {previewUri ? (
                <Image
                  source={{ uri: previewUri }}
                  className="h-28 w-28 rounded-full border-4 border-white dark:border-slate-800"
                />
              ) : (
                <View className="h-28 w-28 items-center justify-center rounded-full bg-primary">
                  <Text className="text-3xl font-bold text-white">
                    {initials}
                  </Text>
                </View>
              )}
              <View className="absolute bottom-0 right-0 h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-primary dark:border-slate-900">
                {picture ? (
                  <ImagePlus size={18} color="#FFFFFF" />
                ) : (
                  <Camera size={18} color="#FFFFFF" />
                )}
              </View>
            </TouchableOpacity>
            <Text className="mt-3 text-sm font-medium text-primary">
              {picture ? "Picture selected" : "Change profile picture"}
            </Text>
            <Text className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              JPG, PNG or WebP · up to 5 MB
            </Text>
          </View>

          <Input
            label="Full name"
            value={name}
            onChangeText={setName}
            placeholder="Your full name"
            autoCapitalize="words"
            maxLength={100}
            editable={!isSaving}
            returnKeyType="next"
          />
          <Input
            label="Username"
            value={username}
            onChangeText={setUsername}
            placeholder="Choose a username"
            autoCapitalize="none"
            autoCorrect={false}
            maxLength={20}
            editable={!isSaving}
          />
          <Text className="-mt-3 mb-4 text-xs text-slate-500 dark:text-slate-400">
            3–20 letters, numbers, or underscores
          </Text>
          <Input label="Email" value={profile.email} editable={false} />

          <Button
            title="Save changes"
            onPress={saveProfile}
            loading={isSaving}
            disabled={isSaving}
            fullWidth
            className="mt-2"
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </Modal>
  );
}
