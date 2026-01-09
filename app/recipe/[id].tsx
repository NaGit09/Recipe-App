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
import { ActivityIndicator, Text, useTheme } from "react-native-paper";

const { width } = Dimensions.get("window");

const RecipeDetail = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const theme = useTheme();
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
      <View
        style={[
          styles.loadingContainer,
          { backgroundColor: theme.colors.background },
        ]}
      >
        <ActivityIndicator size="large" color={theme.colors.primary} />
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
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
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
                color={isFavorite ? theme.colors.error : "#fff"}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.headerContent}>
            <View
              style={[
                styles.categoryBadge,
                { backgroundColor: theme.colors.primary },
              ]}
            >
              <Text
                style={[styles.categoryText, { color: theme.colors.onPrimary }]}
              >
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

        <View
          style={[
            styles.contentContainer,
            { backgroundColor: theme.colors.surface },
          ]}
        >
          <Text
            style={[
              styles.description,
              { color: theme.colors.onSurfaceVariant },
            ]}
          >
            {activeRecipe.description}
          </Text>

          <View style={styles.section}>
            <Text
              style={[styles.sectionTitle, { color: theme.colors.onSurface }]}
            >
              Ingredients
            </Text>
            <View style={styles.ingredientsList}>
              {activeRecipe.ingredients.map((item, index) => {
                const currentQty =
                  quantities[item.ingredient.id] ?? item.quantity;
                return (
                  <View
                    key={index}
                    style={[
                      styles.ingredientItem,
                      {
                        backgroundColor: theme.colors.surface,
                        borderColor: theme.colors.outlineVariant,
                      },
                    ]}
                  >
                    <View
                      style={[
                        styles.ingredientIcon,
                        { backgroundColor: theme.colors.surfaceVariant },
                      ]}
                    >
                      <MaterialCommunityIcons
                        name="food-apple-outline"
                        size={20}
                        color={theme.colors.primary}
                      />
                    </View>
                    <Text
                      style={[
                        styles.ingredientName,
                        { color: theme.colors.onSurface },
                      ]}
                    >
                      {item.ingredient.name}
                    </Text>
                    {/* Quantity Control */}
                    <View
                      style={[
                        styles.quantityContainer,
                        {
                          backgroundColor: theme.colors.surfaceVariant,
                          borderColor: theme.colors.outlineVariant,
                        },
                      ]}
                    >
                      <TouchableOpacity
                        onPress={() => updateQuantity(item.ingredient.id, -1)}
                        style={[
                          styles.qtyBtn,
                          { backgroundColor: theme.colors.surface },
                        ]}
                      >
                        <Feather
                          name="minus"
                          size={14}
                          color={theme.colors.onSurfaceVariant}
                        />
                      </TouchableOpacity>
                      <Text
                        style={[
                          styles.quantityValue,
                          { color: theme.colors.onSurface },
                        ]}
                      >
                        {currentQty} {item.ingredient.unit}
                      </Text>
                      <TouchableOpacity
                        onPress={() => updateQuantity(item.ingredient.id, 1)}
                        style={[
                          styles.qtyBtn,
                          { backgroundColor: theme.colors.surface },
                        ]}
                      >
                        <Feather
                          name="plus"
                          size={14}
                          color={theme.colors.onSurfaceVariant}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                );
              })}
            </View>
            <TouchableOpacity
              style={[
                styles.addAllButton,
                {
                  backgroundColor: theme.colors.primary,
                  shadowColor: theme.colors.primary,
                },
              ]}
              onPress={handleAddAllToCart}
            >
              <Feather
                name="shopping-cart"
                size={20}
                color={theme.colors.onPrimary}
              />
              <Text
                style={[styles.addAllText, { color: theme.colors.onPrimary }]}
              >
                Add Ingredients to Cart
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.section}>
            <Text
              style={[styles.sectionTitle, { color: theme.colors.onSurface }]}
            >
              Instructions
            </Text>
            <View
              style={[
                styles.instructionsContainer,
                { backgroundColor: theme.colors.surfaceVariant },
              ]}
            >
              <Text
                style={[
                  styles.instructionText,
                  { color: theme.colors.onSurface },
                ]}
              >
                {activeRecipe.instructions?.replace(/\\n/g, "\n")}
              </Text>
            </View>
          </View>

          {activeRecipe.nutritions.length > 0 && (
            <View style={styles.section}>
              <Text
                style={[styles.sectionTitle, { color: theme.colors.onSurface }]}
              >
                Nutrition
              </Text>
              <View style={styles.nutritionGrid}>
                {activeRecipe.nutritions.map((item, index) => (
                  <View
                    key={index}
                    style={[
                      styles.nutritionItem,
                      { backgroundColor: theme.colors.primaryContainer },
                    ]}
                  >
                    <Text
                      style={[
                        styles.nutritionValue,
                        { color: theme.colors.primary },
                      ]}
                    >
                      {item.value}
                    </Text>
                    <Text
                      style={[
                        styles.nutritionUnit,
                        { color: theme.colors.primary },
                      ]}
                    >
                      {item.nutrition.unit}
                    </Text>
                    <Text
                      style={[
                        styles.nutritionName,
                        { color: theme.colors.onSurfaceVariant },
                      ]}
                    >
                      {item.nutrition.name}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Author Section */}
          <View style={styles.section}>
            <Text
              style={[styles.sectionTitle, { color: theme.colors.onSurface }]}
            >
              About the Author
            </Text>
            <View
              style={[
                styles.authorCard,
                { backgroundColor: theme.colors.surfaceVariant },
              ]}
            >
              <Image
                source={{
                  uri:
                    activeRecipe.author?.avatar ||
                    "https://via.placeholder.com/50",
                }}
                style={[
                  styles.authorAvatar,
                  { backgroundColor: theme.colors.surface },
                ]}
              />
              <View style={styles.authorInfo}>
                <Text
                  style={[styles.authorName, { color: theme.colors.onSurface }]}
                >
                  {activeRecipe.author?.username || "Unknown Chef"}
                </Text>
                <Text
                  style={[
                    styles.authorBio,
                    { color: theme.colors.onSurfaceVariant },
                  ]}
                  numberOfLines={2}
                >
                  {activeRecipe.author?.bio ||
                    "Passionate about cooking and sharing delicious recipes."}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Text
              style={[styles.sectionTitle, { color: theme.colors.onSurface }]}
            >
              More from {activeRecipe.author?.username || "Author"}
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.relatedRecipesList}
            >
              <View style={styles.relatedRecipeCard}>
                <View
                  style={[
                    styles.relatedRecipeImagePlaceholder,
                    { backgroundColor: theme.colors.surfaceVariant },
                  ]}
                >
                  <MaterialCommunityIcons
                    name="chef-hat"
                    size={24}
                    color={theme.colors.onSurfaceVariant}
                  />
                </View>
                <Text
                  style={[
                    styles.relatedRecipeTitle,
                    { color: theme.colors.onSurface },
                  ]}
                  numberOfLines={1}
                >
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
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: "flex-start",
    marginBottom: 10,
  },
  categoryText: {
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
    marginTop: -20,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 24,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 30,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
  },
  ingredientsList: {
    gap: 12,
  },
  ingredientItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 16,
    borderWidth: 1,
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
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  ingredientName: {
    flex: 1,
    fontSize: 16,
    fontWeight: "600",
    marginRight: 8,
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 4,
    borderRadius: 12,
    borderWidth: 1,
  },
  qtyBtn: {
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
    fontWeight: "700",
    marginHorizontal: 12,
    minWidth: 40,
    textAlign: "center",
  },
  addAllButton: {
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  addAllText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  instructionsContainer: {
    padding: 20,
    borderRadius: 16,
  },
  instructionText: {
    fontSize: 16,
    lineHeight: 26,
  },
  nutritionGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  nutritionItem: {
    width: "30%",
    padding: 12,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  nutritionValue: {
    fontSize: 18,
    fontWeight: "bold",
  },
  nutritionUnit: {
    fontSize: 12,
    marginBottom: 4,
  },
  nutritionName: {
    fontSize: 12,
  },
  authorCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 16,
  },
  authorAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 16,
  },
  authorInfo: {
    flex: 1,
  },
  authorName: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  authorBio: {
    fontSize: 12,
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
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  relatedRecipeTitle: {
    fontSize: 14,
    fontWeight: "600",
  },
});

export default RecipeDetail;
