import { UserInfo } from "@/src/types/user.type";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import { Avatar, Surface, Text, useTheme } from "react-native-paper";
const { width } = Dimensions.get("window");

const ProfileCart = ({ formData }: { formData: Partial<UserInfo> }) => {
  const theme = useTheme();

  return (
    <Surface
      style={[styles.profileCard, { backgroundColor: theme.colors.surface }]}
      elevation={4}
    >
      <View style={styles.avatarContainer}>
        <Avatar.Image
          size={100}
          source={{
            uri: formData.avatar || "https://via.placeholder.com/100",
          }}
          style={{ backgroundColor: theme.colors.surfaceVariant }}
        />
        <View
          style={[
            styles.editBadge,
            {
              backgroundColor: theme.colors.primary,
              borderColor: theme.colors.surface,
            },
          ]}
        >
          <MaterialCommunityIcons
            name="camera"
            size={16}
            color={theme.colors.onPrimary}
          />
        </View>
      </View>

      <Text
        variant="titleLarge"
        style={[styles.username, { color: theme.colors.onSurface }]}
      >
        {formData.username || "User"}
      </Text>
      <Text
        variant="bodyMedium"
        style={[styles.role, { color: theme.colors.secondary }]}
      >
        {formData.role || "Member"}
      </Text>

      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: theme.colors.onSurface }]}>
            12
          </Text>
          <Text style={[styles.statLabel, { color: theme.colors.secondary }]}>
            Recipes
          </Text>
        </View>
        <View
          style={[
            styles.statDivider,
            { backgroundColor: theme.colors.outlineVariant },
          ]}
        />
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: theme.colors.onSurface }]}>
            128
          </Text>
          <Text style={[styles.statLabel, { color: theme.colors.secondary }]}>
            Followers
          </Text>
        </View>
        <View
          style={[
            styles.statDivider,
            { backgroundColor: theme.colors.outlineVariant },
          ]}
        />
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: theme.colors.onSurface }]}>
            45
          </Text>
          <Text style={[styles.statLabel, { color: theme.colors.secondary }]}>
            Following
          </Text>
        </View>
      </View>
    </Surface>
  );
};
const styles = StyleSheet.create({
  profileCard: {
    borderRadius: 24,
    padding: 24,
    alignItems: "center",
    marginBottom: 24,
  },

  avatarContainer: { marginBottom: 16 },
  editBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
  },

  username: { fontWeight: "bold" },
  role: { marginBottom: 20 },

  statsRow: { flexDirection: "row", width: "100%" },
  statItem: { flex: 1, alignItems: "center" },
  statValue: { fontSize: 18, fontWeight: "bold" },
  statLabel: { fontSize: 12 },
  statDivider: { width: 1 },
});
export default ProfileCart;
