import { Stack } from "expo-router";
import React from "react";

export default function AdminLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: "#f4511e",
        },
        headerTintColor: "#fff",
        headerTitleStyle: {
          fontWeight: "bold",
        },
        }}
    >
      <Stack.Screen name="index" options={{ title: "Admin Dashboard" }} />
      <Stack.Screen name="users" options={{ title: "User Management" }} />
      <Stack.Screen name="recipes" options={{ title: "Recipe Management" }} />
      <Stack.Screen name="orders" options={{ title: "Order Management" }} />
      <Stack.Screen
        name="ingredients"
        options={{ title: "Ingredient Management" }}
      />
    </Stack>
  );
}
