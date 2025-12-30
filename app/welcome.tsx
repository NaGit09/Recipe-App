import { StorageInstance } from "@/src/utils/storage";
import { MaterialCommunityIcons } from "@expo/vector-icons";
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
        <View style={styles.iconContainer}>
          <MaterialCommunityIcons
            name="silverware-fork-knife"
            size={64}
            color="#DC2626"
          />
        </View>

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
            buttonColor="#DC2626"
            labelStyle={styles.buttonLabel}
          >
            Login
          </Button>

          <Button
            mode="outlined"
            onPress={() => router.push("/register")}
            style={[styles.button, styles.registerButton]}
            contentStyle={styles.buttonContent}
            textColor="#DC2626"
            labelStyle={styles.buttonLabel}
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
    backgroundColor: "#FEF2F2",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
    alignItems: "center",
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#FEE2E2",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 16,
    color: "#DC2626",
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 48,
    color: "#7F1D1D",
    lineHeight: 24,
    opacity: 0.8,
  },
  buttonContainer: {
    width: "100%",
    gap: 16,
  },
  button: {
    borderRadius: 12,
    elevation: 2,
  },
  registerButton: {
    borderColor: "#DC2626",
    borderWidth: 2,
    backgroundColor: "transparent",
  },
  buttonContent: {
    paddingVertical: 8,
  },
  buttonLabel: {
    fontSize: 18,
    fontWeight: "bold",
    lineHeight: 24,
  },
});

export default Welcome;
