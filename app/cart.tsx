import { useAuthStore } from "@/src/stores/auth.store";
import { useCartStore } from "@/src/stores/cart.store";
import { CartItemDetail } from "@/src/types/cart.type";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import {
  Alert,
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { ActivityIndicator, Button, Surface, Text } from "react-native-paper";

export default function ShoppingCartScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { items, removeFromCart, fetchCart, isLoading, clearCart } =
    useCartStore();

  useEffect(() => {
    if (user?.id) {
      fetchCart(user.id);
    }
  }, [user?.id]);

  const handleRemoveRecipe = (cartItemDetail: CartItemDetail) => {
    if (!user?.id) return;
    console.log("Attempting to remove recipe:", cartItemDetail.recipe.id);

    Alert.alert(
      "Remove Recipe",
      `Are you sure you want to remove ${cartItemDetail.recipe.name} from cart?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: async () => {
            console.log("Confirm remove recipe:", cartItemDetail.recipe.id);
            const req = {
              recipeId: cartItemDetail.recipe.id,
              quantity: 1,
              ingredients: (cartItemDetail.items || []).map((i) => ({
                id: i.ingredient.id,
                quantity: i.quantity,
              })),
            };
            await removeFromCart(user.id, req);
          },
        },
      ]
    );
  };

  const handleCheckout = () => {
    Alert.alert("Checkout", "Proceeding to checkout...");
  };

  const renderRecipeGroup = ({ item }: { item: CartItemDetail }) => {
    return (
      <View style={styles.recipeGroup}>
        <View style={styles.recipeHeader}>
          <TouchableOpacity
            style={{ flex: 1, flexDirection: "row", alignItems: "center" }}
            onPress={() => router.push(`/cart-detail/${item.recipe.id}`)}
          >
            {item.recipe.image ? (
              <Image
                source={{ uri: item.recipe.image }}
                style={styles.recipeImage}
              />
            ) : (
              <View style={[styles.recipeImage, { backgroundColor: "#ddd" }]} />
            )}
            <View>
              <Text style={styles.recipeTitle}>{item.recipe.name}</Text>
              <Text style={styles.recipeCategory}>
                {item.recipe.category?.name}
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.removeIconButton}
            onPress={() => handleRemoveRecipe(item)}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Feather name="trash-2" size={20} color="#DC2626" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const totalItems = items.reduce(
    (acc, recipe) => acc + (recipe.items?.length || 0),
    0
  );

  if (isLoading && items.length === 0) {
    return (
      <SafeAreaView
        style={[
          styles.container,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <ActivityIndicator size="large" color="#DC2626" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.push("/(tabs)")}
          style={{ padding: 4, marginRight: 8 }}
        >
          <Feather name="arrow-left" size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text variant="headlineSmall" style={[styles.headerTitle, { flex: 1 }]}>
          Shopping Cart
        </Text>
      </View>

      {items.length === 0 ? (
        <View style={styles.emptyState}>
          <MaterialCommunityIcons name="cart-off" size={64} color="#D1D5DB" />
          <Text style={styles.emptyTitle}>Your cart is empty</Text>
          <Text style={styles.emptySubtitle}>
            Add ingredients from recipes to get started
          </Text>
        </View>
      ) : (
        <>
          <FlatList
            data={items}
            renderItem={renderRecipeGroup}
            keyExtractor={(item) => item.recipe.id}
            contentContainerStyle={styles.listContent}
          />
          <Surface style={styles.footer} elevation={4}>
            <View style={styles.footerContent}>
              <View>
                <Text style={styles.totalLabel}>Total Items</Text>
                <Text style={styles.totalValue}>{totalItems}</Text>
              </View>
              <Button
                mode="contained"
                onPress={handleCheckout}
                style={styles.checkoutButton}
                contentStyle={{ paddingVertical: 4 }}
              >
                Checkout
              </Button>
            </View>
          </Surface>
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 16,
    backgroundColor: "#fff",

  },
  headerTitle: {
    fontWeight: "800",
    color: "#1F2937",
    fontSize: 20,
    textAlign: "center",
  },
  listContent: {
    padding: 20,
    paddingBottom: 120,
  },
  recipeGroup: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#F3F4F6",
  },
  recipeHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  recipeImage: {
    width: 64,
    height: 64,
    borderRadius: 16,
    marginRight: 16,
    backgroundColor: "#F3F4F6",
  },
  recipeTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 4,
    lineHeight: 22,
  },
  recipeCategory: {
    fontSize: 12,
    color: "#DC2626",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  cartItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8F9FA", // Very light gray
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#F3F4F6",
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 2,
  },
  itemQuantity: {
    fontSize: 14,
    color: "#4B5563",
    fontWeight: "600",
  },
  removeIconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#FEE2E2",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 12,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#374151",
    marginTop: 20,
  },
  emptySubtitle: {
    fontSize: 15,
    color: "#6B7280",
    marginTop: 8,
    textAlign: "center",
    lineHeight: 22,
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 24,
    paddingBottom: 36,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 8,
  },
  footerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  totalLabel: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 4,
    fontWeight: "500",
  },
  totalValue: {
    fontSize: 28,
    fontWeight: "800",
    color: "#111827",
  },
  checkoutButton: {
    backgroundColor: "#DC2626",
    borderRadius: 16,
    paddingHorizontal: 32,
    paddingVertical: 6,
    elevation: 4,
    shadowColor: "#DC2626",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
});
