import { useAuthStore } from "@/src/stores/auth.store";
import { useCategoryStore } from "@/src/stores/category.store";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { Badge, Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  const [greeting, setGreeting] = useState("");
  const { user } = useAuthStore();

  const { categories, getAllCategories } = useCategoryStore();
  const username = user?.username || "Chef";

  useEffect(() => {
    getAllCategories();
  }, []);

  useEffect(() => {
    const hours = new Date().getHours();
    if (hours < 12) setGreeting("Good Morning");
    else if (hours < 18) setGreeting("Good Afternoon");
    else setGreeting("Good Evening");
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <View style={styles.greetingContainer}>
          <Text style={styles.greetingText}>{greeting},</Text>
          <Text style={styles.usernameText}>{username}!</Text>
        </View>

        <TouchableOpacity style={styles.cartContainer} onPress={() => {}}>
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
        <View style={styles.bannerContainer}>
          <Image
            source={require("@/src/assets/banner.jpg")}
            style={styles.bannerImage}
          />
          <View style={styles.bannerOverlay}>
            <Text style={styles.bannerText}>
              What would you like to cook today?
            </Text>
          </View>
        </View>

        {/* Categories Section */}
        <View style={styles.sectionHeader}>
          <Text variant="titleLarge" style={styles.sectionTitle}>
            Categories
          </Text>
          <TouchableOpacity>
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
            <TouchableOpacity style={styles.categoryCard}>
              <Text style={styles.categoryLabel}>{item.name}</Text>
            </TouchableOpacity>
          )}
        />

        {/* Popular Recipes Section */}
        <View style={[styles.sectionHeader, { marginTop: 24 }]}>
          <Text variant="titleLarge" style={styles.sectionTitle}>
            Popular Recipes
          </Text>
          <TouchableOpacity>
            <Text style={styles.seeAll}>See all</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.recipesGrid}>
          {/* Placeholder Recipe Cards */}
          {[1, 2, 3, 4].map((item) => (
            <View key={item} style={styles.recipeCard}>
              <View style={styles.recipeImagePlaceholder}>
                <MaterialCommunityIcons
                  name="food-turkey"
                  size={40}
                  color="#DC2626"
                />
              </View>
              <View style={styles.recipeInfo}>
                <Text style={styles.recipeTitle} numberOfLines={1}>
                  Delicious Recipe {item}
                </Text>
                <Text style={styles.recipeMeta}>20 mins • Easy</Text>
              </View>
            </View>
          ))}
        </View>
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
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  greetingContainer: {
    flex: 1,
  },
  greetingText: {
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "500",
  },
  usernameText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1F2937",
  },
  cartContainer: {
    padding: 8,
    position: "relative",
  },
  badge: {
    position: "absolute",
    top: 4,
    right: 4,
    backgroundColor: "#DC2626",
    color: "#fff",
    fontSize: 10,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  bannerContainer: {
    margin: 20,
    marginBottom: 24,
    borderRadius: 16,
    overflow: "hidden",
    position: "relative",
    backgroundColor: "#E5E7EB",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  bannerImage: {
    width: "100%",
    height: 180,
    resizeMode: "cover",
  },
  bannerOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.4)",
    padding: 16,
  },
  bannerText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  sectionTitle: {
    fontWeight: "bold",
    color: "#1F2937",
  },
  seeAll: {
    color: "#DC2626",
    fontWeight: "600",
  },
  categoriesList: {
    paddingHorizontal: 20,
    gap: 12,
  },
  categoryCard: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: "#DC2626",
    borderRadius: 24,
    marginRight: 8,
    elevation: 2,
    shadowColor: "#DC2626",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  categoryLabel: {
    fontSize: 14,
    color: "#fff",
    fontWeight: "600",
  },
  recipesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 20,
    gap: 16,
  },
  recipeCard: {
    width: "47%",
    backgroundColor: "#fff",
    borderRadius: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    overflow: "hidden",
  },
  recipeImagePlaceholder: {
    height: 120,
    backgroundColor: "#FEE2E2",
    justifyContent: "center",
    alignItems: "center",
  },
  recipeInfo: {
    padding: 12,
  },
  recipeTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 4,
  },
  recipeMeta: {
    fontSize: 12,
    color: "#6B7280",
  },
});
