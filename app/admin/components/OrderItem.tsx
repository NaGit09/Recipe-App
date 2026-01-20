import React from "react";
import { StyleSheet, View } from "react-native";
import { Card, Text, useTheme } from "react-native-paper";

interface OrderItemProps {
  item: any;
  onPress: (id: string) => void;
}

const getStatusStyles = (status: string) => {
  switch (status) {
    case "SUCCESS":
      return { backgroundColor: "#E8F5E9", color: "#2E7D32", label: "Success" };
    case "PENDING":
      return { backgroundColor: "#FFF3E0", color: "#EF6C00", label: "Pending" };
    case "CANCELLED":
      return {
        backgroundColor: "#FFEBEE",
        color: "#C62828",
        label: "Cancelled",
      };
    default:
      return { backgroundColor: "#F5F5F5", color: "#757575", label: status };
  }
};

export default function OrderItem({ item, onPress }: OrderItemProps) {
  const theme = useTheme();
  const statusStyle = getStatusStyles(item.status);

  return (
    <Card style={styles.card} onPress={() => onPress(item.id)} mode="elevated">
      <Card.Content style={styles.cardContent}>
        <View style={{ flex: 1 }}>
          <Text variant="titleMedium" style={{ fontWeight: "bold" }}>
            Order #{item.id}
          </Text>
          <Text
            variant="bodyMedium"
            style={{ color: theme.colors.onSurfaceVariant }}
          >
            {item.customer} • {item.date}
          </Text>
          <Text variant="bodySmall">{item.items} Items</Text>
        </View>
        <View style={{ alignItems: "flex-end", gap: 6 }}>
          <Text
            variant="titleLarge"
            style={{ fontWeight: "bold", color: theme.colors.primary }}
          >
            ${item.total.toFixed(2)}
          </Text>
          <View
            style={{
              backgroundColor: statusStyle.backgroundColor,
              paddingHorizontal: 10,
              paddingVertical: 4,
              borderRadius: 6,
            }}
          >
            <Text
              style={{
                color: statusStyle.color,
                fontSize: 12,
                fontWeight: "600",
              }}
            >
              {statusStyle.label}
            </Text>
          </View>
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
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
  },
});
