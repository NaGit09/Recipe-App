import { useAuth } from "@/src/hooks/useAuth";
import { LoginReq } from "@/src/types/auth.type";
import { StorageInstance } from "@/src/utils/storage";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { Button, Snackbar, Text, TextInput } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

const Login = () => {
  const { login , loading } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [visible, setVisible] = useState(false);
  const [snackMessage, setSnackMessage] = useState("");
  const [secure, setSecure] = useState(true);

  const onDismissSnackBar = () => setVisible(false);

  const handleLogin = async () => {
    await StorageInstance.removeItem("accessToken");

    if (!email || !password) {
      setSnackMessage("Please enter both email and password");
      setVisible(true);
      return;
    }

    try {
      const loginReq: LoginReq = {
        email: email,
        password: password,
      };
      const success = await login(loginReq);

      if (success) {
        setSnackMessage("🎉 Login success!");
        setVisible(true);
        setTimeout(() => router.replace("/"), 500);
      } else {
        setSnackMessage("Invalid email or password");
        setVisible(true);
      }
    } catch (error) {
      setSnackMessage("Login failed. Please try again later.");
      setVisible(true);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FEF2F2" }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <View style={styles.container}>
          <View style={styles.header}>
            <View style={styles.iconContainer}>
              <MaterialCommunityIcons
                name="chef-hat"
                size={48}
                color="#DC2626"
              />
            </View>
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>Cook something delicious today</Text>
          </View>

          <View style={styles.form}>
            <TextInput
              style={styles.input}
              mode="outlined"
              label="Email"
              placeholder="Enter your email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              outlineColor="#FECACA"
              activeOutlineColor="#DC2626"
              textColor="#450A0A"
              theme={{ roundness: 12 }}
              left={<TextInput.Icon icon="email-outline" color="#DC2626" />}
            />

            <TextInput
              style={styles.input}
              label="Password"
              mode="outlined"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={secure}
              outlineColor="#FECACA"
              activeOutlineColor="#DC2626"
              textColor="#450A0A"
              theme={{ roundness: 12 }}
              left={<TextInput.Icon icon="lock-outline" color="#DC2626" />}
              right={
                <TextInput.Icon
                  icon={secure ? "eye-off" : "eye"}
                  color="#DC2626"
                  onPress={() => setSecure(!secure)}
                />
              }
            />

            <TouchableOpacity onPress={() => {}}>
              <Text style={styles.forgot}>Forgot password?</Text>
            </TouchableOpacity>

            <Button
              mode="contained"
              onPress={handleLogin}
              style={styles.button}
              contentStyle={styles.buttonContent}
              buttonColor="#DC2626"
              labelStyle={styles.buttonLabel}
              loading={loading}
              disabled={loading}
            >
              Login
            </Button>

            <View style={styles.registerContainer}>
              <Text style={styles.registerText}>Don't have an account? </Text>
              <TouchableOpacity onPress={() => router.push("/register")}>
                <Text style={styles.registerLink}>Sign up</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <Snackbar
          visible={visible}
          onDismiss={onDismissSnackBar}
          duration={3000}
          style={{ backgroundColor: "#1F2937" }}
          action={{
            label: "Close",
            onPress: () => setVisible(false),
            color: "#F87171",
          }}
        >
          {snackMessage}
        </Snackbar>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  header: {
    alignItems: "center",
    marginBottom: 40,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#FEE2E2",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#DC2626",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#7F1D1D",
    opacity: 0.8,
  },
  form: {
    width: "100%",
  },
  input: {
    marginBottom: 16,
    backgroundColor: "#FFFFFF",
  },
  forgot: {
    textAlign: "right",
    marginBottom: 24,
    color: "#DC2626",
    fontWeight: "600",
  },
  button: {
    borderRadius: 12,
    elevation: 4,
    shadowColor: "#DC2626",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  buttonContent: {
    paddingVertical: 8,
  },
  buttonLabel: {
    fontSize: 18,
    fontWeight: "bold",
    lineHeight: 24,
  },
  registerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 24,
  },
  registerText: {
    color: "#4B5563",
    fontSize: 16,
  },
  registerLink: {
    color: "#DC2626",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default Login;
