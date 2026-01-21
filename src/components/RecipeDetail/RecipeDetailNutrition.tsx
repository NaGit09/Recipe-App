import { Recipe } from "@/src/types/recipe.type";
import React from "react";
import { StyleSheet, View } from "react-native";
import { Text, useTheme } from "react-native-paper";

interface RecipeDetailNutritionProps {
  activeRecipe: Recipe;
}

const RecipeDetailNutrition: React.FC<RecipeDetailNutritionProps> = ({
  activeRecipe,
}) => {
  const theme = useTheme();

  if (!activeRecipe.nutritions || activeRecipe.nutritions.length === 0) {
    return null;
  }

  return (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
        Nutrition
      </Text>
      <View style={styles.nutritionGrid}>
        {activeRecipe.nutritions.map((item, index) => (
          <View
            key={index}
            style={[
              styles.nutritionItem,
              { backgroundColor: theme.colors.primaryContainer },
            ]}
          >
            <Text
              style={[styles.nutritionValue, { color: theme.colors.primary }]}
            >
              {item.value}
            </Text>
            <Text
              style={[styles.nutritionUnit, { color: theme.colors.primary }]}
            >
              {item.nutrition.unit}
            </Text>
            <Text
              style={[
                styles.nutritionName,
                { color: theme.colors.onSurfaceVariant },
              ]}
            >
              {item.nutrition.name}
            </Text>
          </View>
        ))}
      </View>
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
  nutritionGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  nutritionItem: {
    width: "30%",
    padding: 12,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  nutritionValue: {
    fontSize: 18,
    fontWeight: "bold",
  },
  nutritionUnit: {
    fontSize: 12,
    marginBottom: 4,
  },
  nutritionName: {
    fontSize: 12,
  },
});

export default RecipeDetailNutrition;
