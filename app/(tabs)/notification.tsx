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
import {IconButton, Text } from "react-native-paper";

export default function NotificationScreen() {
  const { notifications, markAllAsRead } = useNotificationStore();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <View>
          <Text variant="headlineMedium" style={styles.headerTitle}>
            Notifications
          </Text>
          <Text variant="bodyMedium" style={styles.headerSubtitle}>
            Stay updated with your recipes
          </Text>
        </View>
        <IconButton
          icon="check-all"
          iconColor="#DC2626"
          size={24}
          onPress={markAllAsRead}
          style={styles.markReadBtn}
        />
      </View>

      <FlatList
        data={notifications}
        renderItem={({item}) => <NotificationCard item={item} />}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <MaterialCommunityIcons
              name="bell-sleep-outline"
              size={64}
              color="#D1D5DB"
            />
            <Text style={styles.emptyText}>No notifications yet</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
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
    color: "#1F2937",
  },
  headerSubtitle: {
    color: "#6B7280",
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
    color: "#9CA3AF",
  },
});
