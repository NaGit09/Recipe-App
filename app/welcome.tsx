import { StorageInstance } from "@/src/utils/storage";
import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { Button, Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

const Welcome = () => {
  const router = useRouter();

  useEffect(() => {
    const setFirstLaunchInfo = async () => {
      await StorageInstance.setItem("isFirstLaunch", "false");
    };
    setFirstLaunchInfo();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Cook Something Amazing Today</Text>
        <Text style={styles.subtitle}>
          Discover, save, and share your favorite recipes with the world.
        </Text>

        <View style={styles.buttonContainer}>
          <Button
            mode="contained"
            onPress={() => router.push("/login")}
            style={styles.button}
            contentStyle={styles.buttonContent}
          >
            Login
          </Button>

          <Button
            mode="outlined"
            onPress={() => router.push("/register")}
            style={[styles.button, styles.registerButton]}
            contentStyle={styles.buttonContent}
          >
            Create Account
          </Button>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
    alignItems: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 16,
    color: "#333",
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 48,
    color: "#666",
    lineHeight: 24,
  },
  buttonContainer: {
    width: "100%",
    gap: 16,
  },
  button: {
    borderRadius: 8,
  },
  registerButton: {
    borderColor: "#6200ee", // Or primary color
  },
  buttonContent: {
    paddingVertical: 8,
  },
});

export default Welcome;
