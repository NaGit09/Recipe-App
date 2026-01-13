import CheckoutHeader from "@/src/components/Checkout/CheckoutHeader";
import DeliveryAddress from "@/src/components/Checkout/DeliveryAddress";
import DeliveryTime from "@/src/components/Checkout/DeliveryTime";
import OrderSummary from "@/src/components/Checkout/OrderSummary";
import PaymentMethod from "@/src/components/Checkout/PaymentMethod";
import { useAuthStore } from "@/src/stores/auth.store";
import { useCartStore } from "@/src/stores/cart.store";
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
  const { initPaymentSheet, presentPaymentSheet } = useStripe();

  const [address, setAddress] = useState("123 Recipe Street, Food City");
  const [paymentMethod, setPaymentMethod] = useState("stripe");
  const [loading, setLoading] = useState(false);

  const totalAmount = calculateTotal(items);

  const handlePayment = async () => {
    if (items.length === 0) return;
    setLoading(true);

    if (paymentMethod === "cod") {
      setTimeout(() => {
        setLoading(false);
        Alert.alert("Success", "Order placed successfully! Pay on delivery.", [
          {
            text: "OK",
            onPress: () => {
              clearCart();
              router.replace("/(tabs)");
            },
          },
        ]);
      }, 1500);
      return;
    }

    setTimeout(() => {
      setLoading(false);
      Alert.alert(
        "Stripe Demo",
        "This is a demo. In a real app, the Stripe Payment Sheet would open now.",
        [
          {
            text: "Simulate Success",
            onPress: () => {
              clearCart();
              router.replace("/(tabs)");
            },
          },
          { text: "Cancel", style: "cancel" },
        ]
      );
    }, 1000);
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
