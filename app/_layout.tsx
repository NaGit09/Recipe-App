import { useAuthStore } from "@/src/stores/auth.store";
import { StorageInstance } from "@/src/utils/storage";
import { Stack, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";

import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function RootLayout() {
  const { token } = useAuthStore();
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setIsReady(true);
  }, []);

  useEffect(() => {
    if (!isReady) return;
    const checkFirstLaunch = async () => {
      const isFirstLaunch = await StorageInstance.getItem("isFirstLaunch");
      console.log("isFirstLaunch", isFirstLaunch);
      if (isFirstLaunch === null) {
        router.replace("/welcome");
      } else if (!token) {
        router.replace("/login");
      }
    };
    checkFirstLaunch();
  }, [isReady, token]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: "slide_from_right",
          contentStyle: { backgroundColor: "#FEF2F2" }, // Consistent background
        }}
      >
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="login" />
        <Stack.Screen
          name="register"
          options={{ animation: "slide_from_bottom" }}
        />
        {/* Register often looks good sliding up or just right, let's stick to consistent right or maybe bottom for modal feel */}
      </Stack>
    </GestureHandlerRootView>
  );
}
