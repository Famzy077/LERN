import { useColorScheme as useRNColorScheme } from "react-native";
import { useSettingsStore } from "@/features/settings/store/settings.store";
import { Colors, type ColorTokens } from "@/shared/constants/colors";

export function useTheme(): {
  isDark: boolean;
  colors: (typeof Colors)["light"] | (typeof Colors)["dark"];
  colorScheme: "light" | "dark";
} {
  const systemScheme = useRNColorScheme();
  const themeMode = useSettingsStore((s) => s.themeMode);

  const colorScheme: "light" | "dark" =
    themeMode === "system"
      ? systemScheme === "dark"
        ? "dark"
        : "light"
      : themeMode;

  return {
    isDark: colorScheme === "dark",
    colors: Colors[colorScheme],
    colorScheme,
  };
}
