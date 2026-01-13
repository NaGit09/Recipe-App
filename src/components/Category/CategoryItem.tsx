import { useSearchStore } from "@/src/stores/search.store";
import { Category } from "@/src/types/categories";
import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { useTheme } from "react-native-paper";

const CategoryItem = ({ item }: { item: Category }) => {
  const { activeCategory, setActiveCategory } = useSearchStore();
  const theme = useTheme();
  const isActive = activeCategory === item.id;
  return (
    <TouchableOpacity
      style={[
        styles.categoryCard,
        {
          backgroundColor: isActive
            ? theme.colors.primary
            : theme.colors.surface,
          borderColor: isActive
            ? theme.colors.primary
            : theme.colors.outlineVariant,
        },
      ]}
      onPress={() => setActiveCategory(item.id)}
      activeOpacity={0.7}
    >
      <Text
        style={[
          styles.categoryLabel,
          {
            color: isActive
              ? theme.colors.onPrimary
              : theme.colors.onSurfaceVariant,
          },
        ]}
      >
        {item.name}
      </Text>
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  categoryCard: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20, // Pill shape
    marginRight: 10,
    borderWidth: 1,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  categoryLabel: {
    fontSize: 14,
    fontWeight: "600",
  },
});
export default CategoryItem;
