import { NotificationItem } from "@/src/types/notification.type";
import { getIcon, getIconColor, getTimeAgo } from "@/src/utils/helper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { TouchableOpacity, View, Text, StyleSheet } from "react-native";
import React from "react";
import { Avatar } from "react-native-paper";
import { useNotificationStore } from "@/src/stores/notification.store";

const NotificationCard = ({ item }: { item: NotificationItem }) => {
  const { markAsRead } = useNotificationStore();
  return (
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
};

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: "row",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
    alignItems: "center",
  },
  unreadItem: {
    backgroundColor: "#FEF2F2",
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
});
export default NotificationCard;
