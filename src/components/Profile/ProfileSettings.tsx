import { useRouter } from "expo-router";
import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Surface, useTheme } from "react-native-paper";
import ProfileSettingItem from "./ProfileSettingItem";
import { ThemeSelector } from "./ThemeSelector";

const ProfileSettings = () => {
  const router = useRouter();
  const [notifications, setNotifications] = useState(true);
  const [themeModalVisible, setThemeModalVisible] = useState(false);
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <Text style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
        Settings
      </Text>
      <Surface
        style={[styles.card, { backgroundColor: theme.colors.surface }]}
        elevation={1}
      >
        <View style={styles.cardContent}>
          <ProfileSettingItem
            icon="bell-outline"
            label="Push Notifications"
            value={notifications}
            onPress={() => setNotifications(!notifications)}
            isSwitch={true}
          />
          <View style={styles.divider} />

          {/* Favorites Entry */}
          <ProfileSettingItem
            icon="heart-outline"
            label="Favorite Recipes"
            onPress={() => router.push("/favorite")}
          />
          <View style={styles.divider} />

          {/* Theme Selector Entry */}
          <ProfileSettingItem
            icon="palette-outline"
            label="App Theme"
            onPress={() => setThemeModalVisible(true)}
          />

          <View style={styles.divider} />
          <ProfileSettingItem
            icon="shield-check-outline"
            label="Privacy & Security"
            onPress={() => {}}
          />
          <View style={styles.divider} />
          <ProfileSettingItem
            icon="help-circle-outline"
            label="Help & Support"
            onPress={() => {}}
          />
        </View>
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
  },
  cardContent: {
    borderRadius: 16,
    overflow: "hidden",
  },
  divider: {
    height: 1,
    backgroundColor: "#F3F4F6",
    marginLeft: 64,
  },
});

export default ProfileSettings;
