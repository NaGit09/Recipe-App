import { useCategoryStore } from "@/src/stores/category.store";
import { useSearchStore } from "@/src/stores/search.store";
import { Category } from "@/src/types/categories";
import { Feather } from "@expo/vector-icons";
import React, { useMemo } from "react";
import { FlatList, StyleSheet, TouchableOpacity, View } from "react-native";
import { Text, TextInput } from "react-native-paper";

const SearchHeader = () => {
  const { keyword, setKeyword, activeCategory, setActiveCategory } =
    useSearchStore();
  const { categories } = useCategoryStore();

  const displayCategories = useMemo(() => {
    const allCategory: Category = { id: "All", name: "All", status: "Active" };
    const filteredCategories = categories.filter(
      (c) => c.name.toLowerCase() !== "all"
    );
    return [allCategory, ...filteredCategories];
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
    marginBottom: 0,
    backgroundColor: "#fff",
  },
  headerTitle: {
    display: "none",
  },
  headerSubtitle: {
    display: "none",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 52,
    marginBottom: 20,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    backgroundColor: "transparent",
    fontSize: 16,
    height: 52,
    paddingHorizontal: 0,
  },
  categoriesWrapper: {
    marginBottom: 10,
  },
  categoriesList: {
    paddingRight: 20,
  },
  // Default (Inactive) State
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
  },
});

export default SearchHeader;
