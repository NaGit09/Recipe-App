import { FadeInView } from "@/src/components/Animated/FadeInView";
import { useAuthStore } from "@/src/stores/auth.store";
import { useCategoryStore } from "@/src/stores/category.store";
import { useRecipeStore } from "@/src/stores/recipe.store";
import { useSearchStore } from "@/src/stores/search.store";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { ActivityIndicator, Badge, Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  const router = useRouter();
  const [greeting, setGreeting] = useState("");
  const { user } = useAuthStore();
  const { categories, getAllCategories } = useCategoryStore();
  const { recipes, getAllRecipes, loading: recipesLoading } = useRecipeStore();
  const { setActiveCategory, reset } = useSearchStore();

  const username = user?.username || "Chef";

  useEffect(() => {
    getAllCategories();
    getAllRecipes();
  }, []);

  useEffect(() => {
    const hours = new Date().getHours();
    if (hours < 12) setGreeting("Good Morning");
    else if (hours < 18) setGreeting("Good Afternoon");
    else setGreeting("Good Evening");
  }, []);

  const handleSeeAll = () => {
    reset();
    router.push("/(tabs)/search");
  };

  const handleCategoryPress = (categoryId: string) => {
    setActiveCategory(categoryId);
    router.push("/(tabs)/search");
  };

  const handleRecipePress = (recipeId: string) => {
    router.push(`/recipe/${recipeId}`);
  };

  const popularRecipes = recipes.slice(0, 4);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <View style={styles.greetingContainer}>
          <Text style={styles.greetingText}>{greeting},</Text>
          <Text style={styles.usernameText}>{username}!</Text>
        </View>

        <TouchableOpacity
          style={styles.cartContainer}
          onPress={() => router.push("/cart")}
        >
          <MaterialCommunityIcons
            name="cart-outline"
            size={28}
            color="#DC2626"
          />
          <Badge style={styles.badge} size={16}>
            3
          </Badge>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Banner Section */}
        <FadeInView delay={200} duration={600}>
          <View style={styles.bannerContainer}>
            <Image
              source={require("@/src/assets/banner.jpg")}
              style={styles.bannerImage}
            />
          </View>
        </FadeInView>
        {/* Categories Section */}
        <FadeInView delay={100} duration={600}>
          <View style={styles.sectionHeader}>
            <Text variant="titleLarge" style={styles.sectionTitle}>
              Categories
            </Text>
            <TouchableOpacity onPress={handleSeeAll}>
              <Text style={styles.seeAll}>See all</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={categories}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.categoriesList}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.categoryCard}
                onPress={() => handleCategoryPress(item.id)}
              >
                <Text style={styles.categoryLabel}>{item.name}</Text>
              </TouchableOpacity>
            )}
          />
        </FadeInView>

        {/* Popular Recipes Section */}
        <FadeInView delay={300} duration={600}>
          <View style={styles.sectionHeader}>
            <Text variant="titleLarge" style={styles.sectionTitle}>
              Fresh Recipes
            </Text>
            <TouchableOpacity onPress={handleSeeAll}>
              <Text style={styles.seeAll}>See all</Text>
            </TouchableOpacity>
          </View>
        </FadeInView>

        {recipesLoading && recipes.length === 0 ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color="#DC2626" />
          </View>
        ) : (
          <View style={styles.recipesGrid}>
            {popularRecipes.map((item, index) => (
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
                      <Image
                        source={{ uri: item.image }}
                        style={styles.recipeImage}
                      />
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
            ))}
            {popularRecipes.length === 0 && !recipesLoading && (
              <Text
                style={{ textAlign: "center", width: "100%", color: "gray" }}
              >
                No recipes found.
              </Text>
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingBottom: 8,
    backgroundColor: "#fff",
  },
  greetingContainer: {
    flex: 1,
  },
  greetingText: {
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "600",
    marginBottom: 4,
  },
  usernameText: {
    fontSize: 26,
    fontWeight: "800",
    color: "#1F2937",
    letterSpacing: -0.5,
  },
  cartContainer: {
    padding: 10,
    backgroundColor: "#FEF2F2",
    borderRadius: 14,
    position: "relative",
  },
  badge: {
    position: "absolute",
    top: -6,
    right: -6,
    backgroundColor: "#DC2626",
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "bold",
    borderWidth: 2,
    borderColor: "#fff",
  },
  scrollContent: {
    paddingBottom: 40,
    paddingTop: 0,
  },
  bannerContainer: {
    width: "100%",
    marginBottom: 24,
    height: 200,
  },
  bannerImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#1F2937",
    letterSpacing: -0.3,
  },
  seeAll: {
    color: "#DC2626",
    fontWeight: "700",
    fontSize: 14,
  },
  categoriesList: {
    paddingHorizontal: 24,
    paddingBottom: 8,
  },
  categoryCard: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: "#fff",
    borderRadius: 20, // Pill shape
    marginRight: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: "#F3F4F6",
  },
  categoryLabel: {
    fontSize: 14,
    color: "#4B5563",
    fontWeight: "700",
  },
  recipesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 16, // Reduced to balance with negative margins if needed
  },
  loadingContainer: {
    padding: 40,
    alignItems: "center",
    justifyContent: "center",
  },
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
