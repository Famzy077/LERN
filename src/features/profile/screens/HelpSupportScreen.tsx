import React, { useState } from "react";
import {
  Linking,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import {
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  Mail,
  MessageCircleQuestion,
} from "lucide-react-native";
import { ScreenWrapper } from "@/shared/components/layout/ScreenWrapper";
import { AppAlert as Alert } from "@/shared/components/feedback/AppAlert";

const SUPPORT_EMAIL =
  process.env.EXPO_PUBLIC_SUPPORT_EMAIL ?? "support@slotstudy.app";

const FAQs = [
  {
    question: "How do I create a summary?",
    answer:
      "Open AI Study and upload a PDF, JPG, or PNG image. When processing finishes, your summary will appear in your AI library.",
  },
  {
    question: "Why is my material still processing?",
    answer:
      "Large documents or temporary AI service demand can take longer. Your upload is saved if processing fails. Open AI Study, check Material processing, and tap Retry; you do not need to upload the file again.",
  },
  {
    question: "How do I make a quiz?",
    answer:
      "Open a completed summary and choose Generate Quiz. Quiz generation needs an active connection and can be retried if the AI service is temporarily unavailable.",
  },
  {
    question: "How can I manage my subscription?",
    answer:
      "Open Profile, then Subscription to see available plans and your current plan. In-app checkout is not available yet; contact support with subscription questions.",
  },
  {
    question: "How do I change my account settings?",
    answer:
      "Open Profile, then Settings to adjust your theme, notification preferences, study reminders, and haptic feedback.",
  },
];

export default function HelpSupportScreen() {
  const navigation = useNavigation<any>();
  const [expandedQuestion, setExpandedQuestion] = useState<string | null>(
    FAQs[0].question,
  );

  const contactSupport = async () => {
    const url = `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent("SlotStudy support")}`;
    try {
      const canOpen = await Linking.canOpenURL(url);
      if (!canOpen) {
        Alert.alert(
          "No email app found",
          `You can email us at ${SUPPORT_EMAIL}.`,
        );
        return;
      }
      await Linking.openURL(url);
    } catch {
      Alert.alert(
        "Could not open email",
        `Please email us at ${SUPPORT_EMAIL}.`,
      );
    }
  };

  return (
    <ScreenWrapper padded={false}>
      <View className="flex-1 bg-surface dark:bg-slate-900">
        <View className="flex-row items-center px-5 pb-4 pt-3">
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel="Go back"
            onPress={() => navigation.goBack()}
            className="mr-3 h-10 w-10 items-center justify-center rounded-full bg-white dark:bg-slate-800"
          >
            <ArrowLeft size={21} color="#334155" />
          </TouchableOpacity>
          <View>
            <Text className="text-2xl font-bold text-slate-900 dark:text-slate-50">
              Help & support
            </Text>
            <Text className="text-sm text-slate-500 dark:text-slate-400">
              We’re here to help you study
            </Text>
          </View>
        </View>

        <ScrollView
          className="flex-1 px-5"
          contentContainerStyle={{ paddingBottom: 32 }}
        >
          <View className="rounded-3xl bg-primary p-5">
            <View className="h-12 w-12 items-center justify-center rounded-2xl bg-white/20">
              <MessageCircleQuestion size={25} color="#FFFFFF" />
            </View>
            <Text className="mt-4 text-xl font-bold text-white">
              How can we help?
            </Text>
            <Text className="mt-1 text-sm leading-5 text-white/80">
              Find quick answers below or get in touch with our support team.
            </Text>
            <TouchableOpacity
              accessibilityRole="button"
              onPress={contactSupport}
              className="mt-4 flex-row items-center self-start rounded-xl bg-white px-4 py-3"
            >
              <Mail size={17} color="#2563EB" />
              <Text className="ml-2 font-semibold text-primary">
                Email support
              </Text>
            </TouchableOpacity>
          </View>

          <Text className="mb-3 mt-7 text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
            Frequently asked questions
          </Text>
          <View className="overflow-hidden rounded-3xl bg-white dark:bg-slate-800">
            {FAQs.map(({ question, answer }, index) => {
              const expanded = expandedQuestion === question;
              return (
                <View
                  key={question}
                  className={
                    index < FAQs.length - 1
                      ? "border-b border-slate-100 dark:border-slate-700"
                      : ""
                  }
                >
                  <TouchableOpacity
                    accessibilityRole="button"
                    accessibilityState={{ expanded }}
                    onPress={() =>
                      setExpandedQuestion(expanded ? null : question)
                    }
                    className="flex-row items-center px-4 py-4"
                  >
                    <Text className="flex-1 pr-3 font-semibold text-slate-900 dark:text-slate-50">
                      {question}
                    </Text>
                    {expanded ? (
                      <ChevronUp size={19} color="#64748B" />
                    ) : (
                      <ChevronDown size={19} color="#64748B" />
                    )}
                  </TouchableOpacity>
                  {expanded ? (
                    <Text className="px-4 pb-4 text-sm leading-5 text-slate-600 dark:text-slate-300">
                      {answer}
                    </Text>
                  ) : null}
                </View>
              );
            })}
          </View>

          <View className="mt-5 items-center rounded-2xl bg-white p-4 dark:bg-slate-800">
            <Text className="font-semibold text-slate-900 dark:text-slate-50">
              Still need a hand?
            </Text>
            <Text className="mt-1 text-center text-sm text-slate-500 dark:text-slate-400">
              Reach us at {SUPPORT_EMAIL}
            </Text>
          </View>
        </ScrollView>
      </View>
    </ScreenWrapper>
  );
}
