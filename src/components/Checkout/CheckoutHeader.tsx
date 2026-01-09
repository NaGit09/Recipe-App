import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Text, useTheme } from "react-native-paper";

const CheckoutHeader = () => {
  const router = useRouter();
  const theme = useTheme();

  return (
    <View style={[styles.header, { backgroundColor: theme.colors.surface }]}>
      <TouchableOpacity onPress={() => router.back()} style={{ padding: 4 }}>
        <Feather name="arrow-left" size={24} color={theme.colors.onSurface} />
      </TouchableOpacity>
      <Text
        variant="headlineSmall"
        style={[styles.headerTitle, { color: theme.colors.onSurface }]}
      >
        Checkout
      </Text>
      <View style={{ width: 32 }} />
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    elevation: 2,
  },
  headerTitle: {
    fontWeight: "bold",
  },
});

export default CheckoutHeader;
