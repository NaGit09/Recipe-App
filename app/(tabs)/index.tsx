import { FadeInView } from "@/src/components/Animated/FadeInView";
import RecipeItem from "@/src/components/Recipe/RecipeItem";
import { useAuthStore } from "@/src/stores/auth.store";
import { useCartStore } from "@/src/stores/cart.store";
import { useCategoryStore } from "@/src/stores/category.store";
import { useRecipeStore } from "@/src/stores/recipe.store";
import { useSearchStore } from "@/src/stores/search.store";
import { handleCategoryPress, handleSeeAll } from "@/src/utils/helper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { ActivityIndicator, Badge, Text, useTheme } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  const router = useRouter();

  const theme = useTheme();

  const [greeting, setGreeting] = useState("");

  const { user } = useAuthStore();

  const { categories, getAllCategories } = useCategoryStore();

  const {
    recipes,
    getAllRecipes,
    getMyFavoriteRecipes,
    loading: recipesLoading,
    currentPage,
    hasMore,
  } = useRecipeStore();

  const { setActiveCategory, reset } = useSearchStore();
  
  const { items: cartItems, fetchCart } = useCartStore();

  const username = user?.username || "Chef";

  const totalCartItems = cartItems.reduce((acc, recipeItem) => {
    return (
      acc +
      (recipeItem.items || []).reduce((sum, item) => sum + item.quantity, 0)
    );
  }, 0);

  useEffect(() => {
    getAllCategories();
    getAllRecipes(0, 10);
    if (user?.id) {
      fetchCart(user.id);
      getMyFavoriteRecipes();
    }
  }, [user?.id]);

  useEffect(() => {
    const hours = new Date().getHours();
    if (hours < 12) setGreeting("Good Morning");
    else if (hours < 18) setGreeting("Good Afternoon");
    else setGreeting("Good Evening");
  }, []);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {

    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;

    const paddingToBottom = 20;

    const isCloseToBottom =
      layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom;

    if (isCloseToBottom && hasMore && !recipesLoading) {
      getAllRecipes(currentPage + 1, 10);
    }
  };

  const popularRecipes = recipes;

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      {/* Header Section */}
      <View style={[styles.header, { backgroundColor: theme.colors.surface }]}>
        <View style={styles.greetingContainer}>
          <Text
            style={[styles.greetingText, { color: theme.colors.secondary }]}
          >
            {greeting},
          </Text>
          <Text
            style={[styles.usernameText, { color: theme.colors.onSurface }]}
          >
            {username}!
          </Text>
        </View>

        <TouchableOpacity
          style={[
            styles.cartContainer,
            { backgroundColor: theme.colors.primaryContainer },
          ]}
          onPress={() => router.push("/cart")}
        >
          <MaterialCommunityIcons
            name="cart-outline"
            size={28}
            color={theme.colors.primary}
          />
          <Badge
            style={[
              styles.badge,
              {
                backgroundColor: theme.colors.primary,
                borderColor: theme.colors.surface,
              },
            ]}
            size={16}
          >
            {totalCartItems}
          </Badge>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
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
            <Text
              variant="titleLarge"
              style={[styles.sectionTitle, { color: theme.colors.onSurface }]}
            >
              Categories
            </Text>
            <TouchableOpacity onPress={() => handleSeeAll(reset)}>
              <Text style={[styles.seeAll, { color: theme.colors.primary }]}>
                See all
              </Text>
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
                style={[
                  styles.categoryCard,
                  {
                    backgroundColor: theme.colors.surface,
                    borderColor: theme.colors.outlineVariant,
                  },
                ]}
                onPress={() => handleCategoryPress(item.id, setActiveCategory)}
              >
                <Text
                  style={[
                    styles.categoryLabel,
                    { color: theme.colors.onSurface },
                  ]}
                >
                  {item.name}
                </Text>
              </TouchableOpacity>
            )}
          />
        </FadeInView>

        {/* Popular Recipes Section */}
        <FadeInView delay={300} duration={600}>
          <View style={styles.sectionHeader}>
            <Text
              variant="titleLarge"
              style={[styles.sectionTitle, { color: theme.colors.onSurface }]}
            >
              Fresh Recipes
            </Text>
            <TouchableOpacity onPress={() => handleSeeAll(reset)}>
              <Text style={[styles.seeAll, { color: theme.colors.primary }]}>
                See all
              </Text>
            </TouchableOpacity>
          </View>
        </FadeInView>

        <View style={styles.recipesGrid}>
          {popularRecipes.map((item, index) => (
            <RecipeItem key={item.id} item={item} index={index} />
          ))}
          {popularRecipes.length === 0 && !recipesLoading && (
            <Text
              style={{
                textAlign: "center",
                width: "100%",
                color: theme.colors.secondary,
                marginTop: 20,
              }}
            >
              No recipes found.
            </Text>
          )}
        </View>

        {recipesLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color={theme.colors.primary} />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingBottom: 8,
  },
  greetingContainer: {
    flex: 1,
  },
  greetingText: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 4,
  },
  usernameText: {
    fontSize: 26,
    fontWeight: "800",
    letterSpacing: -0.5,
  },
  cartContainer: {
    padding: 10,
    borderRadius: 14,
    position: "relative",
  },
  badge: {
    position: "absolute",
    top: -6,
    right: -6,
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "bold",
    borderWidth: 2,
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
    letterSpacing: -0.3,
  },
  seeAll: {
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
    borderRadius: 20, // Pill shape
    marginRight: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    borderWidth: 1,
  },
  categoryLabel: {
    fontSize: 14,
    fontWeight: "700",
  },
  recipesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 16,
  },
  loadingContainer: {
    padding: 40,
    alignItems: "center",
    justifyContent: "center",
  },
});
