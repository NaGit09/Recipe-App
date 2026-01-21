import { Recipe } from "@/src/types/recipe.type";
import { Image } from "expo-image";
import React from "react";
import { StyleSheet, View } from "react-native";
import { Text, useTheme } from "react-native-paper";

interface RecipeDetailAuthorProps {
  activeRecipe: Recipe;
}

const RecipeDetailAuthor: React.FC<RecipeDetailAuthorProps> = ({
  activeRecipe,
}) => {
  const theme = useTheme();

  return (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
        About the Author
      </Text>
      <View
        style={[
          styles.authorCard,
          { backgroundColor: theme.colors.surfaceVariant },
        ]}
      >
        <Image
          source={{
            uri:
              activeRecipe.author?.avatar || "https://via.placeholder.com/50",
          }}
          style={[
            styles.authorAvatar,
            { backgroundColor: theme.colors.surface },
          ]}
        />
        <View style={styles.authorInfo}>
          <Text style={[styles.authorName, { color: theme.colors.onSurface }]}>
            {activeRecipe.author?.username || "Unknown Chef"}
          </Text>
          <Text
            style={[styles.authorBio, { color: theme.colors.onSurfaceVariant }]}
            numberOfLines={2}
          >
            {activeRecipe.author?.bio ||
              "Passionate about cooking and sharing delicious recipes."}
          </Text>
        </View>
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
  authorCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 16,
  },
  authorAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 16,
  },
  authorInfo: {
    flex: 1,
  },
  authorName: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  authorBio: {
    fontSize: 12,
    lineHeight: 18,
  },
});

export default RecipeDetailAuthor;
