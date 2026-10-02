import React, { useEffect, useState } from "react";
import {
  Modal,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export interface AppAlertButton {
  text: string;
  onPress?: () => void;
  style?: "default" | "cancel" | "destructive";
}

interface AppAlertRequest {
  title: string;
  message?: string;
  buttons?: AppAlertButton[];
}

type AlertListener = (request: AppAlertRequest) => void;

const listeners = new Set<AlertListener>();
const pendingAlerts: AppAlertRequest[] = [];

export const AppAlert = {
  alert(title: string, message?: string, buttons?: AppAlertButton[]) {
    const request = { title, message, buttons };
    const listener = listeners.values().next().value;
    if (listener) {
      listener(request);
    } else {
      pendingAlerts.push(request);
    }
  },
};

export function AppAlertHost() {
  const [state, setState] = useState<{
    current: AppAlertRequest | null;
    queue: AppAlertRequest[];
  }>({ current: null, queue: [] });

  useEffect(() => {
    const listener: AlertListener = (request) => {
      setState((previous) => ({
        current: previous.current ?? request,
        queue: previous.current ? [...previous.queue, request] : previous.queue,
      }));
    };

    listeners.add(listener);
    let pending = pendingAlerts.shift();
    while (pending) {
      listener(pending);
      pending = pendingAlerts.shift();
    }
    return () => {
      listeners.delete(listener);
    };
  }, []);

  const dismiss = () => {
    setState(({ queue }) => ({
      current: queue[0] ?? null,
      queue: queue.slice(1),
    }));
  };

  const current = state.current;
  const buttons = current?.buttons?.length
    ? current.buttons
    : [{ text: "Done", style: "default" as const }];

  return (
    <Modal
      transparent
      visible={current !== null}
      animationType="fade"
      onRequestClose={dismiss}
      statusBarTranslucent
    >
      <View className="flex-1 items-center justify-center bg-black/50 px-7">
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Close alert"
          onPress={dismiss}
          className="absolute inset-0"
        />
        <View
          accessibilityRole="alert"
          className="w-full rounded-3xl bg-white p-6 dark:bg-slate-800"
        >
          <Text className="text-lg font-bold text-slate-900 dark:text-white">
            {current?.title}
          </Text>
          {current?.message ? (
            <Text className="mt-2 text-base leading-6 text-slate-600 dark:text-slate-300">
              {current.message}
            </Text>
          ) : null}
          <View className="mt-6 flex-row justify-end gap-3">
            {buttons.map((button, index) => {
              const isDestructive = button.style === "destructive";
              const isCancel = button.style === "cancel";
              return (
                <TouchableOpacity
                  key={`${button.text}-${index}`}
                  accessibilityRole="button"
                  onPress={() => {
                    dismiss();
                    button.onPress?.();
                  }}
                  className={`min-h-11 items-center justify-center rounded-xl px-4 ${
                    isDestructive
                      ? "bg-red-600"
                      : isCancel
                        ? "bg-slate-100 dark:bg-slate-700"
                        : "bg-primary"
                  }`}
                >
                  <Text
                    className={`font-semibold ${
                      isCancel
                        ? "text-slate-700 dark:text-slate-200"
                        : "text-white"
                    }`}
                  >
                    {button.text}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </View>
    </Modal>
  );
}
