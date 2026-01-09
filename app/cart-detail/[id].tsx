import { getCartItem } from "@/src/services/api/cart.api";
import { useAuthStore } from "@/src/stores/auth.store";
import { useCartStore } from "@/src/stores/cart.store";
import { CartItemDetail } from "@/src/types/cart.type";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { ActivityIndicator, Surface, Text, useTheme } from "react-native-paper";

export default function CartDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { user } = useAuthStore();
  const theme = useTheme();
  const isExiting = useRef(false);

  const [cartDetail, setCartDetail] = useState<CartItemDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const removeFromCart = useCartStore((state) => state.removeFromCart);

  const fetchDetail = async () => {
    if (!user?.id || !id || isExiting.current) return;
    try {
      setLoading(true);
      const recipeId = Array.isArray(id) ? id[0] : id;
      const response: any = await getCartItem(user.id, recipeId);

      if (!isExiting.current) {
        setCartDetail(response);
      }
    } catch (err: any) {
      if (isExiting.current) return;

      if (err.code === 404 || err.status === 404) {
        setError("Item not found in cart");
      } else {
        setError("Failed to load cart detail");
      }
    } finally {
      if (!isExiting.current) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchDetail();
  }, [user?.id, id]);

  const handleRemoveAll = async () => {
    if (!user?.id || !cartDetail?.recipe) return;

    Alert.alert(
      "Remove Recipe",
      `Remove ${cartDetail.recipe.name} from cart?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: async () => {
            try {
              setLoading(true);
              isExiting.current = true;

              await removeFromCart(user.id, {
                recipeId: cartDetail.recipe.id,
                quantity: 1,
                ingredients: cartDetail.items.map((i) => ({
                  id: i.ingredient.id,
                  quantity: i.quantity,
                })),
              });
              router.back();
            } catch (error) {
              isExiting.current = false;
              Alert.alert("Error", "Failed to remove item");
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <SafeAreaView
        style={[
          styles.loadingContainer,
          { backgroundColor: theme.colors.background },
        ]}
      >
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </SafeAreaView>
    );
  }

  if (
    error ||
    !cartDetail ||
    !cartDetail.items ||
    cartDetail.items.length === 0
  ) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: theme.colors.background }]}
      >
        <View
          style={[styles.header, { backgroundColor: theme.colors.surface }]}
        >
          <TouchableOpacity
            onPress={() => router.back()}
            style={{ padding: 4 }}
          >
            <Feather
              name="arrow-left"
              size={24}
              color={theme.colors.onSurface}
            />
          </TouchableOpacity>
          <Text
            variant="headlineSmall"
            style={[styles.headerTitle, { color: theme.colors.onSurface }]}
          >
            Detail
          </Text>
          <View style={{ width: 32 }} />
        </View>
        <View style={styles.errorContainer}>
          <Text style={{ color: theme.colors.error }}>
            {error || "Item not found"}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // cartDetail is CartItemDetail, so we access properties directly
  const { recipe, items: ingredients } = cartDetail;

  if (!recipe) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: theme.colors.background }]}
      >
        <View
          style={[styles.header, { backgroundColor: theme.colors.surface }]}
        >
          <TouchableOpacity
            onPress={() => router.back()}
            style={{ padding: 4 }}
          >
            <Feather
              name="arrow-left"
              size={24}
              color={theme.colors.onSurface}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.errorContainer}>
          <Text style={{ color: theme.colors.error }}>
            Recipe data is missing.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.colors.surface }]}>
        <TouchableOpacity onPress={() => router.back()} style={{ padding: 4 }}>
          <Feather name="arrow-left" size={24} color={theme.colors.onSurface} />
        </TouchableOpacity>
        <Text
          variant="headlineSmall"
          style={[styles.headerTitle, { color: theme.colors.onSurface }]}
        >
          Cart Detail
        </Text>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Recipe Info */}
        <Surface
          style={[styles.recipeCard, { backgroundColor: theme.colors.surface }]}
          elevation={2}
        >
          {recipe.image ? (
            <Image source={{ uri: recipe.image }} style={styles.recipeImage} />
          ) : (
            <View
              style={[
                styles.recipeImage,
                { backgroundColor: theme.colors.surfaceVariant },
              ]}
            />
          )}
          <View style={styles.recipeInfo}>
            <Text
              style={[styles.recipeTitle, { color: theme.colors.onSurface }]}
            >
              {recipe.name}
            </Text>
            <Text
              style={[styles.recipeCategory, { color: theme.colors.primary }]}
            >
              {recipe.category?.name}
            </Text>
            <View
              style={[
                styles.metaRow,
                { backgroundColor: theme.colors.surfaceVariant },
              ]}
            >
              <MaterialCommunityIcons
                name="clock-outline"
                size={16}
                color={theme.colors.onSurfaceVariant}
              />
              <Text
                style={[
                  styles.metaText,
                  { color: theme.colors.onSurfaceVariant },
                ]}
              >
                {recipe.time} mins
              </Text>
            </View>
          </View>
        </Surface>

        <Text style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
          Ingredients in Cart
        </Text>

        {/* Ingredients List */}
        {ingredients.map((item, index) => {
          const totalPrice = (item.ingredient?.price || 0) * item.quantity;
          return (
            <View
              key={index}
              style={[
                styles.ingredientRow,
                { backgroundColor: theme.colors.surface },
              ]}
            >
              <View
                style={[
                  styles.ingredientIcon,
                  {
                    backgroundColor: theme.colors.surfaceVariant,
                    borderColor: theme.colors.outlineVariant,
                  },
                ]}
              >
                {item.ingredient?.image ? (
                  <Image
                    source={{ uri: item.ingredient.image }}
                    style={styles.ingredientImage}
                  />
                ) : (
                  <MaterialCommunityIcons
                    name="food-apple"
                    size={24}
                    color={theme.colors.primary}
                  />
                )}
              </View>
              <View style={{ flex: 1 }}>
                <Text
                  style={[
                    styles.ingredientName,
                    { color: theme.colors.onSurface },
                  ]}
                >
                  {item.ingredient?.name}
                </Text>
                <Text
                  style={[
                    styles.ingredientPrice,
                    { color: theme.colors.secondary },
                  ]}
                >
                  ${item.ingredient?.price} / {item.ingredient?.unit}
                </Text>
              </View>
              <View style={{ alignItems: "flex-end", marginLeft: 12 }}>
                <Text
                  style={[
                    styles.ingredientQuantity,
                    {
                      backgroundColor: theme.colors.surfaceVariant,
                      color: theme.colors.onSurfaceVariant,
                    },
                  ]}
                >
                  x{item.quantity}
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "700",
                    color: theme.colors.primary,
                    marginTop: 4,
                  }}
                >
                  ${totalPrice.toFixed(2)}
                </Text>
              </View>
            </View>
          );
        })}

        <Text style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
          Instructions
        </Text>
        <Surface
          style={[
            styles.instructionCard,
            { backgroundColor: theme.colors.surface },
          ]}
          elevation={1}
        >
          <Text
            style={[styles.instructionText, { color: theme.colors.onSurface }]}
          >
            {recipe.instructions?.replace(/\\n/g, "\n")}
          </Text>
        </Surface>

        <View
          style={[
            styles.totalContainer,
            { backgroundColor: theme.colors.surface },
          ]}
        >
          <Text style={[styles.totalLabel, { color: theme.colors.onSurface }]}>
            Total Cost
          </Text>
          <Text style={[styles.totalPrice, { color: theme.colors.primary }]}>
            $
            {ingredients
              .reduce(
                (sum, item) =>
                  sum + (item.ingredient?.price || 0) * item.quantity,
                0
              )
              .toFixed(2)}
          </Text>
        </View>

        <TouchableOpacity
          style={[
            styles.removeButton,
            {
              backgroundColor: theme.colors.errorContainer,
              borderColor: theme.colors.error,
            },
          ]}
          onPress={handleRemoveAll}
        >
          <Feather name="trash-2" size={20} color={theme.colors.error} />
          <Text
            style={[styles.removeButtonText, { color: theme.colors.error }]}
          >
            Remove from Cart
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    zIndex: 10,
  },
  headerTitle: {
    fontWeight: "700",
    fontSize: 20,
  },
  content: {
    padding: 24,
    paddingBottom: 60,
  },
  recipeCard: {
    flexDirection: "row",
    padding: 20,
    borderRadius: 24,
    marginBottom: 28,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  recipeImage: {
    width: 80,
    height: 80,
    borderRadius: 16,
    marginRight: 20,
  },
  recipeInfo: {
    flex: 1,
  },
  recipeTitle: {
    fontSize: 20,
    fontWeight: "800",
    marginBottom: 6,
  },
  recipeCategory: {
    fontSize: 14,
    marginBottom: 8,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  metaText: {
    fontSize: 12,
    marginLeft: 6,
    fontWeight: "500",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 16,
    marginLeft: 4,
  },
  ingredientRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    // Soft shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  ingredientIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
    overflow: "hidden",
    borderWidth: 1,
  },
  ingredientImage: {
    width: "100%",
    height: "100%",
  },
  ingredientName: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 2,
  },
  ingredientPrice: {
    fontSize: 13,
  },
  ingredientQuantity: {
    fontSize: 14,
    fontWeight: "700",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    overflow: "hidden",
  },
  instructionCard: {
    padding: 24,
    borderRadius: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  instructionText: {
    fontSize: 15,
    lineHeight: 26,
  },
  removeButton: {
    marginTop: 32,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 18,
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 40,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  removeButtonText: {
    marginLeft: 10,
    fontSize: 16,
    fontWeight: "700",
  },
  totalContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderRadius: 16,
    marginTop: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: "700",
  },
  totalPrice: {
    fontSize: 24,
    fontWeight: "800",
  },
});
