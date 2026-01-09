import NotificationCard from "@/src/components/Notification/NotificationCard";
import { useNotificationStore } from "@/src/stores/notification.store";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import {
  FlatList,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
} from "react-native";
import { IconButton, Text, useTheme } from "react-native-paper";

export default function NotificationScreen() {
  const { notifications, markAllAsRead } = useNotificationStore();
  const theme = useTheme();

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <StatusBar barStyle={theme.dark ? "light-content" : "dark-content"} />
      <View style={styles.header}>
        <View>
          <Text
            variant="headlineMedium"
            style={[styles.headerTitle, { color: theme.colors.onSurface }]}
          >
            Notifications
          </Text>
          <Text
            variant="bodyMedium"
            style={[styles.headerSubtitle, { color: theme.colors.secondary }]}
          >
            Stay updated with your recipes
          </Text>
        </View>
        <IconButton
          icon="check-all"
          iconColor={theme.colors.primary}
          size={24}
          onPress={markAllAsRead}
          style={styles.markReadBtn}
        />
      </View>

      <FlatList
        data={notifications}
        renderItem={({ item }) => <NotificationCard item={item} />}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <MaterialCommunityIcons
              name="bell-sleep-outline"
              size={64}
              color={theme.colors.outline}
            />
            <Text style={[styles.emptyText, { color: theme.colors.secondary }]}>
              No notifications yet
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  headerTitle: {
    fontWeight: "bold",
  },
  headerSubtitle: {
    marginTop: 4,
  },
  markReadBtn: {
    margin: 0,
  },
  listContent: {
    paddingBottom: 20,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 100,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
  },
});
