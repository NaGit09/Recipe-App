import { useCategoryStore } from "@/src/stores/category.store";
import { useSearchStore } from "@/src/stores/search.store";
import { Category } from "@/src/types/categories";
import { Feather } from "@expo/vector-icons";
import React, { useMemo } from "react";
import { FlatList, StyleSheet, TouchableOpacity, View } from "react-native";
import { Text, TextInput, useTheme } from "react-native-paper";
import CategoryItem from "../Category/CategoryItem";

const SearchHeader = () => {
  const { keyword, setKeyword } = useSearchStore();
  const theme = useTheme();

  const { categories } = useCategoryStore();

  const displayCategories = useMemo(() => {
    const allCategory: Category = { id: "All", name: "All", status: "Active" };
    const filteredCategories = categories.filter(
      (c) => c.name.toLowerCase() !== "all"
    );
    return [allCategory, ...filteredCategories];
  }, [categories]);

  return (
    <View style={[styles.header, { backgroundColor: theme.colors.background }]}>
      <Text style={[styles.headerTitle, { color: theme.colors.onSurface }]}>
        Find Best Recipes
      </Text>
      <Text
        style={[
          styles.headerSubtitle,
          { color: theme.colors.onSurfaceVariant },
        ]}
      >
        For cooking
      </Text>

      <View
        style={[
          styles.searchContainer,
          {
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.outlineVariant,
            borderWidth: 1,
          },
        ]}
      >
        <Feather
          name="search"
          size={20}
          color={theme.colors.onSurfaceVariant}
          style={styles.searchIcon}
        />
        <TextInput
          style={[styles.searchInput, { backgroundColor: "transparent" }]}
          placeholder="Search recipes..."
          placeholderTextColor={theme.colors.onSurfaceDisabled}
          value={keyword}
          onChangeText={setKeyword}
          underlineColor="transparent"
          activeUnderlineColor="transparent"
          showSoftInputOnFocus={true}
          textColor={theme.colors.onSurface}
          theme={{ colors: { primary: "transparent" } }}
        />
        {keyword.length > 0 && (
          <TouchableOpacity onPress={() => setKeyword("")}>
            <Feather name="x" size={18} color={theme.colors.onSurfaceVariant} />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.categoriesWrapper}>
        <FlatList
          data={displayCategories}
          renderItem={({ item }) => <CategoryItem item={item} />}
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
});

export default SearchHeader;
