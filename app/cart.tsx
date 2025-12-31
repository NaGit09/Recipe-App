import { useCartStore } from "@/src/stores/cart.store";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import {
  Alert,
  FlatList,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { Button, Surface, Text } from "react-native-paper";

import { useRouter } from "expo-router";

export default function ShoppingCartScreen() {
  const router = useRouter();
  const { items, removeFromCart, clearCart } = useCartStore();

  const handleRemove = (id: string, name: string) => {
    Alert.alert(
      "Remove Item",
      `Are you sure you want to remove ${name} from your cart?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: () => removeFromCart(id),
        },
      ]
    );
  };

  const handleCheckout = () => {
    Alert.alert("Checkout", "Proceeding to checkout...");
    // Future integration with payment or pantry features
  };

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.cartItem}>
      <View style={styles.iconContainer}>
        <MaterialCommunityIcons name="food-apple" size={24} color="#DC2626" />
      </View>
      <View style={styles.itemInfo}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemQuantity}>
          {item.quantity} {item.unit}
        </Text>
      </View>
      <TouchableOpacity
        onPress={() => handleRemove(item.ingredientId, item.name)}
        style={styles.removeButton}
      >
        <Feather name="trash-2" size={20} color="#EF4444" />
      </TouchableOpacity>
    </View>
  );

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
        {items.length > 0 && (
          <Button mode="text" onPress={clearCart} textColor="#DC2626">
            Clear All
          </Button>
        )}
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
            renderItem={renderItem}
            keyExtractor={(item) => item.ingredientId}
            contentContainerStyle={styles.listContent}
          />
          <Surface style={styles.footer} elevation={4}>
            <View style={styles.footerContent}>
              <View>
                <Text style={styles.totalLabel}>Total Items</Text>
                <Text style={styles.totalValue}>{items.length}</Text>
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
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  headerTitle: {
    fontWeight: "bold",
    color: "#1F2937",
  },
  listContent: {
    padding: 20,
    paddingBottom: 100,
  },
  cartItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    // Shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: "#FEF2F2",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 4,
  },
  itemQuantity: {
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "500",
  },
  removeButton: {
    padding: 8,
    backgroundColor: "#FEF2F2",
    borderRadius: 8,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#374151",
    marginTop: 16,
  },
  emptySubtitle: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 8,
    textAlign: "center",
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 34, // Safe area
  },
  footerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  totalLabel: {
    fontSize: 12,
    color: "#6B7280",
    marginBottom: 4,
  },
  totalValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1F2937",
  },
  checkoutButton: {
    backgroundColor: "#DC2626",
    borderRadius: 12,
    paddingHorizontal: 24,
  },
});
