import { useCategoryStore } from "@/src/stores/category.store";
import { useRecipeStore } from "@/src/stores/recipe.store";
import { useSearchStore } from "@/src/stores/search.store";
import { Recipe } from "@/src/types/recipe.type";
import { Feather, Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import React, { useMemo } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { Text } from "react-native-paper";

const { width } = Dimensions.get("window");

interface SearchResultProps {
  ListHeaderComponent?: React.ComponentType<any> | React.ReactElement | null;
}

const SearchResult = ({ ListHeaderComponent }: SearchResultProps) => {
  const router = useRouter();
  const { recipes, loading: loadingRecipes } = useRecipeStore();
  const { keyword, activeCategory } = useSearchStore();
  const { isLoading: loadingCategories } = useCategoryStore();

  const filteredRecipes = useMemo(() => {
    let result = recipes;

    // 1. Filter by category
    if (activeCategory && activeCategory !== "all") {
      result = result.filter((r) => r.category?.id === activeCategory);
    }

    // 2. Filter by keyword
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

  const renderRecipeCard = ({ item }: { item: Recipe }) => {
    return (
      <TouchableOpacity style={styles.cardContainer} activeOpacity={0.9}>
        <View style={styles.cardImageContainer}>
          <Image
            source={{ uri: item.image }}
            style={styles.cardImage}
            contentFit="cover"
            transition={200}
          />
          <View style={styles.cardOverlay}>
            <View style={styles.ratingBadge}>
              <Ionicons name="star" size={10} color="#FFD700" />
              <Text style={styles.ratingText}>4.5</Text>
            </View>
            <TouchableOpacity style={styles.favoriteButton}>
              <Ionicons name="heart-outline" size={16} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.cardContent}>
          <Text style={styles.cardTitle} numberOfLines={2}>
            {item.name}
          </Text>
          <View style={styles.cardMeta}>
            <View style={styles.metaItem}>
              <Feather name="clock" size={12} color="#888" />
              <Text style={styles.metaText}>{item.time} min</Text>
            </View>
            <Text style={styles.metaText}>•</Text>
            <Text style={styles.metaText}>{item.category?.name || "Food"}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <FlatList
      data={filteredRecipes}
      renderItem={renderRecipeCard}
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
  cardContainer: {
    width: (width - 55) / 2, // calculate exact width for 2 columns with spacing
    backgroundColor: "#fff",
    borderRadius: 20,
    marginBottom: 0,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
    overflow: "hidden", // Important for borderRadius
  },
  cardImageContainer: {
    width: "100%",
    height: 180,
    position: "relative",
  },
  cardImage: {
    width: "100%",
    height: "100%",
  },
  cardOverlay: {
    position: "absolute",
    top: 10,
    left: 10,
    right: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  ratingBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.9)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  ratingText: {
    fontSize: 10,
    fontWeight: "bold",
    marginLeft: 4,
    color: "#333",
  },
  favoriteButton: {
    backgroundColor: "rgba(0,0,0,0.3)",
    padding: 6,
    borderRadius: 20,
  },
  cardContent: {
    padding: 12,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#333",
    marginBottom: 6,
    lineHeight: 20,
  },
  cardMeta: {
    flexDirection: "row",
    alignItems: "center",
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 6,
  },
  metaText: {
    fontSize: 12,
    color: "#999",
    marginLeft: 4,
    fontWeight: "500",
    marginRight: 4,
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
