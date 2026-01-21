import { Recipe } from "@/src/types/recipe.type";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import React from "react";
import { Dimensions, StyleSheet, TouchableOpacity, View } from "react-native";
import { Text, useTheme } from "react-native-paper";

interface RecipeDetailHeaderProps {
  activeRecipe: Recipe;
  isFavorite: boolean;
  toggleFavorite: () => void;
}

const { width } = Dimensions.get("window");

const RecipeDetailHeader: React.FC<RecipeDetailHeaderProps> = ({
  activeRecipe,
  isFavorite,
  toggleFavorite,
}) => {
  const theme = useTheme();
  const router = useRouter();

  return (
    <View style={styles.imageContainer}>
      <Image
        source={{ uri: activeRecipe.image }}
        style={styles.image}
        contentFit="cover"
      />
      <View style={styles.imageOverlay} />

      <View style={styles.headerButtons}>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => router.back()}
        >
          <Feather name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton} onPress={toggleFavorite}>
          <MaterialCommunityIcons
            name={isFavorite ? "heart" : "heart-outline"}
            size={24}
            color={isFavorite ? theme.colors.error : "#fff"}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.headerContent}>
        <View
          style={[
            styles.categoryBadge,
            { backgroundColor: theme.colors.primary },
          ]}
        >
          <Text
            style={[styles.categoryText, { color: theme.colors.onPrimary }]}
          >
            {activeRecipe.category?.name}
          </Text>
        </View>
        <Text style={styles.title}>{activeRecipe.name}</Text>
        <View style={styles.metaContainer}>
          <Feather name="clock" size={16} color="#eee" />
          <Text style={styles.metaText}>{activeRecipe.time} mins</Text>
          <Text style={styles.metaDivider}>•</Text>
          <Feather name="bar-chart-2" size={16} color="#eee" />
          <Text style={styles.metaText}>Energy</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  imageContainer: {
    height: 350,
    width: width,
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  headerButtons: {
    position: "absolute",
    top: 50, // Safe area approximation
    left: 20,
    right: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    zIndex: 10,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
    backdropFilter: "blur(10px)",
  },
  headerContent: {
    position: "absolute",
    bottom: 30,
    left: 20,
    right: 20,
  },
  categoryBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: "flex-start",
    marginBottom: 10,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: "bold",
  },
  title: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 10,
  },
  metaContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  metaText: {
    color: "#eee",
    marginLeft: 6,
    fontSize: 14,
    fontWeight: "500",
  },
  metaDivider: {
    color: "#eee",
    marginHorizontal: 10,
  },
});

export default RecipeDetailHeader;
