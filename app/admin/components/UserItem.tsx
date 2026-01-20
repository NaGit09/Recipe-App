import { UserInfo } from "@/src/types/user.type";
import React from "react";
import { StyleSheet, View } from "react-native";
import { Avatar, Card, IconButton, Text, useTheme } from "react-native-paper";

interface UserItemProps {
  item: UserInfo;
  onEdit: (user: UserInfo) => void;
  onDelete: (id: string) => void;
}

export default function UserItem({ item, onEdit, onDelete }: UserItemProps) {
  const theme = useTheme();

  return (
    <Card style={styles.card} mode="elevated">
      <Card.Content style={styles.cardContent}>
        <View style={styles.userInfoContainer}>
          <Avatar.Image
            size={50}
            source={{
              uri: item.avatar || `https://i.pravatar.cc/150?u=${item.id}`,
            }}
          />
          <View style={styles.textContainer}>
            <Text variant="titleMedium" style={{ fontWeight: "bold" }}>
              {item.username}
            </Text>
            <Text variant="bodySmall" style={{ color: theme.colors.outline }}>
              {item.email}
            </Text>
            <View style={styles.badgesContainer}>
              <View
                style={[
                  styles.badge,
                  {
                    backgroundColor:
                      item.role === "admin"
                        ? theme.colors.primaryContainer
                        : theme.colors.surfaceVariant,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.badgeText,
                    {
                      color:
                        item.role === "admin"
                          ? theme.colors.primary
                          : theme.colors.onSurfaceVariant,
                    },
                  ]}
                >
                  {item.role || "User"}
                </Text>
              </View>
              {/* Status badge - defaults to Active for now */}
              <View
                style={[
                  styles.badge,
                  {
                    backgroundColor: "#E8F5E9",
                  },
                ]}
              >
                <Text
                  style={[
                    styles.badgeText,
                    {
                      color: "#2E7D32",
                    },
                  ]}
                >
                  Active
                </Text>
              </View>
            </View>
          </View>
        </View>
        <View style={styles.actionsContainer}>
          <IconButton
            icon="pencil"
            size={20}
            iconColor={theme.colors.primary}
            onPress={() => onEdit(item)}
          />
          <IconButton
            icon="delete"
            size={20}
            iconColor={theme.colors.error}
            onPress={() => onDelete(item.id)}
          />
        </View>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 4,
    borderRadius: 16,
    backgroundColor: "#fff",
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 8,
  },
  userInfoContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  textContainer: {
    marginLeft: 16,
    flex: 1,
  },
  badgesContainer: {
    flexDirection: "row",
    marginTop: 6,
    gap: 6,
  },
  actionsContainer: {
    flexDirection: "row",
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "transparent",
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "600",
  },
});
