import { useAuthStore } from "@/src/stores/auth.store";
import { useThemeStore } from "@/src/stores/theme.store";
import { StorageInstance } from "@/src/utils/storage";
import { Stack, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Provider as PaperProvider } from "react-native-paper";

import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function RootLayout() {
  const { token } = useAuthStore();
  const { theme, loadTheme } = useThemeStore();
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    loadTheme();
    setIsReady(true);
  }, []);

  useEffect(() => {
    if (!isReady) return;

    setTimeout(async () => {
      const isFirstLaunch = await StorageInstance.getItem("isFirstLaunch");
      const { user } = useAuthStore.getState();

      if (isFirstLaunch === null) {
        router.replace("/welcome");
      } else if (!token) {
        router.replace("/login");
      } else if (token && user?.role === "ADMIN") {
        router.replace("/admin");
      }
    }, 100);
  }, [isReady, token]);

  if (!isReady) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <PaperProvider theme={theme}>
        <Stack
          screenOptions={{
            headerShown: false,
            animation: "slide_from_right",
            contentStyle: { backgroundColor: theme.colors.background },
          }}
        >
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="admin" options={{ headerShown: false }} />
          <Stack.Screen name="login" />
          <Stack.Screen
            name="register"
            options={{ animation: "slide_from_bottom" }}
          />
        </Stack>
      </PaperProvider>
    </GestureHandlerRootView>
  );
}
