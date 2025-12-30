import { useCategoryStore } from "@/src/stores/category.store";
import { useSearchStore } from "@/src/stores/search.store";
import { Category } from "@/src/types/categories";
import { Feather } from "@expo/vector-icons";
import React, { useMemo } from "react";
import {
  FlatList,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { Text, TextInput } from "react-native-paper";

const SearchHeader = () => {
  const { keyword, setKeyword, activeCategory, setActiveCategory } =
    useSearchStore();
  const { categories } = useCategoryStore();

  const displayCategories = useMemo(() => {
    return categories;
  }, [categories]);

  const renderCategoryItem = ({ item }: { item: Category }) => {
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

  return (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>Find Best Recipes</Text>
      <Text style={styles.headerSubtitle}>For cooking</Text>

      <View style={styles.searchContainer}>
        <Feather
          name="search"
          size={20}
          color="#999"
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Search recipes..."
          placeholderTextColor="#999"
          value={keyword}
          onChangeText={setKeyword}
          underlineColor="transparent"
          activeUnderlineColor="transparent"
          showSoftInputOnFocus={true}
          // @ts-ignore
          theme={{ colors: { primary: "transparent" } }}
        />
        {keyword.length > 0 && (
          <TouchableOpacity onPress={() => setKeyword("")}>
            <Feather name="x" size={18} color="#999" />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.categoriesWrapper}>
        <FlatList
          data={displayCategories}
          renderItem={renderCategoryItem}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesList}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
    marginBottom: 10,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: "#2d2d2d",
    fontFamily: Platform.OS === "ios" ? "System" : "Roboto",
  },
  headerSubtitle: {
    fontSize: 28,
    fontWeight: "300",
    color: "#2d2d2d",
    marginBottom: 24,
    fontFamily: Platform.OS === "ios" ? "System" : "Roboto",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F7F8FA",
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 56,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "#EAEAEA",
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    backgroundColor: "transparent",
    fontSize: 16,
    height: 56,
    paddingHorizontal: 0,
  },
  categoriesWrapper: {
    marginBottom: 10,
  },
  categoriesList: {
    paddingRight: 20,
    gap: 12,
  },
  // Default (Inactive) State - mimicking a subtle card
  categoryCard: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: "#F3F4F6", // Light gray like index header/bg
    borderRadius: 24,
    marginRight: 8,
    borderWidth: 1,
    borderColor: "transparent",
  },
  // Active State - Matching Index.tsx "categoryCard" style exactly
  categoryCardActive: {
    backgroundColor: "#DC2626",
    elevation: 2,
    shadowColor: "#DC2626",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  categoryLabel: {
    fontSize: 14,
    color: "#6B7280", // Gray text for inactive
    fontWeight: "600",
  },
  categoryLabelActive: {
    color: "#fff", // White text for active
  },
});

export default SearchHeader;
