import CheckoutHeader from "@/src/components/Checkout/CheckoutHeader";
import DeliveryAddress from "@/src/components/Checkout/DeliveryAddress";
import DeliveryTime from "@/src/components/Checkout/DeliveryTime";
import OrderSummary from "@/src/components/Checkout/OrderSummary";
import PaymentMethod from "@/src/components/Checkout/PaymentMethod";
import { useAuthStore } from "@/src/stores/auth.store";
import { useCartStore } from "@/src/stores/cart.store";
import { useOrderStore } from "@/src/stores/order.store";
import { useStripe } from "@stripe/stripe-react-native";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, ScrollView, StyleSheet } from "react-native";
import { Button, useTheme } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

const calculateTotal = (items: any[]) => {
  let total = 0;
  if (!items) return "0.00";
  items.forEach((group) => {
    if (group?.items && Array.isArray(group.items)) {
      group.items.forEach((item: any) => {
        // item matches { ingredient: { price: ... }, quantity: ... }
        const price = item.ingredient?.price || item.price || 2.5;
        total += price * item.quantity;
      });
    }
  });
  return total.toFixed(2);
};

const CheckoutContent = () => {
  const router = useRouter();
  const theme = useTheme();
  const { items, clearCart } = useCartStore();
  const { user } = useAuthStore();
  const { createOrder } = useOrderStore(); // Import order store
  const { initPaymentSheet, presentPaymentSheet } = useStripe();

  const [address, setAddress] = useState("123 Recipe Street, Food City");
  const [paymentMethod, setPaymentMethod] = useState("stripe");
  const [loading, setLoading] = useState(false);

  const totalAmount = calculateTotal(items);

  const handlePayment = async () => {
    if (items.length === 0) return;

    if (!user?.id) {
      Alert.alert("Error", "You must be logged in to place an order.");
      return;
    }

    setLoading(true);

    const orderData = {
      userId: user.id,
      paymentMethod: paymentMethod === "cod" ? "COD" : "CREDIT_CARD",
      orderStatus: "PENDING", // Default to pending, update if payment succeeds
      totalPrice: parseFloat(totalAmount),
      items: items.map((cartItem) => ({
        recipeId: cartItem.recipe.id,
        ingredients: (cartItem.items || []).map((ing) => ({
          ingredientId: ing.ingredient.id,
          quantity: ing.quantity,
        })),
      })),
    };

    if (paymentMethod === "cod") {
      try {
        const success = await createOrder(orderData);
        setLoading(false);
        if (success) {
          Alert.alert(
            "Success",
            "Order placed successfully! Pay on delivery.",
            [
              {
                text: "OK",
                onPress: () => {
                  clearCart();
                  router.replace("/(tabs)");
                },
              },
            ],
          );
        } else {
          Alert.alert("Error", "Failed to place order. Please try again.");
        }
      } catch (error) {
        setLoading(false);
        Alert.alert("Error", "An unexpected error occurred.");
      }
      return;
    }

    // Stripe Mock
    setLoading(false); // Pause loading while user interacts with alert
    Alert.alert(
      "Stripe Demo",
      "This is a demo. In a real app, the Stripe Payment Sheet would open now.",
      [
        {
          text: "Simulate Success",
          onPress: async () => {
            setLoading(true);
            const success = await createOrder({
              ...orderData,
              orderStatus: "SUCCESS",
            }); // Assume paid
            setLoading(false);
            if (success) {
              clearCart();
              router.replace("/(tabs)");
            } else {
              Alert.alert("Error", "Failed to create order on server.");
            }
          },
        },
        { text: "Cancel", style: "cancel" },
      ],
    );
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      edges={["top", "left", "right"]}
    >
      <CheckoutHeader />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <DeliveryAddress address={address} setAddress={setAddress} />
        <DeliveryTime />
        <OrderSummary items={items} totalAmount={totalAmount} />
        <PaymentMethod
          paymentMethod={paymentMethod}
          setPaymentMethod={setPaymentMethod}
        />

        {/* Pay Button */}
        <Button
          mode="contained"
          onPress={handlePayment}
          loading={loading}
          disabled={loading}
          style={[styles.payButton, { backgroundColor: theme.colors.primary }]}
          contentStyle={{ paddingVertical: 8 }}
          labelStyle={{ fontSize: 18 }}
        >
          {loading ? "Processing..." : `Pay $${totalAmount}`}
        </Button>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  payButton: {
    borderRadius: 12,
    marginTop: 12,
    elevation: 4,
  },
});

export default CheckoutContent;
