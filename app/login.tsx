import React from "react";
import { KeyboardAvoidingView, Platform, StyleSheet, Text, View } from "react-native";
import { TextInput } from "react-native-paper";

const login = () => {
  return (
    <KeyboardAvoidingView
    behavior={Platform.OS === "ios"? "padding" : "height"}
    >
      <View style={style.View}>
        <Text>loginScreen</Text>
        <TextInput
          style={style.TextInput}
          mode="outlined"
          label="email"
          placeholder="Enter your email"
        />
        <TextInput
          style={style.TextInput}
          label="Password"
          mode="outlined"
          secureTextEntry
          right={<TextInput.Icon icon="eye" />}
        />

        <Text>Forgot password ?</Text>
      </View>
    </KeyboardAvoidingView>
  );
};
const style = StyleSheet.create({
  View: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  TextInput: {
    width: 300,
  },
  Text: {
    color: "blue",
  },
});
export default login;
