import { Recipe } from "@/src/types/recipe.type";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Text, useTheme } from "react-native-paper";

interface RecipeDetailIngredientsProps {
  activeRecipe: Recipe;
  quantities: { [key: string]: number };
  updateQuantity: (ingredientId: string, change: number) => void;
  handleAddAllToCart: () => void;
}

const RecipeDetailIngredients: React.FC<RecipeDetailIngredientsProps> = ({
  activeRecipe,
  quantities,
  updateQuantity,
  handleAddAllToCart,
}) => {
  const theme = useTheme();

  return (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
        Ingredients
      </Text>
      <View style={styles.ingredientsList}>
        {activeRecipe.ingredients.map((item, index) => {
          const currentQty = quantities[item.ingredient.id] ?? item.quantity;
          return (
            <View
              key={index}
              style={[
                styles.ingredientItem,
                {
                  backgroundColor: theme.colors.surface,
                  borderColor: theme.colors.outlineVariant,
                },
              ]}
            >
              <View
                style={[
                  styles.ingredientIcon,
                  { backgroundColor: theme.colors.surfaceVariant },
                ]}
              >
                <MaterialCommunityIcons
                  name="food-apple-outline"
                  size={20}
                  color={theme.colors.primary}
                />
              </View>
              <Text
                style={[
                  styles.ingredientName,
                  { color: theme.colors.onSurface },
                ]}
              >
                {item.ingredient.name}
              </Text>
              {/* Quantity Control */}
              <View
                style={[
                  styles.quantityContainer,
                  {
                    backgroundColor: theme.colors.surfaceVariant,
                    borderColor: theme.colors.outlineVariant,
                  },
                ]}
              >
                <TouchableOpacity
                  onPress={() => updateQuantity(item.ingredient.id, -1)}
                  style={[
                    styles.qtyBtn,
                    { backgroundColor: theme.colors.surface },
                  ]}
                >
                  <Feather
                    name="minus"
                    size={14}
                    color={theme.colors.onSurfaceVariant}
                  />
                </TouchableOpacity>
                <Text
                  style={[
                    styles.quantityValue,
                    { color: theme.colors.onSurface },
                  ]}
                >
                  {currentQty} {item.ingredient.unit}
                </Text>
                <TouchableOpacity
                  onPress={() => updateQuantity(item.ingredient.id, 1)}
                  style={[
                    styles.qtyBtn,
                    { backgroundColor: theme.colors.surface },
                  ]}
                >
                  <Feather
                    name="plus"
                    size={14}
                    color={theme.colors.onSurfaceVariant}
                  />
                </TouchableOpacity>
              </View>
            </View>
          );
        })}
      </View>
      <TouchableOpacity
        style={[
          styles.addAllButton,
          {
            backgroundColor: theme.colors.primary,
            shadowColor: theme.colors.primary,
          },
        ]}
        onPress={handleAddAllToCart}
      >
        <Feather
          name="shopping-cart"
          size={20}
          color={theme.colors.onPrimary}
        />
        <Text style={[styles.addAllText, { color: theme.colors.onPrimary }]}>
          Add Ingredients to Cart
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
  },
  ingredientsList: {
    gap: 12,
  },
  ingredientItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 16,
    borderWidth: 1,
    // Slight shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  ingredientIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  ingredientName: {
    flex: 1,
    fontSize: 16,
    fontWeight: "600",
    marginRight: 8,
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 4,
    borderRadius: 12,
    borderWidth: 1,
  },
  qtyBtn: {
    width: 28,
    height: 28,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    // Shadow for buttons
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  quantityValue: {
    fontSize: 14,
    fontWeight: "700",
    marginHorizontal: 12,
    minWidth: 40,
    textAlign: "center",
  },
  addAllButton: {
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  addAllText: {
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default RecipeDetailIngredients;
