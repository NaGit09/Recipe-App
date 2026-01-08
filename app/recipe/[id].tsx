import { useAuthStore } from "@/src/stores/auth.store";
import { useCartStore } from "@/src/stores/cart.store";
import { useRecipeStore } from "@/src/stores/recipe.store";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect } from "react";
import {
  Alert,
  Dimensions,
  ScrollView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { ActivityIndicator, Text } from "react-native-paper";

const { width } = Dimensions.get("window");

const RecipeDetail = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [quantities, setQuantities] = React.useState<{ [key: string]: number }>(
    {}
  );
  const {
    activeRecipe,
    getRecipeById,
    loading,
    addFavoriteRecipe,
    removeFavoriteRecipe,
    favoriteRecipes,
  } = useRecipeStore();
  const { addToCart } = useCartStore();
  const { user } = useAuthStore();

  useEffect(() => {
    if (id && typeof id === "string") {
      getRecipeById(id);
    }
  }, [id]);

  if (loading || !activeRecipe) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#DC2626" />
      </View>
    );
  }

  const isFavorite = favoriteRecipes.some((r) => r.id === activeRecipe.id);

  const toggleFavorite = () => {
    if (isFavorite) {
      removeFavoriteRecipe(activeRecipe.id);
    } else {
      addFavoriteRecipe(activeRecipe.id);
    }
  };

  const updateQuantity = (ingredientId: string, change: number) => {
    setQuantities((prev) => {
      const current = prev[ingredientId] ?? 0;
      // Get base quantity from recipe if not in state yet
      const baseRaw = activeRecipe?.ingredients.find(
        (i) => i.ingredient.id === ingredientId
      )?.quantity;
      const base = baseRaw ?? 0;
      const startValue = current === 0 ? base : current;

      const newValue = Math.max(1, startValue + change);
      return { ...prev, [ingredientId]: newValue };
    });
  };

  const handleAddAllToCart = async () => {
    if (!user?.id || !activeRecipe) {
      Alert.alert("Error", "Please login to add to cart");
      return;
    }

    const ingredientsPayload = activeRecipe.ingredients.map((item) => ({
      id: item.ingredient.id,
      quantity: quantities[item.ingredient.id] ?? item.quantity,
    }));

    const req = {
      recipeId: activeRecipe.id,
      quantity: 1,
      ingredients: ingredientsPayload,
    };

    await addToCart(user.id, req);
    Alert.alert("Success", "All ingredients added to cart!");
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: activeRecipe.image }}
            style={styles.image}
            contentFit="cover"
          />
          <View style={styles.imageOverlay} />

          <View style={styles.headerButtons}>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => router.back()}
            >
              <Feather name="arrow-left" size={24} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={toggleFavorite}
            >
              <MaterialCommunityIcons
                name={isFavorite ? "heart" : "heart-outline"}
                size={24}
                color={isFavorite ? "#DC2626" : "#fff"}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.headerContent}>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>
                {activeRecipe.category?.name}
              </Text>
            </View>
            <Text style={styles.title}>{activeRecipe.name}</Text>
            <View style={styles.metaContainer}>
              <Feather name="clock" size={16} color="#eee" />
              <Text style={styles.metaText}>{activeRecipe.time} mins</Text>
              <Text style={styles.metaDivider}>•</Text>
              <Feather name="bar-chart-2" size={16} color="#eee" />
              <Text style={styles.metaText}>Energy</Text>
            </View>
          </View>
        </View>

        <View style={styles.contentContainer}>
          <Text style={styles.description}>{activeRecipe.description}</Text>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Ingredients</Text>
            <View style={styles.ingredientsList}>
              {activeRecipe.ingredients.map((item, index) => {
                const currentQty =
                  quantities[item.ingredient.id] ?? item.quantity;
                return (
                  <View key={index} style={styles.ingredientItem}>
                    <View style={styles.ingredientIcon}>
                      <MaterialCommunityIcons
                        name="food-apple-outline"
                        size={20}
                        color="#DC2626"
                      />
                    </View>
                    <Text style={styles.ingredientName}>
                      {item.ingredient.name}
                    </Text>
                    {/* Quantity Control */}
                    <View style={styles.quantityContainer}>
                      <TouchableOpacity
                        onPress={() => updateQuantity(item.ingredient.id, -1)}
                        style={styles.qtyBtn}
                      >
                        <Feather name="minus" size={14} color="#666" />
                      </TouchableOpacity>
                      <Text style={styles.quantityValue}>
                        {currentQty} {item.ingredient.unit}
                      </Text>
                      <TouchableOpacity
                        onPress={() => updateQuantity(item.ingredient.id, 1)}
                        style={styles.qtyBtn}
                      >
                        <Feather name="plus" size={14} color="#666" />
                      </TouchableOpacity>
                    </View>
                  </View>
                );
              })}
            </View>
            <TouchableOpacity
              style={styles.addAllButton}
              onPress={handleAddAllToCart}
            >
              <Feather name="shopping-cart" size={20} color="#fff" />
              <Text style={styles.addAllText}>Add Ingredients to Cart</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Instructions</Text>
            <View style={styles.instructionsContainer}>
              <Text style={styles.instructionText}>
                {activeRecipe.instructions?.replace(/\\n/g, "\n")}
              </Text>
            </View>
          </View>

          {activeRecipe.nutritions.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Nutrition</Text>
              <View style={styles.nutritionGrid}>
                {activeRecipe.nutritions.map((item, index) => (
                  <View key={index} style={styles.nutritionItem}>
                    <Text style={styles.nutritionValue}>{item.value}</Text>
                    <Text style={styles.nutritionUnit}>
                      {item.nutrition.unit}
                    </Text>
                    <Text style={styles.nutritionName}>
                      {item.nutrition.name}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Author Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About the Author</Text>
            <View style={styles.authorCard}>
              <Image
                source={{
                  uri:
                    activeRecipe.author?.avatar ||
                    "https://via.placeholder.com/50",
                }}
                style={styles.authorAvatar}
              />
              <View style={styles.authorInfo}>
                <Text style={styles.authorName}>
                  {activeRecipe.author?.username || "Unknown Chef"}
                </Text>
                <Text style={styles.authorBio} numberOfLines={2}>
                  {activeRecipe.author?.bio ||
                    "Passionate about cooking and sharing delicious recipes."}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              More from {activeRecipe.author?.username || "Author"}
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.relatedRecipesList}
            >
              <View style={styles.relatedRecipeCard}>
                <View style={styles.relatedRecipeImagePlaceholder}>
                  <MaterialCommunityIcons
                    name="chef-hat"
                    size={24}
                    color="#aaa"
                  />
                </View>
                <Text style={styles.relatedRecipeTitle} numberOfLines={1}>
                  Coming Soon
                </Text>
              </View>
            </ScrollView>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollContent: {
    paddingBottom: 40,
  },
  imageContainer: {
    height: 350,
    width: width,
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  headerButtons: {
    position: "absolute",
    top: 50, // Safe area approximation
    left: 20,
    right: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    zIndex: 10,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
    backdropFilter: "blur(10px)",
  },
  headerContent: {
    position: "absolute",
    bottom: 30,
    left: 20,
    right: 20,
  },
  categoryBadge: {
    backgroundColor: "#DC2626",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: "flex-start",
    marginBottom: 10,
  },
  categoryText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  title: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 10,
  },
  metaContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  metaText: {
    color: "#eee",
    marginLeft: 6,
    fontSize: 14,
    fontWeight: "500",
  },
  metaDivider: {
    color: "#eee",
    marginHorizontal: 10,
  },
  contentContainer: {
    backgroundColor: "#fff",
    marginTop: -20,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 24,
  },
  description: {
    fontSize: 16,
    color: "#666",
    lineHeight: 24,
    marginBottom: 30,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 16,
  },
  ingredientsList: {
    gap: 12,
  },
  ingredientItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#F3F4F6",
    // Slight shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  ingredientIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#FEF2F2",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  ingredientName: {
    flex: 1,
    fontSize: 16,
    color: "#1F2937",
    fontWeight: "600",
    marginRight: 8,
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    padding: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#F3F4F6",
  },
  qtyBtn: {
    backgroundColor: "#fff",
    width: 28,
    height: 28,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    // Shadow for buttons
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  quantityValue: {
    fontSize: 14,
    color: "#374151",
    fontWeight: "700",
    marginHorizontal: 12,
    minWidth: 40,
    textAlign: "center",
  },
  addAllButton: {
    backgroundColor: "#DC2626",
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    shadowColor: "#DC2626",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  addAllText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  instructionsContainer: {
    backgroundColor: "#F9FAFB",
    padding: 20,
    borderRadius: 16,
  },
  instructionText: {
    fontSize: 16,
    color: "#444",
    lineHeight: 26,
  },
  nutritionGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  nutritionItem: {
    width: "30%",
    backgroundColor: "#F0F9FF", // Light blue bg
    padding: 12,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  nutritionValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0284C7",
  },
  nutritionUnit: {
    fontSize: 12,
    color: "#0284C7",
    marginBottom: 4,
  },
  nutritionName: {
    fontSize: 12,
    color: "#64748B",
  },
  authorCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    padding: 16,
    borderRadius: 16,
  },
  authorAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 16,
    backgroundColor: "#E5E7EB",
  },
  authorInfo: {
    flex: 1,
  },
  authorName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  authorBio: {
    fontSize: 12,
    color: "#666",
    lineHeight: 18,
  },
  relatedRecipesList: {
    gap: 16,
    paddingRight: 24,
  },
  relatedRecipeCard: {
    width: 140,
    marginRight: 12,
  },
  relatedRecipeImagePlaceholder: {
    width: 140,
    height: 100,
    backgroundColor: "#F3F4F6",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  relatedRecipeTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
});

export default RecipeDetail;
