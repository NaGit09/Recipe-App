import { Recipe } from "@/src/types/recipe.type";
import React from "react";
import { StyleSheet, View } from "react-native";
import { Text, useTheme } from "react-native-paper";

interface RecipeDetailInstructionsProps {
  activeRecipe: Recipe;
}

const RecipeDetailInstructions: React.FC<RecipeDetailInstructionsProps> = ({
  activeRecipe,
}) => {
  const theme = useTheme();

  return (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
        Instructions
      </Text>
      <View
        style={[
          styles.instructionsContainer,
          { backgroundColor: theme.colors.surfaceVariant },
        ]}
      >
        <Text
          style={[styles.instructionText, { color: theme.colors.onSurface }]}
        >
          {activeRecipe.instructions?.replace(/\\n/g, "\n")}
        </Text>
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
  instructionsContainer: {
    padding: 20,
    borderRadius: 16,
  },
  instructionText: {
    fontSize: 16,
    lineHeight: 26,
  },
});

export default RecipeDetailInstructions;
