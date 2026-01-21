import {
  getTotalIngredient,
  getTotalRecipe,
  getTotalUser,
} from "@/src/services/api/total.api";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Card, IconButton, Text, useTheme } from "react-native-paper";

export default function AdminDashboard() {
  const router = useRouter();
  const theme = useTheme();

  const [counts, setCounts] = useState({
    users: 0,
    recipes: 0,
    ingredients: 0,
    orders: 5,
  });

  const handleLogout = async () => {
    const { logout } =
      require("@/src/stores/auth.store").useAuthStore.getState();
    await logout();
    router.replace("/login");
  };
  
  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const [userRes, recipeRes, ingredientRes] = await Promise.all([
          getTotalUser(),
          getTotalRecipe(),
          getTotalIngredient(),
        ]);
        setCounts({
          users: userRes,
          recipes: recipeRes,
          ingredients: ingredientRes,
          orders: 5,
        });
      } catch (error) {
        console.error("Failed to fetch dashboard counts:", error);
      }
    };

    fetchCounts();
  }, []);

  const menuItems = [
    {
      title: "User",
      route: "/admin/users",
      count: `${counts.users} Users`,
      icon: "account-group",
    },
    {
      title: "Recipe",
      route: "/admin/recipes",
      count: `${counts.recipes} Recipes`,
      icon: "food-variant",
    },
    {
      title: "Order",
      route: "/admin/orders",
      count: `${counts.orders} New Orders`,
      icon: "clipboard-list",
    },
    {
      title: "Ingredient",
      route: "/admin/ingredients",
      count: `${counts.ingredients} Ingredients`,
      icon: "shaker",
    },
  ];

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 24,
        }}
      >
        <View>
          <Text variant="headlineMedium" style={styles.title}>
            Admin Dashboard
          </Text>
          <Text variant="bodyLarge" style={styles.subtitle}>
            Overview & Controls
          </Text>
        </View>
        <IconButton
          icon="logout"
          mode="contained"
          containerColor={theme.colors.errorContainer}
          iconColor={theme.colors.error}
          onPress={handleLogout}
        />
      </View>

      <View style={styles.grid}>
        {menuItems.map((item, index) => (
          <Card
            key={index}
            style={styles.card}
            onPress={() => router.push(item.route as any)}
            mode="elevated"
          >
            <Card.Content style={styles.cardContent}>
              <IconButton
                icon={item.icon}
                size={32}
                iconColor={theme.colors.primary}
                style={{ marginBottom: 8 }}
              />
              <Text variant="titleMedium" style={styles.cardTitle}>
                {item.title}
              </Text>
              <Text
                variant="headlineSmall"
                style={[styles.cardCount, { color: theme.colors.onSurface }]}
              >
                {item.count}
              </Text>
            </Card.Content>
          </Card>
        ))}
      </View>
      
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontWeight: "bold",
  },
  subtitle: {
    opacity: 0.7,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  card: {
    width: "48%",
    marginBottom: 16,
    elevation: 2,
  },
  cardContent: {
    alignItems: "center",
    paddingVertical: 16,
  },
  cardTitle: {
    marginBottom: 8,
    textAlign: "center",
  },
  cardCount: {
    fontWeight: "bold",
  },
});
