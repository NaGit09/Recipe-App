import { useAuthStore } from "@/src/stores/auth.store";
import { StorageInstance } from "@/src/utils/storage";
import { Stack, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";

export default function RootLayout() {
  const { accessToken } = useAuthStore();
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
      } else if (!accessToken) {
        router.replace("/login");
      }
    };
    checkFirstLaunch();
  }, [isReady, accessToken]);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="login" />
    </Stack>
  );
}
