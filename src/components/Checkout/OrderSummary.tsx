import React from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { Divider, Surface, Text, useTheme } from "react-native-paper";

interface OrderSummaryProps {
  items: any[];
  totalAmount: string;
}

const OrderSummary = ({ items, totalAmount }: OrderSummaryProps) => {
  const theme = useTheme();

  const renderCartItem = ({ item }: { item: any }) => (
    <View
      style={[styles.cartItem, { borderColor: theme.colors.outlineVariant }]}
    >
      <Text style={[styles.itemText, { color: theme.colors.onSurface }]}>
        {item.items?.length || 0} ingredients from{" "}
        {item.recipe?.name || "Recipe"}
      </Text>
      <Text style={[styles.itemPrice, { color: theme.colors.primary }]}>
        $
        {(item.items || [])
          .reduce(
            (acc: number, i: any) =>
              acc + (i.ingredient?.price || i.price || 2.5) * i.quantity,
            0
          )
          .toFixed(2)}
      </Text>
    </View>
  );

  return (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
        Order Summary
      </Text>
      <Surface
        style={[
          styles.card,
          { backgroundColor: theme.colors.surface, padding: 0 },
        ]}
        elevation={1}
      >
        <FlatList
          data={items}
          renderItem={renderCartItem}
          keyExtractor={(item) => item.recipe.id}
          scrollEnabled={false}
          ItemSeparatorComponent={() => <Divider />}
        />
        <Divider />
        <View style={styles.totalRow}>
          <Text style={{ color: theme.colors.onSurface, fontWeight: "bold" }}>
            Total Amount
          </Text>
          <Text
            style={{
              color: theme.colors.primary,
              fontWeight: "bold",
              fontSize: 18,
            }}
          >
            ${totalAmount}
          </Text>
        </View>
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
  cartItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
  },
  itemText: {
    flex: 1,
    fontSize: 14,
  },
  itemPrice: {
    fontWeight: "bold",
    marginLeft: 8,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
});

export default OrderSummary;
