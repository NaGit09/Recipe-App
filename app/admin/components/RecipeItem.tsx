import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, View } from "react-native";
import {
  Button,
  Card,
  Chip,
  IconButton,
  Text,
  useTheme,
} from "react-native-paper";

interface RecipeItemProps {
  item: any;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function RecipeItem({
  item,
  onEdit,
  onDelete,
}: RecipeItemProps) {
  const theme = useTheme();
  const router = useRouter();

  return (
    <Card
      style={styles.card}
      mode="elevated"
      onPress={() => router.push(`/recipe/${item.id}`)}
    >
      <View style={styles.cardInner}>
        <Card.Cover source={{ uri: item.image }} style={styles.cardImage} />
        <Card.Content style={{ paddingTop: 16 }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "flex-start",
            }}
          >
            <View style={{ flex: 1, marginRight: 8 }}>
              <Text variant="titleLarge" style={{ fontWeight: "bold" }}>
                {item.name}
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginTop: 8,
                  flexWrap: "wrap",
                  gap: 8,
                }}
              >
                <Chip
                  icon="shape"
                  compact
                  style={{ backgroundColor: theme.colors.secondaryContainer }}
                  textStyle={{ fontSize: 12 }}
                >
                  {item.category?.name || "Uncategorized"}
                </Chip>
                <Chip
                  icon="clock-outline"
                  compact
                  textStyle={{ fontSize: 12 }}
                  style={{ backgroundColor: theme.colors.surfaceVariant }}
                >
                  {item.time || 30} min
                </Chip>
              </View>
            </View>
            <IconButton
              icon="dots-vertical"
              onPress={() => {}}
              size={20}
              style={{ margin: 0 }}
            />
          </View>

          <Text
            numberOfLines={2}
            variant="bodyMedium"
            style={{
              color: theme.colors.onSurfaceVariant,
              marginTop: 12,
              marginBottom: 8,
            }}
          >
            {item.description}
          </Text>
        </Card.Content>
        <Card.Actions
          style={{
            justifyContent: "flex-end",
            paddingHorizontal: 16,
            paddingBottom: 16,
            borderTopWidth: 1,
            borderTopColor: theme.colors.outlineVariant,
            paddingTop: 8,
          }}
        >
          <Button
            mode="text"
            onPress={() => onEdit(item.id)}
            textColor={theme.colors.primary}
            icon="pencil"
          >
            Edit
          </Button>
          <Button
            mode="text"
            textColor={theme.colors.error}
            onPress={() => onDelete(item.id)}
            icon="delete"
          >
            Delete
          </Button>
        </Card.Actions>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 4,
    borderRadius: 16,
    backgroundColor: "#fff",
  },
  cardInner: {
    borderRadius: 16,
    overflow: "hidden",
  },
  cardImage: {
    height: 180,
    borderRadius: 0,
  },
});
