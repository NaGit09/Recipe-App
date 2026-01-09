import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import { StyleSheet, Switch, Text, TouchableOpacity, View } from "react-native";
import { Surface, useTheme } from "react-native-paper";
import { ThemeSelector } from "./ThemeSelector";

const ProfileSettings = () => {
  const [notifications, setNotifications] = useState(true);
  const [themeModalVisible, setThemeModalVisible] = useState(false);
  const theme = useTheme();

  const renderSettingItem = (
    icon: string,
    label: string,
    value: boolean,
    onPress: () => void,
    isSwitch: boolean = true
  ) => (
    <TouchableOpacity
      style={styles.settingItem}
      onPress={isSwitch ? undefined : onPress}
      disabled={isSwitch}
    >
      <View style={styles.settingLeft}>
        <View
          style={[
            styles.iconContainer,
            { backgroundColor: theme.colors.surfaceVariant },
          ]}
        >
          <MaterialCommunityIcons
            name={icon as any}
            size={20}
            color={theme.colors.onSurfaceVariant}
          />
        </View>
        <Text style={[styles.settingLabel, { color: theme.colors.onSurface }]}>
          {label}
        </Text>
      </View>
      {isSwitch ? (
        <Switch
          value={value}
          onValueChange={onPress as any}
          trackColor={{ false: "#D1D5DB", true: theme.colors.primary }}
          thumbColor={value ? "#fff" : "#f4f3f4"}
        />
      ) : (
        <MaterialCommunityIcons
          name="chevron-right"
          size={24}
          color={theme.colors.onSurfaceDisabled}
        />
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
        Settings
      </Text>
      <Surface
        style={[styles.card, { backgroundColor: theme.colors.surface }]}
        elevation={1}
      >
        {renderSettingItem(
          "bell-outline",
          "Push Notifications",
          notifications,
          () => setNotifications(!notifications)
        )}
        <View style={styles.divider} />

        {/* Theme Selector Entry */}
        {renderSettingItem(
          "palette-outline",
          "App Theme",
          false,
          () => setThemeModalVisible(true),
          false
        )}

        <View style={styles.divider} />
        {renderSettingItem(
          "shield-check-outline",
          "Privacy & Security",
          false,
          () => {},
          false
        )}
        <View style={styles.divider} />
        {renderSettingItem(
          "help-circle-outline",
          "Help & Support",
          false,
          () => {},
          false
        )}
      </Surface>

      <ThemeSelector
        visible={themeModalVisible}
        onDismiss={() => setThemeModalVisible(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 16,
  },
  card: {
    borderRadius: 16,
    overflow: "hidden",
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
  },
  settingLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: "500",
  },
  divider: {
    height: 1,
    backgroundColor: "#F3F4F6",
    marginLeft: 64,
  },
});

export default ProfileSettings;
