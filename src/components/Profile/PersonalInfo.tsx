import { UserInfo } from "@/src/types/user.type";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { TextInput, useTheme } from "react-native-paper";

const PersonalInfo = ({
  formData,
  setFormData,
}: {
  formData: Partial<UserInfo>;
  setFormData: (data: Partial<UserInfo>) => void;
}) => {
  const theme = useTheme();

  return (
    <View style={styles.formSection}>
      <Text style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
        Personal Information
      </Text>

      <TextInput
        label="Username"
        value={formData.username}
        onChangeText={(text) => setFormData({ ...formData, username: text })}
        mode="outlined"
        style={[styles.input, { backgroundColor: theme.colors.surface }]}
        outlineColor={theme.colors.outline}
        activeOutlineColor={theme.colors.primary}
        textColor={theme.colors.onSurface}
        left={
          <TextInput.Icon
            icon="account"
            color={theme.colors.onSurfaceVariant}
          />
        }
      />

      <TextInput
        label="Email"
        value={formData.email}
        mode="outlined"
        disabled
        style={[styles.input, { backgroundColor: theme.colors.surface }]}
        outlineColor={theme.colors.outline}
        textColor={theme.colors.onSurfaceDisabled}
        left={
          <TextInput.Icon icon="email" color={theme.colors.onSurfaceDisabled} />
        }
      />

      <TextInput
        label="Bio"
        value={formData.bio}
        onChangeText={(text) => setFormData({ ...formData, bio: text })}
        mode="outlined"
        multiline
        numberOfLines={3}
        style={[styles.input, { backgroundColor: theme.colors.surface }]}
        outlineColor={theme.colors.outline}
        activeOutlineColor={theme.colors.primary}
        textColor={theme.colors.onSurface}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  formSection: { flex: 1 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 16,
  },

  input: { marginBottom: 16 },
});
export default PersonalInfo;
