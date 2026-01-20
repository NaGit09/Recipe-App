import RecipeCard from "@/src/components/Recipe/RecipeCard";
import { useRecipeStore } from "@/src/stores/recipe.store";
import { Feather } from "@expo/vector-icons";
import { useCallback, useEffect } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  View,
} from "react-native";
import { Appbar, Text, useTheme } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

export default function FavoriteScreen() {
  const theme = useTheme();
  
  const { favoriteRecipes, getMyFavoriteRecipes, loading } = useRecipeStore();

  useEffect(() => {
    getMyFavoriteRecipes();
  }, []);

  const onRefresh = useCallback(() => {
    getMyFavoriteRecipes();
  }, [getMyFavoriteRecipes]);

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      edges={["top", "left", "right"]}
    >
      <Appbar.Header
        mode="center-aligned"
        style={{ backgroundColor: theme.colors.background }}
      >
        <Appbar.Content title="Favorite Recipes" />
      </Appbar.Header>

      <FlatList
        data={favoriteRecipes}
        renderItem={({ item, index }) => (
          <RecipeCard index={index} item={item} />
        )}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={onRefresh}
            colors={[theme.colors.primary]}
          />
        }
        ListEmptyComponent={
          !loading ? (
            <View style={styles.emptyContainer}>
              <Feather name="heart" size={48} color={theme.colors.outline} />
              <Text
                style={[
                  styles.emptyText,
                  { color: theme.colors.onSurfaceVariant },
                ]}
              >
                No favorite recipes yet
              </Text>
              <Text
                style={[styles.emptySubtext, { color: theme.colors.outline }]}
              >
                Mark recipes as favorite to see them here
              </Text>
            </View>
          ) : (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={theme.colors.primary} />
            </View>
          )
        }
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 20,
    paddingTop: 10,
  },
  columnWrapper: {
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginBottom: 16,
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
    marginTop: 20,
  },
  emptySubtext: {
    fontSize: 14,
    marginTop: 8,
  },
});
