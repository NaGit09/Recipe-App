import { Recipe } from "@/src/types/recipe.type";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Text, useTheme } from "react-native-paper";

interface RecipeDetailRelatedProps {
  activeRecipe: Recipe;
}

const RecipeDetailRelated: React.FC<RecipeDetailRelatedProps> = ({
  activeRecipe,
}) => {
  const theme = useTheme();

  return (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
        More from {activeRecipe.author?.username || "Author"}
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.relatedRecipesList}
      >
        <View style={styles.relatedRecipeCard}>
          <View
            style={[
              styles.relatedRecipeImagePlaceholder,
              { backgroundColor: theme.colors.surfaceVariant },
            ]}
          >
            <MaterialCommunityIcons
              name="chef-hat"
              size={24}
              color={theme.colors.onSurfaceVariant}
            />
          </View>
          <Text
            style={[
              styles.relatedRecipeTitle,
              { color: theme.colors.onSurface },
            ]}
            numberOfLines={1}
          >
            Coming Soon
          </Text>
        </View>
      </ScrollView>
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
  relatedRecipesList: {
    gap: 16,
    paddingRight: 24,
  },
  relatedRecipeCard: {
    width: 140,
    marginRight: 12,
  },
  relatedRecipeImagePlaceholder: {
    width: 140,
    height: 100,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  relatedRecipeTitle: {
    fontSize: 14,
    fontWeight: "600",
  },
});

export default RecipeDetailRelated;
