import { useAuthStore } from "@/src/stores/auth.store";
import { RegisterReq } from "@/src/types/user.type";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import {
  ActivityIndicator,
  Button,
  Snackbar,
  Text,
  TextInput,
} from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

const Register = () => {
  const { register } = useAuthStore();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [visible, setVisible] = useState(false);
  const [snackMessage, setSnackMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [secure, setSecure] = useState(true);
  const [secureConfirm, setSecureConfirm] = useState(true);

  const onDismissSnackBar = () => setVisible(false);

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

    setLoading(true);
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
        setTimeout(() => router.replace("/"), 1500);
      } else {
        setSnackMessage("Registration failed. Please try again.");
        setVisible(true);
      }
    } catch (error) {
      console.error(error);
      setSnackMessage("An error occurred. Please try again later.");
      setVisible(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <View style={styles.container}>
          <Text style={styles.title}>Create Account 🚀</Text>

          <TextInput
            style={styles.input}
            mode="outlined"
            label="Username"
            placeholder="Enter your username"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
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
          />

          <TextInput
            style={styles.input}
            label="Password"
            mode="outlined"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={secure}
            right={
              <TextInput.Icon
                icon={secure ? "eye-off" : "eye"}
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
            right={
              <TextInput.Icon
                icon={secureConfirm ? "eye-off" : "eye"}
                onPress={() => setSecureConfirm(!secureConfirm)}
              />
            }
          />

          <Button
            mode="contained"
            onPress={handleRegister}
            style={styles.button}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator animating color="#fff" />
            ) : (
              "Register"
            )}
          </Button>

          <View style={styles.loginContainer}>
            <Text>Already have an account? </Text>
            <TouchableOpacity onPress={() => router.back()}>
              <Text style={styles.loginLink}>Login</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Snackbar
          visible={visible}
          onDismiss={onDismissSnackBar}
          duration={3000}
          action={{
            label: "Close",
            onPress: () => setVisible(false),
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
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 32,
  },
  input: {
    width: "100%",
    marginBottom: 16,
  },
  button: {
    marginTop: 8,
    paddingVertical: 6,
  },
  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  loginLink: {
    color: "#007bff",
    fontWeight: "bold",
  },
});

export default Register;
