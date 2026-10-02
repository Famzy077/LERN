import React, { useEffect, useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { ScreenWrapper } from "@/shared/components/layout/ScreenWrapper";
import { Button } from "@/shared/components/ui/Button";
import { AppAlert as Alert } from "@/shared/components/feedback/AppAlert";
import { apiClient } from "@/shared/services/api.client";

export default function ForgotPasswordScreen() {
  const navigation = useNavigation<any>();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resendSeconds, setResendSeconds] = useState(0);

  useEffect(() => {
    if (!codeSent) return;
    const timer = setInterval(() => {
      setResendSeconds((remaining) => Math.max(remaining - 1, 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [codeSent]);

  const requestCode = async () => {
    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail) {
      Alert.alert("Email required", "Enter the email address for your account.");
      return;
    }
    setLoading(true);
    try {
      await apiClient.post("/auth/forgot-password", { email: normalizedEmail });
      setEmail(normalizedEmail);
      setCodeSent(true);
      setResendSeconds(60);
      Alert.alert(
        "Check your email",
        "If an account exists for that address, a password reset code has been sent.",
      );
    } catch (error) {
      Alert.alert(
        "Could not send reset code",
        error instanceof Error ? error.message : "Please try again in a moment.",
      );
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async () => {
    if (!/^\d{6}$/.test(code)) {
      Alert.alert("Enter your code", "Please enter the six-digit code from your email.");
      return;
    }
    if (newPassword.length < 6) {
      Alert.alert("Password too short", "Your new password must have at least six characters.");
      return;
    }
    setLoading(true);
    try {
      await apiClient.post("/auth/reset-password", {
        email,
        code,
        newPassword,
      });
      Alert.alert(
        "Password updated",
        "Your password has been reset. Sign in with your new password.",
        [{ text: "Continue", onPress: () => navigation.replace("Login") }],
      );
    } catch (error) {
      Alert.alert(
        "Could not reset password",
        error instanceof Error ? error.message : "Check your code and try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenWrapper className="flex-1 justify-center bg-surface px-8 dark:bg-slate-900">
      <View className="mb-8">
        <Text className="mb-2 text-3xl font-bold text-slate-900 dark:text-white">
          {codeSent ? "Reset your password" : "Forgot password?"}
        </Text>
        <Text className="text-base leading-6 text-slate-500 dark:text-slate-400">
          {codeSent
            ? `Enter the code sent to ${email} and choose a new password.`
            : "Enter your account email and we’ll send you a password reset code."}
        </Text>
      </View>

      {!codeSent ? (
        <TextInput
          className="mb-6 rounded-xl border border-slate-200 bg-white px-4 py-4 text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          placeholder="Email address"
          placeholderTextColor="#94a3b8"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          autoComplete="email"
        />
      ) : (
        <>
          <TextInput
            className="mb-4 rounded-xl border border-slate-200 bg-white px-4 py-4 text-center text-2xl tracking-[8px] text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            placeholder="000000"
            placeholderTextColor="#94a3b8"
            value={code}
            onChangeText={(value) => setCode(value.replace(/\D/g, "").slice(0, 6))}
            keyboardType="number-pad"
            textContentType="oneTimeCode"
            autoComplete="one-time-code"
            maxLength={6}
          />
          <TextInput
            className="mb-6 rounded-xl border border-slate-200 bg-white px-4 py-4 text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            placeholder="New password"
            placeholderTextColor="#94a3b8"
            value={newPassword}
            onChangeText={setNewPassword}
            secureTextEntry
            autoCapitalize="none"
            autoComplete="new-password"
            textContentType="newPassword"
          />
          <TouchableOpacity
            accessibilityRole="button"
            onPress={requestCode}
            disabled={loading || resendSeconds > 0}
            className="mb-4 self-end"
          >
            <Text
              className={`font-semibold ${
                resendSeconds > 0 ? "text-slate-400" : "text-primary"
              }`}
            >
              {resendSeconds > 0
                ? `Resend code in ${resendSeconds}s`
                : "Resend code"}
            </Text>
          </TouchableOpacity>
        </>
      )}

      <Button
        title={codeSent ? "Update password" : "Send reset code"}
        onPress={codeSent ? resetPassword : requestCode}
        loading={loading}
        className="mb-5 w-full"
      />
      <TouchableOpacity
        accessibilityRole="button"
        onPress={() => navigation.goBack()}
        className="items-center py-3"
      >
        <Text className="font-semibold text-primary">Back to sign in</Text>
      </TouchableOpacity>
    </ScreenWrapper>
  );
}
