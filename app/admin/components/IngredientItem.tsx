import React from "react";
import { StyleSheet, View } from "react-native";
import { Avatar, Card, IconButton, Text, useTheme } from "react-native-paper";

interface IngredientItemProps {
  item: any;
  onDelete: (id: string) => void;
}

export default function IngredientItem({
  item,
  onDelete,
}: IngredientItemProps) {
  const theme = useTheme();

  return (
    <Card style={styles.card} mode="elevated">
      <Card.Content style={styles.cardContent}>
        <View style={styles.itemContainer}>
          {item.image ? (
            <Avatar.Image size={50} source={{ uri: item.image }} />
          ) : (
            <Avatar.Icon size={50} icon="food-apple" />
          )}
          <View style={styles.textContainer}>
            <Text variant="titleMedium" style={styles.title}>
              {item.name}
            </Text>
            <View style={styles.badgesContainer}>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>
                  {item.amount} {item.unit}
                </Text>
              </View>
              {item.price ? (
                <View
                  style={[
                    styles.badge,
                    { backgroundColor: theme.colors.secondaryContainer },
                  ]}
                >
                  <Text
                    style={[
                      styles.badgeText,
                      { color: theme.colors.onSecondaryContainer },
                    ]}
                  >
                    ${item.price}
                  </Text>
                </View>
              ) : null}
            </View>
          </View>
          <IconButton
            icon="delete"
            onPress={() => onDelete(item.id)}
            iconColor={theme.colors.error}
            size={24}
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
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  textContainer: {
    flex: 1,
    marginLeft: 16,
  },
  title: {
    fontWeight: "bold",
    marginBottom: 4,
  },
  badgesContainer: {
    flexDirection: "row",
    gap: 8,
    flexWrap: "wrap",
  },
  badge: {
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "500",
  },
});
