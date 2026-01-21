import { useRecipeStore } from "@/src/stores/recipe.store";
import React, { useEffect } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import {
  ActivityIndicator,
  FAB,
  Searchbar,
  useTheme,
} from "react-native-paper";
import RecipeItem from "./components/RecipeItem";

export default function RecipeManagementScreen() {
  const theme = useTheme();
  const { recipes, getAllRecipes, loading } = useRecipeStore();
  const [searchQuery, setSearchQuery] = React.useState("");

  useEffect(() => {
    getAllRecipes(0, 20);
  }, []);

  const onChangeSearch = (query: string) => setSearchQuery(query);

  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await getAllRecipes(0, 20);
    setRefreshing(false);
  }, []);

  const renderRecipeItem = ({ item }: { item: any }) => (
    <RecipeItem
      item={item}
      onEdit={(id) => console.log("Edit", id)}
      onDelete={(id) => console.log("Delete", id)}
    />
  );

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <Searchbar
        placeholder="Search recipes"
        onChangeText={onChangeSearch}
        value={searchQuery}
        style={styles.searchBar}
      />

      {loading && recipes.length === 0 ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" />
        </View>
      ) : (
        <FlatList
          data={recipes}
          renderItem={renderRecipeItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
          refreshing={refreshing}
          onRefresh={onRefresh}
        />
      )}

      <FAB
        icon="plus"
        label="New Recipe"
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        onPress={() => console.log("Add Recipe")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  searchBar: {
    marginBottom: 16,
    elevation: 2,
    borderRadius: 12,
    backgroundColor: "#fff",
  },
  listContent: {
    paddingBottom: 80,
  },
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
    elevation: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
