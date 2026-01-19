import SearchHeader from "@/src/components/Search/SearchHeader";
import SearchResult from "@/src/components/Search/SearchResult";
import { useCategoryStore } from "@/src/stores/category.store";
import { useRecipeStore } from "@/src/stores/recipe.store";
import { useSearchStore } from "@/src/stores/search.store";
import React, { useEffect } from "react";
import { StatusBar, StyleSheet } from "react-native";
import { useTheme } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

const Search = () => {
  const { getAllRecipes, getRecipesByCategoryId } = useRecipeStore();
  const { getAllCategories } = useCategoryStore();
  const { activeCategory } = useSearchStore();
  const theme = useTheme();

  useEffect(() => {
    const initData = async () => {
      try {
        await getAllCategories();
      } catch (e) {
        console.error("Failed to load initial data", e);
      }
    };
    initData();
  }, []);

  useEffect(() => {
    if (activeCategory === "All") {
      getAllRecipes(0, 10);
    } else {
      getRecipesByCategoryId(activeCategory, 0, 10);
    }
  }, [activeCategory]);

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      edges={["top", "left", "right"]}
    >
      <StatusBar barStyle={theme.dark ? "light-content" : "dark-content"} />
      <SearchResult ListHeaderComponent={<SearchHeader />} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default Search;
