import RecipeCard from "@/src/components/Recipe/RecipeCard";
import { useRecipeStore } from "@/src/stores/recipe.store";
import { Feather } from "@expo/vector-icons";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  View,
} from "react-native";
import { SegmentedButtons, Text, useTheme } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

export default function FavoriteScreen() {

  const theme = useTheme();

  const {
    favoriteRecipes,
    myRecipes,
    getMyFavoriteRecipes,
    getMyRecipes,
    loading,
  } = useRecipeStore();

  const [viewMode, setViewMode] = useState<"favorites" | "my_recipes">(
    "favorites",
  );

  // Fetch data by view mode
  const fetchData = useCallback(() => {
    if (viewMode === "favorites") {
      getMyFavoriteRecipes();
    } else {
      getMyRecipes();
    }
  }, [viewMode, getMyFavoriteRecipes, getMyRecipes]);

  // Fetch data
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Refresh data
  const onRefresh = useCallback(() => {
    fetchData();
  }, [fetchData]);

  const data = viewMode === "favorites" ? favoriteRecipes : myRecipes;

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      edges={["top", "left", "right"]}
    >
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
          My Library
        </Text>
      </View>

      <View style={styles.segmentContainer}>
        <SegmentedButtons
          value={viewMode}
          onValueChange={(value) =>
            setViewMode(value as "favorites" | "my_recipes")
          }
          buttons={[
            {
              value: "favorites",
              label: "Favorites",
              icon: "heart",
              showSelectedCheck: true,
              style: viewMode === "favorites" ? styles.activeSegment : null,
            },
            {
              value: "my_recipes",
              label: "My Recipes",
              icon: "chef-hat",
              showSelectedCheck: true,
              style: viewMode === "my_recipes" ? styles.activeSegment : null,
            },
          ]}
          style={styles.segmentedButtons}
        />
      </View>

      <FlatList
        data={data}
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
              <View
                style={[
                  styles.emptyIconContainer,
                  { backgroundColor: theme.colors.secondaryContainer },
                ]}
              >
                <Feather
                  name={viewMode === "favorites" ? "heart" : "book-open"}
                  size={48}
                  color={theme.colors.onSecondaryContainer}
                />
              </View>
              <Text
                style={[styles.emptyText, { color: theme.colors.onSurface }]}
              >
                {viewMode === "favorites"
                  ? "No Favorites Yet"
                  : "No Recipes Yet"}
              </Text>
              <Text
                style={[
                  styles.emptySubtext,
                  { color: theme.colors.onSurfaceVariant },
                ]}
              >
                {viewMode === "favorites"
                  ? "Start exploring and save your favorite recipes here!"
                  : "Unleash your inner chef and create your first recipe!"}
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
  header: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontWeight: "bold",
  },
  segmentContainer: {
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  segmentedButtons: {
    borderRadius: 8,
  },
  activeSegment: {
    // Optional: add specific styles for active segment if needed
  },
  listContent: {
    paddingBottom: 24,
  },
  columnWrapper: {
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  loadingContainer: {
    padding: 60,
    alignItems: "center",
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 80,
    paddingHorizontal: 32,
  },
  emptyIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
  },
  emptySubtext: {
    fontSize: 15,
    textAlign: "center",
    lineHeight: 22,
  },
});
