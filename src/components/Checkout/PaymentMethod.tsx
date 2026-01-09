import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, View } from "react-native";
import {
  Divider,
  RadioButton,
  Surface,
  Text,
  useTheme,
} from "react-native-paper";

interface PaymentMethodProps {
  paymentMethod: string;
  setPaymentMethod: (method: string) => void;
}

const PaymentMethod = ({
  paymentMethod,
  setPaymentMethod,
}: PaymentMethodProps) => {
  const theme = useTheme();

  return (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
        Payment Method
      </Text>
      <Surface
        style={[styles.card, { backgroundColor: theme.colors.surface }]}
        elevation={1}
      >
        <RadioButton.Group
          onValueChange={(newValue) => setPaymentMethod(newValue)}
          value={paymentMethod}
        >
          <View style={styles.radioRow}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <MaterialCommunityIcons
                name="credit-card-outline"
                size={24}
                color={theme.colors.primary}
              />
              <Text
                style={[styles.radioLabel, { color: theme.colors.onSurface }]}
              >
                Credit Card (Stripe)
              </Text>
            </View>
            <RadioButton value="stripe" color={theme.colors.primary} />
          </View>
          <Divider style={{ marginVertical: 8 }} />
          <View style={styles.radioRow}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <MaterialCommunityIcons
                name="cash"
                size={24}
                color={theme.colors.primary}
              />
              <Text
                style={[styles.radioLabel, { color: theme.colors.onSurface }]}
              >
                Cash on Delivery
              </Text>
            </View>
            <RadioButton value="cod" color={theme.colors.primary} />
          </View>
        </RadioButton.Group>
      </Surface>
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
  },
  card: {
    borderRadius: 16,
    padding: 16,
  },
  radioRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 4,
  },
  radioLabel: {
    marginLeft: 12,
    fontSize: 16,
    fontWeight: "500",
  },
});

export default PaymentMethod;
