import { useSearchStore } from '@/src/stores/search.store';
import { Category } from '@/src/types/categories';
import React from 'react'
import { StyleSheet, Text, TouchableOpacity } from "react-native";

const CategoryItem = ({ item }: { item: Category }) => {
    const { activeCategory, setActiveCategory } = useSearchStore();
  const isActive = activeCategory === item.id;
  return (
    <TouchableOpacity
      style={[styles.categoryCard, isActive && styles.categoryCardActive]}
      onPress={() => setActiveCategory(item.id)}
      activeOpacity={0.7}
    >
      <Text
        style={[styles.categoryLabel, isActive && styles.categoryLabelActive]}
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
    backgroundColor: "#fff",
    borderRadius: 20, // Pill shape
    marginRight: 10,
    borderWidth: 1,
    borderColor: "#F3F4F6",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  // Active State
  categoryCardActive: {
    backgroundColor: "#DC2626",
    borderColor: "#DC2626",
    shadowColor: "#DC2626",
    shadowOpacity: 0.3,
  },
  categoryLabel: {
    fontSize: 14,
    color: "#4B5563",
    fontWeight: "600",
  },
  categoryLabelActive: {
    color: "#fff",
    fontWeight: "700",
  }
});
export default CategoryItem