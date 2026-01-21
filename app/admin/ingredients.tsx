import { useIngredientStore } from "@/src/stores/ingredient.store";
import React, { useEffect } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import {
  ActivityIndicator,
  FAB,
  Searchbar,
  useTheme,
} from "react-native-paper";
import IngredientItem from "./components/IngredientItem";

import { useLocalSearch } from "@/src/hooks/useLocalSearch";

export default function IngredientManagementScreen() {
  const theme = useTheme();
  const { ingredients, getAllIngredients, loading, deleteIngredient } =
    useIngredientStore();

  useEffect(() => {
    getAllIngredients();
  }, []);

  const {
    searchQuery,
    setSearchQuery,
    filteredData: filteredIngredients,
  } = useLocalSearch(ingredients, (item, query) =>
    item.name.toLowerCase().includes(query.toLowerCase()),
  );

  const handleDelete = (id: string) => {
    deleteIngredient(id);
  };

  const renderIngredientItem = ({ item }: { item: any }) => (
    <IngredientItem item={item} onDelete={handleDelete} />
  );

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <Searchbar
        placeholder="Search ingredients"
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchBar}
      />

      {loading && ingredients.length === 0 ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" />
        </View>
      ) : (
        <FlatList
          data={filteredIngredients}
          renderItem={renderIngredientItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        />
      )}

      <FAB
        icon="plus"
        label="Add Ingredient"
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        onPress={() => console.log("Add Ingredient (Not Implemented)")}
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
    borderRadius: 12,
    backgroundColor: "#fff",
    elevation: 2,
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
