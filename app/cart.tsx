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
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import {
  ActivityIndicator,
  Button,
  Surface,
  Text,
  useTheme,
} from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ShoppingCartScreen() {
  const router = useRouter();
  const theme = useTheme();
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

    Alert.alert(
      "Remove Recipe",
      `Are you sure you want to remove ${cartItemDetail.recipe.name} from cart?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: async () => {
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
      ],
    );
  };

  const handleCheckout = () => {
    router.push("/checkout");
  };

  const renderRecipeGroup = ({ item }: { item: CartItemDetail }) => {
    return (
      <View
        style={[
          styles.recipeGroup,
          {
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.outlineVariant,
          },
        ]}
      >
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
              <View
                style={[
                  styles.recipeImage,
                  { backgroundColor: theme.colors.surfaceVariant },
                ]}
              />
            )}
            <View>
              <Text
                style={[styles.recipeTitle, { color: theme.colors.onSurface }]}
              >
                {item.recipe.name}
              </Text>
              <Text
                style={[styles.recipeCategory, { color: theme.colors.primary }]}
              >
                {item.recipe.category?.name}
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.removeIconButton,
              { backgroundColor: theme.colors.errorContainer },
            ]}
            onPress={() => handleRemoveRecipe(item)}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Feather name="trash-2" size={20} color={theme.colors.error} />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const totalItems = items.reduce(
    (acc, recipe) => acc + (recipe.items?.length || 0),
    0,
  );

  if (isLoading && items.length === 0) {
    return (
      <SafeAreaView
        style={[
          styles.container,
          {
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: theme.colors.background,
          },
        ]}
      >
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <View style={[styles.header, { backgroundColor: theme.colors.surface }]}>
        <TouchableOpacity
          onPress={() => router.push("/(tabs)")}
          style={{ padding: 4, marginRight: 8 }}
        >
          <Feather name="arrow-left" size={24} color={theme.colors.onSurface} />
        </TouchableOpacity>
        <Text
          variant="headlineSmall"
          style={[
            styles.headerTitle,
            { flex: 1, color: theme.colors.onSurface },
          ]}
        >
          Shopping Cart
        </Text>
      </View>

      {items.length === 0 ? (
        <View style={styles.emptyState}>
          <MaterialCommunityIcons
            name="cart-off"
            size={64}
            color={theme.colors.outline}
          />
          <Text style={[styles.emptyTitle, { color: theme.colors.onSurface }]}>
            Your cart is empty
          </Text>
          <Text
            style={[styles.emptySubtitle, { color: theme.colors.secondary }]}
          >
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
          <Surface
            style={[styles.footer, { backgroundColor: theme.colors.surface }]}
            elevation={4}
          >
            <View style={styles.footerContent}>
              <View>
                <Text
                  style={[styles.totalLabel, { color: theme.colors.secondary }]}
                >
                  Total Items
                </Text>
                <Text
                  style={[styles.totalValue, { color: theme.colors.onSurface }]}
                >
                  {totalItems}
                </Text>
              </View>
              <Button
                mode="contained"
                onPress={handleCheckout}
                style={[
                  styles.checkoutButton,
                  { backgroundColor: theme.colors.primary },
                ]}
                contentStyle={{ paddingVertical: 4 }}
                labelStyle={{ color: theme.colors.onPrimary }}
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
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 16,
  },
  headerTitle: {
    fontWeight: "800",
    fontSize: 20,
    textAlign: "center",
  },
  listContent: {
    padding: 20,
    paddingBottom: 120,
  },
  recipeGroup: {
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
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
  },
  recipeTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 4,
    lineHeight: 22,
  },
  recipeCategory: {
    fontSize: 12,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  cartItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
    borderWidth: 1,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 2,
  },
  itemQuantity: {
    fontSize: 14,
    fontWeight: "600",
  },
  removeIconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
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
    marginTop: 20,
  },
  emptySubtitle: {
    fontSize: 15,
    marginTop: 8,
    textAlign: "center",
    lineHeight: 22,
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
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
    marginBottom: 4,
    fontWeight: "500",
  },
  totalValue: {
    fontSize: 28,
    fontWeight: "800",
  },
  checkoutButton: {
    borderRadius: 16,
    paddingHorizontal: 32,
    paddingVertical: 6,
    elevation: 4,
    shadowColor: "#000", // Using general shadow color instead of colored shadow to simplify
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
});
