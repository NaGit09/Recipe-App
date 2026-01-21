import RecipeDetailAuthor from "@/src/components/RecipeDetail/RecipeDetailAuthor";
import RecipeDetailHeader from "@/src/components/RecipeDetail/RecipeDetailHeader";
import RecipeDetailIngredients from "@/src/components/RecipeDetail/RecipeDetailIngredients";
import RecipeDetailInstructions from "@/src/components/RecipeDetail/RecipeDetailInstructions";
import RecipeDetailNutrition from "@/src/components/RecipeDetail/RecipeDetailNutrition";
import RecipeDetailRelated from "@/src/components/RecipeDetail/RecipeDetailRelated";
import { useAuthStore } from "@/src/stores/auth.store";
import { useCartStore } from "@/src/stores/cart.store";
import { useRecipeStore } from "@/src/stores/recipe.store";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, ScrollView, StatusBar, StyleSheet, View } from "react-native";
import { ActivityIndicator, Text, useTheme } from "react-native-paper";

const RecipeDetail = () => {
  const { id } = useLocalSearchParams();

  const theme = useTheme();

  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});

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

  // Xử lý thêm công thức yêu thích
  const toggleFavorite = () => {
    if (isFavorite) {
      removeFavoriteRecipe(activeRecipe.id);
    } else {
      addFavoriteRecipe(activeRecipe.id);
    }
  };

  //  xử lý cập nhật số lượng nguyên liệu
  const updateQuantity = (ingredientId: string, change: number) => {
    setQuantities((prev) => {
      const current = prev[ingredientId] ?? 0;
      // Get base quantity from recipe if not in state yet
      const baseRaw = activeRecipe?.ingredients.find(
        (i) => i.ingredient.id === ingredientId,
      )?.quantity;
      const base = baseRaw ?? 0;
      const startValue = current === 0 ? base : current;

      const newValue = Math.max(1, startValue + change);
      return { ...prev, [ingredientId]: newValue };
    });
  };

  // Xử lý thêm nguyên liệu vào giỏ hàng
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
        <RecipeDetailHeader
          activeRecipe={activeRecipe}
          isFavorite={isFavorite}
          toggleFavorite={toggleFavorite}
        />

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

          <RecipeDetailIngredients
            activeRecipe={activeRecipe}
            quantities={quantities}
            updateQuantity={updateQuantity}
            handleAddAllToCart={handleAddAllToCart}
          />

          <RecipeDetailInstructions activeRecipe={activeRecipe} />

          <RecipeDetailNutrition activeRecipe={activeRecipe} />

          <RecipeDetailAuthor activeRecipe={activeRecipe} />

          <RecipeDetailRelated activeRecipe={activeRecipe} />
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
});

export default RecipeDetail;
