import React, { useEffect, useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { ScreenWrapper } from "@/shared/components/layout/ScreenWrapper";
import { Button } from "@/shared/components/ui/Button";
import { AppAlert as Alert } from "@/shared/components/feedback/AppAlert";
import {
  apiClient,
  getApiErrorMessage,
} from "@/shared/services/api.client";
import { useAuthStore } from "../store/auth.store";
import type { AuthResponse } from "../types/auth.types";

export default function VerifyOtpScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const email = route.params.email as string;
  const setAuth = useAuthStore((state) => state.setAuth);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [resendSeconds, setResendSeconds] = useState(60);

  useEffect(() => {
    const timer = setInterval(() => {
      setResendSeconds((remaining) => Math.max(remaining - 1, 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const verifyCode = async () => {
    if (!/^\d{6}$/.test(code)) {
      Alert.alert("Enter your code", "Please enter the six-digit code from your email.");
      return;
    }

    setLoading(true);
    try {
      const response = await apiClient.post<AuthResponse>(
        "/auth/register/verify-otp",
        { email, code },
      );
      const auth = response.data;
      if (!auth?.accessToken) {
        throw new Error("We couldn't verify your email. Please try again.");
      }
      setAuth(auth.user, auth.accessToken, auth.refreshToken);
      Alert.alert(
        "Email verified",
        `Your account is ready, ${auth.user.name}. Welcome to SlotStudy!`,
        [{ text: "Go to dashboard" }],
      );
    } catch (error) {
      Alert.alert(
        "Verification failed",
        getApiErrorMessage(
          error,
          "We couldn't verify your email. Please check the code and try again.",
        ),
      );
    } finally {
      setLoading(false);
    }
  };

  const resendCode = async () => {
    setResending(true);
    try {
      await apiClient.post("/auth/register/resend-otp", { email });
      setCode("");
      setResendSeconds(60);
      Alert.alert(
        "Code sent",
        "A new email verification code has been sent to your inbox.",
      );
    } catch (error) {
      Alert.alert(
        "Could not resend code",
        getApiErrorMessage(error, "Please try again in a minute."),
      );
    } finally {
      setResending(false);
    }
  };

  return (
    <ScreenWrapper className="flex-1 justify-center bg-surface px-8 dark:bg-slate-900">
      <View className="mb-8">
        <Text className="mb-2 text-3xl font-bold text-slate-900 dark:text-white">
          Check your email
        </Text>
        <Text className="text-base leading-6 text-slate-500 dark:text-slate-400">
          Enter the six-digit verification code we sent to {email}.
        </Text>
      </View>
      <TextInput
        className="mb-6 rounded-xl border border-slate-200 bg-white px-4 py-4 text-center text-2xl tracking-[8px] text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
        placeholder="000000"
        placeholderTextColor="#94a3b8"
        value={code}
        onChangeText={(value) => setCode(value.replace(/\D/g, "").slice(0, 6))}
        keyboardType="number-pad"
        textContentType="oneTimeCode"
        autoComplete="one-time-code"
        maxLength={6}
        returnKeyType="done"
        onSubmitEditing={verifyCode}
      />
      <Button
        title="Verify and sign in"
        onPress={verifyCode}
        loading={loading}
        className="mb-5 w-full"
      />
      <TouchableOpacity
        accessibilityRole="button"
        onPress={resendCode}
        disabled={resending || resendSeconds > 0}
        className="items-center py-3"
      >
        <Text
          className={`font-semibold ${
            resendSeconds > 0 ? "text-slate-400" : "text-primary"
          }`}
        >
          {resending
            ? "Sending..."
            : resendSeconds > 0
              ? `Resend code in ${resendSeconds}s`
              : "Resend code"}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        accessibilityRole="button"
        onPress={() => navigation.goBack()}
        className="items-center py-3"
      >
        <Text className="text-slate-500 dark:text-slate-400">
          Back to sign in
        </Text>
      </TouchableOpacity>
    </ScreenWrapper>
  );
}
