import { FadeInView } from "@/src/components/Animated/FadeInView";
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
    if (activeCategory && activeCategory !== "All") {
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

  const renderRecipeCard = ({
    item,
    index,
  }: {
    item: Recipe;
    index: number;
  }) => {
    return (
      <FadeInView delay={index * 100} style={styles.cardContainer}>
        <TouchableOpacity
          style={{ flex: 1 }}
          activeOpacity={0.9}
          onPress={() => router.push(`/recipe/${item.id}`)}
        >
          <View style={styles.cardImageContainer}>
            <Image
              source={{ uri: item.image }}
              style={styles.cardImage}
              contentFit="cover"
              transition={200}
            />
            <TouchableOpacity style={styles.likeButton}>
              <Ionicons name="heart-outline" size={20} color="#DC2626" />
            </TouchableOpacity>
          </View>
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle} numberOfLines={2}>
              {item.name}
            </Text>
            <View style={styles.cardMetaContainer}>
              <Feather name="clock" size={12} color="#DC2626" />
              <Text style={styles.cardMetaText}>{item.time} min</Text>
            </View>
          </View>
        </TouchableOpacity>
      </FadeInView>
    );
  };

  return (
    <FlatList
      data={filteredRecipes}
      renderItem={({ item, index }) => renderRecipeCard({ item, index })}
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
    width: (width - 55) / 2,
    backgroundColor: "#fff",
    borderRadius: 20,
    marginBottom: 0,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    overflow: "visible", // Allowed for shadow
  },
  cardImageContainer: {
    width: "100%",
    height: 150,
    backgroundColor: "#F3F4F6",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: "hidden",
    position: "relative",
  },
  cardImage: {
    width: "100%",
    height: "100%",
  },
  likeButton: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "#fff",
    padding: 6,
    borderRadius: 20,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  cardContent: {
    padding: 12,
    paddingBottom: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#1F2937",
    marginBottom: 8,
    lineHeight: 22,
  },
  cardMetaContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FEF2F2",
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  cardMetaText: {
    fontSize: 12,
    color: "#DC2626",
    fontWeight: "700",
    marginLeft: 4,
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
