import { Recipe } from "@/src/types/recipe.type";
import { Feather, Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import React from "react";
import { Dimensions, StyleSheet, TouchableOpacity, View } from "react-native";
import { Text } from "react-native-paper";
import { FadeInView } from "../Animated/FadeInView";

const RecipeCard = ({ item, index }: { item: Recipe; index: number }) => {
  const router = useRouter();
  return (
    <FadeInView delay={index * 100} style={styles.cardContainer}>
      <TouchableOpacity
        style={{ flex: 1 }}
        activeOpacity={0.9}
        onPress={() => router.push(`/recipe/${item.id}`)}
      >
        <View style={styles.cardImageContainer}>
          <Image
            source={{ uri: item.image }}
            style={styles.cardImage}
            contentFit="cover"
            transition={200}
          />
          <TouchableOpacity style={styles.likeButton}>
            <Ionicons name="heart-outline" size={20} color="#DC2626" />
          </TouchableOpacity>
        </View>
        <View style={styles.cardContent}>
          <Text style={styles.cardTitle} numberOfLines={2}>
            {item.name}
          </Text>
          <View style={styles.cardMetaContainer}>
            <Feather name="clock" size={12} color="#DC2626" />
            <Text style={styles.cardMetaText}>{item.time} min</Text>
          </View>
        </View>
      </TouchableOpacity>
    </FadeInView>
  );
};

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  cardContainer: {
    width: (width - 55) / 2,
    backgroundColor: "#fff",
    borderRadius: 20,
    marginBottom: 0,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    overflow: "visible", // Allowed for shadow
  },
  cardImageContainer: {
    width: "100%",
    height: 150,
    backgroundColor: "#F3F4F6",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: "hidden",
    position: "relative",
  },
  cardImage: {
    width: "100%",
    height: "100%",
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
  cardContent: {
    padding: 12,
    paddingBottom: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#1F2937",
    marginBottom: 8,
    lineHeight: 22,
  },
  cardMetaContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FEF2F2",
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  cardMetaText: {
    fontSize: 12,
    color: "#DC2626",
    fontWeight: "700",
    marginLeft: 4,
  },
});
export default RecipeCard;
