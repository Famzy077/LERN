import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import type { MainStackParamList } from "./types";
import { TabNavigator } from "./TabNavigator";

import UploadMaterialScreen from "@/features/ai/screens/UploadMaterialScreen";
import AISummaryScreen from "@/features/ai/screens/AISummaryScreen";
import QuizHubScreen from "@/features/quiz/screens/QuizHubScreen";
import QuizScreen from "@/features/quiz/screens/QuizScreen";
import QuizResultScreen from "@/features/quiz/screens/QuizResultScreen";
import NotificationsScreen from "@/features/notifications/screens/NotificationsScreen";
import SubscriptionScreen from "@/features/subscription/screens/SubscriptionScreen";
import SettingsScreen from "@/features/settings/screens/SettingsScreen";
import HelpSupportScreen from "@/features/profile/screens/HelpSupportScreen";
import AcademicSetupScreen from "@/features/auth/screens/AcademicSetupScreen";

const Stack = createNativeStackNavigator<MainStackParamList>();

export function MainNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
      }}
    >
      <Stack.Screen name="Tabs" component={TabNavigator} />
      <Stack.Screen name="UploadMaterial" component={UploadMaterialScreen} />
      <Stack.Screen name="AISummary" component={AISummaryScreen} />
      <Stack.Screen name="QuizHub" component={QuizHubScreen} />
      <Stack.Screen name="Quiz" component={QuizScreen} />
      <Stack.Screen
        name="QuizResult"
        component={QuizResultScreen}
        options={{ gestureEnabled: false }}
      />
      <Stack.Screen name="Notifications" component={NotificationsScreen} />
      <Stack.Screen
        name="Subscription"
        component={SubscriptionScreen}
        options={{ presentation: "modal", animation: "slide_from_bottom" }}
      />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="HelpSupport" component={HelpSupportScreen} />
      <Stack.Screen name="AcademicDetails" component={AcademicSetupScreen} />
    </Stack.Navigator>
  );
}
