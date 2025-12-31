import { useNotificationStore } from "@/src/stores/notification.store";
import {
  NotificationItem,
  NotificationType,
} from "@/src/types/notification.type";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import {
  FlatList,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { Avatar, IconButton, Text } from "react-native-paper";

export default function NotificationScreen() {
  const { notifications, markAsRead, markAllAsRead } = useNotificationStore();

  const getIcon = (type: NotificationType) => {
    switch (type) {
      case "like":
        return "heart";
      case "comment":
        return "comment-text";
      case "follow":
        return "account-plus";
      case "recipe":
        return "chef-hat";
      case "system":
      default:
        return "bell";
    }
  };

  const getIconColor = (type: NotificationType) => {
    switch (type) {
      case "like":
        return "#EF4444";
      case "comment":
        return "#3B82F6";
      case "follow":
        return "#10B981";
      case "recipe":
        return "#F59E0B";
      default:
        return "#6B7280";
    }
  };

  const getTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutes ago";
    return Math.floor(seconds) + " seconds ago";
  };

  const renderItem = ({ item }: { item: NotificationItem }) => (
    <TouchableOpacity
      style={[styles.itemContainer, !item.read && styles.unreadItem]}
      onPress={() => markAsRead(item.id)}
      activeOpacity={0.7}
    >
      <View style={styles.iconContainer}>
        {item.data?.image ? (
          <Avatar.Image size={48} source={{ uri: item.data.image }} />
        ) : (
          <View
            style={[
              styles.defaultIcon,
              { backgroundColor: getIconColor(item.type) + "20" },
            ]}
          >
            <MaterialCommunityIcons
              name={getIcon(item.type) as any}
              size={24}
              color={getIconColor(item.type)}
            />
          </View>
        )}
        {/* Small badge for notification type on avatar */}
        {item.data?.image && (
          <View style={styles.typeBadge}>
            <MaterialCommunityIcons
              name={getIcon(item.type) as any}
              size={12}
              color="#fff"
            />
          </View>
        )}
      </View>

      <View style={styles.contentContainer}>
        <View style={styles.headerRow}>
          <Text style={styles.title} numberOfLines={1}>
            {item.title}
          </Text>
          <Text style={styles.time}>{getTimeAgo(item.createdAt)}</Text>
        </View>
        <Text
          style={[styles.message, !item.read && styles.unreadMessage]}
          numberOfLines={2}
        >
          {item.message}
        </Text>
      </View>
      {!item.read && <View style={styles.unreadDot} />}
    </TouchableOpacity>
  );

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
        renderItem={renderItem}
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
  itemContainer: {
    flexDirection: "row",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
    alignItems: "center",
  },
  unreadItem: {
    backgroundColor: "#FEF2F2", // Very light red background for unread
  },
  iconContainer: {
    position: "relative",
    marginRight: 16,
  },
  defaultIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  typeBadge: {
    position: "absolute",
    bottom: -2,
    right: -2,
    backgroundColor: "#DC2626",
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#fff",
  },
  contentContainer: {
    flex: 1,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
    flex: 1,
    marginRight: 8,
  },
  time: {
    fontSize: 12,
    color: "#9CA3AF",
  },
  message: {
    fontSize: 14,
    color: "#6B7280",
    lineHeight: 20,
  },
  unreadMessage: {
    color: "#374151",
    fontWeight: "500",
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#DC2626",
    marginLeft: 8,
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
