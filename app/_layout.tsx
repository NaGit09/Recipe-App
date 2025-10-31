import { useAuthStore } from "@/src/stores/auth.store";
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
    if (!accessToken) {
      router.replace("/login");
    }
  }, [isReady, accessToken]);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="login" />
    </Stack>
  );
}
