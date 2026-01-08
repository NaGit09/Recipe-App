import { useRecipeStore } from "@/src/stores/recipe.store";
import { useSearchStore } from "@/src/stores/search.store";
import { Feather } from "@expo/vector-icons";
import React, { useMemo } from "react";
import { ActivityIndicator, FlatList, StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";
import RecipeCard from "../Recipe/RecipeCard";

interface SearchResultProps {
  ListHeaderComponent?: React.ComponentType<any> | React.ReactElement | null;
}

const SearchResult = ({ ListHeaderComponent }: SearchResultProps) => {
  const { recipes, loading: loadingRecipes } = useRecipeStore();
  const { keyword, activeCategory } = useSearchStore();

  const filteredRecipes = useMemo(() => {
    let result = recipes;

    if (activeCategory && activeCategory !== "All") {
      result = result.filter((r) => r.category?.id === activeCategory);
    }

    if (keyword.trim()) {
      const lower = keyword.toLowerCase();
      result = result.filter(
        (r) =>
          r.name.toLowerCase().includes(lower) ||
          r.description.toLowerCase().includes(lower)
      );
    }

    return result;
  }, [keyword, recipes, activeCategory]);

  return (
    <FlatList
      data={filteredRecipes}
      renderItem={({ item, index }) => <RecipeCard index={index} item={item} />}
      keyExtractor={(item) => item.id}
      numColumns={2}
      columnWrapperStyle={styles.columnWrapper}
      contentContainerStyle={styles.listContent}
      ListHeaderComponent={ListHeaderComponent}
      ListEmptyComponent={
        !loadingRecipes ? (
          <View style={styles.emptyContainer}>
            <Feather name="inbox" size={48} color="#ccc" />
            <Text style={styles.emptyText}>No recipes found</Text>
            <Text style={styles.emptySubtext}>
              Try adjusting your search or category
            </Text>
          </View>
        ) : (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#4DB6AC" />
          </View>
        )
      }
      showsVerticalScrollIndicator={false}
    />
  );
};

const styles = StyleSheet.create({
  listContent: {
    paddingBottom: 40,
  },
  columnWrapper: {
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  loadingContainer: {
    padding: 40,
    alignItems: "center",
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 100,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#444",
    marginTop: 20,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#888",
    marginTop: 8,
  },
});

export default SearchResult;
