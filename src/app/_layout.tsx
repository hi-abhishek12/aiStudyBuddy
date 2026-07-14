import { navigationTheme } from "@/lib/theme";
import { ThemeProvider } from "@react-navigation/native";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import * as SystemUI from "expo-system-ui";
import { use, useEffect } from "react";
import { Uniwind } from "uniwind";
import "../global.css";
import { initAuth, useAuthStore } from "@/features/auth/auth";
import { ActivityIndicator, View } from "react-native";
import { QueryProvider } from "@/providers/query-provider";

const BACKGROUND = "#101010";

SplashScreen.preventAutoHideAsync();

Uniwind.setTheme("dark");

export const unstable_settings = {
  anchor: "(app)",
};

export default function RootLayout() {
  const initialized = useAuthStore((state) => state.initialized);

  useEffect(() => {
    SystemUI.setBackgroundColorAsync(BACKGROUND);
  }, []);

  useEffect(() => {
    initAuth();
  }, []);

  useEffect(() => {
    if (initialized) {
      SplashScreen.hideAsync();
    }
  }, [initialized]);

  if (!initialized) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }
  return (
    <ThemeProvider value={navigationTheme}>
      <QueryProvider>
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: BACKGROUND },
          }}
        >
          <Stack.Screen name="(app)" />
          <Stack.Screen name="(auth)" />
        </Stack>
      </QueryProvider>
    </ThemeProvider>
  );
}
