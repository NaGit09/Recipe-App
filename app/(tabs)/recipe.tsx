import RecipeItem from "@/src/components/Recipe/RecipeItem";
import { useRecipeStore } from "@/src/stores/recipe.store";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import {
  FlatList,
  RefreshControl,
  StatusBar,
  StyleSheet,
  View,
} from "react-native";
import { ActivityIndicator, FAB, Text, useTheme } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

export default function RecipeScreen() {
  const router = useRouter();
  const { recipes, getAllRecipes, loading } = useRecipeStore();
  const theme = useTheme();

  useEffect(() => {
    getAllRecipes(0,20);
  }, []);

  const onRefresh = async () => {
    await getAllRecipes(0,20);
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      edges={["top", "left", "right"]}
    >
      <StatusBar barStyle={theme.dark ? "light-content" : "dark-content"} />
      <View
        style={[
          styles.header,
          {
            backgroundColor: theme.colors.surface,
            borderBottomColor: theme.colors.outlineVariant,
          },
        ]}
      >
        <Text
          variant="headlineMedium"
          style={[styles.headerTitle, { color: theme.colors.onSurface }]}
        >
          All Recipes
        </Text>
        <Text
          variant="bodyMedium"
          style={[styles.headerSubtitle, { color: theme.colors.secondary }]}
        >
          Discover delicious recipes from the community
        </Text>
      </View>

      {loading && recipes.length === 0 ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      ) : (
        <FlatList
          data={recipes}
          numColumns={2}
          columnWrapperStyle={styles.columnWrapper}
          renderItem={({ item, index }) => (
            <RecipeItem item={item} index={index} />
          )}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={onRefresh}
              colors={[theme.colors.primary]}
              tintColor={theme.colors.primary}
            />
          }
          ListEmptyComponent={
            !loading ? (
              <View style={styles.emptyState}>
                <Ionicons
                  name="book-outline"
                  size={60}
                  color={theme.colors.outline}
                />
                <Text
                  style={[styles.emptyTitle, { color: theme.colors.onSurface }]}
                >
                  No Recipes Found
                </Text>
                <Text
                  style={[
                    styles.emptySubtitle,
                    { color: theme.colors.secondary },
                  ]}
                >
                  Be the first to create one!
                </Text>
              </View>
            ) : null
          }
        />
      )}

      <FAB
        icon="plus"
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        color={theme.colors.onPrimary}
        onPress={() => router.push("/recipe/create")}
        label="Create Recipe"
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontWeight: "bold",
  },
  headerSubtitle: {
    marginTop: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  listContent: {
    padding: 16,
    paddingBottom: 80, // Space for FAB
  },
  columnWrapper: {
    justifyContent: "space-between",
  },
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 16,
  },
  emptySubtitle: {
    fontSize: 14,
    marginTop: 4,
  },
});
