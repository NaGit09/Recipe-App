import { useAuth } from "@/src/hooks/useAuth";

import { LoginReq } from "@/src/types/user.type";
import { StorageInstance } from "@/src/utils/storage";
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

const Login = () => {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [visible, setVisible] = useState(false);
  const [snackMessage, setSnackMessage] = useState("");
  const [secure, setSecure] = useState(true);

  // Display toast message
  const onDismissSnackBar = () => setVisible(false);
  // Handle login
  const handleLogin = async () => {

    // remove old token
    await StorageInstance.removeItem('accessToken');
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
      console.log(success);
      
      if (success) {
        setSnackMessage("🎉 Login success!");
        setVisible(true);

        setTimeout(() => router.push("/"), 500);
      } else {
        setSnackMessage("Invalid email or password");
        setVisible(true);
      }
    } catch (error) {
      console.error(error);
      setSnackMessage("Login failed. Please try again later.");
      setVisible(true);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <View style={styles.container}>
          <Text style={styles.title}>Welcome Back 👋</Text>

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

          <Button
            mode="contained"
            onPress={handleLogin}
            style={styles.button}
          >
            Login
          </Button>

          <Text style={styles.forgot}>Forgot password?</Text>

          <View style={styles.registerContainer}>
            <Text>Don't have an account? </Text>
            <TouchableOpacity onPress={() => router.push("/register")}>
              <Text style={styles.registerLink}>Sign up</Text>
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
  forgot: {
    textAlign: "center",
    marginTop: 12,
    color: "#007bff",
  },
  registerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  registerLink: {
    color: "#007bff",
    fontWeight: "bold",
  },
});

export default Login;
