import CheckoutContent from "@/src/components/Checkout/CheckoutContent";
import { StripeProvider } from "@stripe/stripe-react-native";
import React from "react";

export default function CheckoutScreen() {
  return (
    <StripeProvider
      publishableKey="pm_1Q0PsIJvEtkwdCNYMSaVuRz6"
      merchantIdentifier="merchant.com.recipeapp"
    >
      <CheckoutContent />
    </StripeProvider>
  );
}
