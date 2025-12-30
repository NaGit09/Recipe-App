import { useAuth } from "@/src/hooks/useAuth";
import { RegisterReq } from "@/src/types/auth.type";
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

const Register = () => {
  const { register, loading } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [visible, setVisible] = useState(false);
  const [snackMessage, setSnackMessage] = useState("");
  const [secure, setSecure] = useState(true);
  const [secureConfirm, setSecureConfirm] = useState(true);

  // Display toast message
  const onDismissSnackBar = () => setVisible(false);

  // Handle register
  const handleRegister = async () => {
    if (!email || !password || !confirmPassword || !username) {
      setSnackMessage("Please fill in all fields");
      setVisible(true);
      return;
    }

    if (password !== confirmPassword) {
      setSnackMessage("Passwords do not match");
      setVisible(true);
      return;
    }

    try {
      const registerReq: RegisterReq = {
        email: email,
        password: password,
        username: username,
      };
      const success = await register(registerReq);
      if (success) {
        setSnackMessage("🎉 Account created successfully!");
        setVisible(true);
        setTimeout(() => router.replace("/login"), 1500);
      } else {
        setSnackMessage("Registration failed. Please try again.");
        setVisible(true);
      }
    } catch (error) {
      console.error(error);
      setSnackMessage("An error occurred. Please try again later.");
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
                name="food-variant"
                size={48}
                color="#DC2626"
              />
            </View>
            <Text style={styles.title}>Join Our Kitchen</Text>
            <Text style={styles.subtitle}>Start your culinary journey</Text>
          </View>

          <View style={styles.form}>
            <TextInput
              style={styles.input}
              mode="outlined"
              label="Username"
              placeholder="Enter your username"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
              outlineColor="#FECACA"
              activeOutlineColor="#DC2626"
              textColor="#450A0A"
              theme={{ roundness: 12 }}
              left={<TextInput.Icon icon="account-outline" color="#DC2626" />}
            />

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

            <TextInput
              style={styles.input}
              label="Confirm Password"
              mode="outlined"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={secureConfirm}
              outlineColor="#FECACA"
              activeOutlineColor="#DC2626"
              textColor="#450A0A"
              theme={{ roundness: 12 }}
              left={
                <TextInput.Icon icon="lock-check-outline" color="#DC2626" />
              }
              right={
                <TextInput.Icon
                  icon={secureConfirm ? "eye-off" : "eye"}
                  color="#DC2626"
                  onPress={() => setSecureConfirm(!secureConfirm)}
                />
              }
            />

            <Button
              mode="contained"
              onPress={handleRegister}
              style={styles.button}
              contentStyle={styles.buttonContent}
              buttonColor="#DC2626"
              labelStyle={styles.buttonLabel}
              loading={loading}
              disabled={loading}
            >
              Sign Up
            </Button>

            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>Already have an account? </Text>
              <TouchableOpacity onPress={() => router.back()}>
                <Text style={styles.loginLink}>Login</Text>
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
  button: {
    marginTop: 8,
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
  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 24,
  },
  loginText: {
    color: "#4B5563",
    fontSize: 16,
  },
  loginLink: {
    color: "#DC2626",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default Register;
