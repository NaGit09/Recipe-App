import { Stack, useRouter } from "expo-router";
import React, { useEffect } from "react";

function RouteGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const isAuth = false;
  useEffect(() => {
    if (!isAuth) {
      router.replace("/login");
    }
  });
  return <> {children}</>;
}

export default function RootLayout() {
  return (
    // <RouteGuard>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    // {/* </RouteGuard> */}
  );
}
