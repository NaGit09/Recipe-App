import { Recipe } from "@/src/types/recipe.type";
import { handleRecipePress } from "@/src/utils/helper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { FadeInView } from "../Animated/FadeInView";

const RecipeItem = ({ item, index }: { item: Recipe; index: number }) => {
  return (
    <FadeInView
      key={item.id}
      delay={400 + index * 100}
      style={styles.recipeCardWrapper}
    >
      <TouchableOpacity
        style={styles.recipeCard}
        onPress={() => handleRecipePress(item.id)}
        activeOpacity={0.9}
      >
        <View style={styles.recipeImageWrapper}>
          {item.image ? (
            <Image source={{ uri: item.image }} style={styles.recipeImage} />
          ) : (
            <View style={styles.recipeImagePlaceholder}>
              <MaterialCommunityIcons
                name="food-turkey"
                size={40}
                color="#DC2626"
              />
            </View>
          )}
          <TouchableOpacity style={styles.likeButton}>
            <MaterialCommunityIcons
              name="heart-outline"
              size={20}
              color="#DC2626"
            />
          </TouchableOpacity>
        </View>
        <View style={styles.recipeInfo}>
          <Text style={styles.recipeTitle} numberOfLines={2}>
            {item.name}
          </Text>
          <View style={styles.recipeMetaContainer}>
            <MaterialCommunityIcons
              name="clock-outline"
              size={14}
              color="#DC2626"
            />
            <Text style={styles.recipeMeta}>{item.time} mins</Text>
          </View>
        </View>
      </TouchableOpacity>
    </FadeInView>
  );
};
const styles = StyleSheet.create({
  recipeCardWrapper: {
    width: "50%",
    paddingHorizontal: 8,
    marginBottom: 16,
  },
  recipeCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    overflow: "visible", // Allow shadow
  },
  recipeImageWrapper: {
    height: 150,
    width: "100%",
    backgroundColor: "#F3F4F6",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: "hidden",
    position: "relative",
  },
  recipeImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  recipeImagePlaceholder: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  likeButton: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "#fff",
    padding: 6,
    borderRadius: 20,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  recipeInfo: {
    padding: 12,
    paddingBottom: 16,
  },
  recipeTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#1F2937",
    marginBottom: 8,
    lineHeight: 22,
  },
  recipeMetaContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FEF2F2",
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  recipeMeta: {
    fontSize: 12,
    color: "#DC2626",
    fontWeight: "700",
    marginLeft: 4,
  },
});
export default RecipeItem;
