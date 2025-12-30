import React, { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { IconButton, Text, TextInput } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "expo-image";
import { getAllCategories } from "@/src/services/category/category.api";
import { getAllRecipes, getRecipesByCategoryId } from "@/src/services/recipe/recipe.api";
import { CategoryResponse, RecipeResponse } from "@/src/types/recipe.type";

const Search = () => {
    const [keyword, setKeyword] = useState("");
    const [categories, setCategories] = useState<CategoryResponse[]>([]);
    const [activeCategory, setActiveCategory] = useState<CategoryResponse | null>(null);
    const [allRecipes, setAllRecipes] = useState<RecipeResponse[]>([]);
    const [filteredRecipes, setFilteredRecipes] = useState<RecipeResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingRecipes, setLoadingRecipes] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Fetch categories on mount
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                setLoading(true);
                const categoriesData = await getAllCategories();
                setCategories(categoriesData);
                if (categoriesData.length > 0) {
                    setActiveCategory(categoriesData[0]);
                }
            } catch (err: any) {
                setError(err.message || "Failed to load categories");
                console.error("Error fetching categories:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);

    // Fetch recipes when category changes
    useEffect(() => {
        const fetchRecipes = async () => {
            if (!activeCategory) return;

            try {
                setLoadingRecipes(true);
                setError(null);
                const recipesData = await getRecipesByCategoryId(activeCategory.id);
                setAllRecipes(recipesData);
                setFilteredRecipes(recipesData);
            } catch (err: any) {
                setError(err.message || "Failed to load recipes");
                console.error("Error fetching recipes:", err);
            } finally {
                setLoadingRecipes(false);
            }
        };

        fetchRecipes();
    }, [activeCategory]);

    // Filter recipes by keyword
    useEffect(() => {
        if (!keyword.trim()) {
            setFilteredRecipes(allRecipes);
            return;
        }

        const filtered = allRecipes.filter((recipe) =>
            recipe.name.toLowerCase().includes(keyword.toLowerCase()) ||
            recipe.description?.toLowerCase().includes(keyword.toLowerCase())
        );
        setFilteredRecipes(filtered);
    }, [keyword, allRecipes]);

    // Get popular recipes (first 3)
    const popularRecipes = filteredRecipes.slice(0, 3);

    // Get editor's choice (next 2 after popular)
    const editorChoice = filteredRecipes.slice(3, 5);

    if (loading && categories.length === 0) {
        return (
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#4DB6AC" />
                    <Text style={styles.loadingText}>Loading...</Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView
                style={styles.container}
                showsVerticalScrollIndicator={false}
            >
                {/* Search input */}
                <TextInput
                    mode="outlined"
                    placeholder="Search"
                    value={keyword}
                    onChangeText={setKeyword}
                    style={styles.searchInput}
                    left={<TextInput.Icon icon="magnify" />}
                />

                {/* Category */}
                <View style={styles.categoryContainer}>
                    {categories.map((category) => (
                        <TouchableOpacity
                            key={category.id}
                            style={[
                                styles.categoryButton,
                                activeCategory?.id === category.id && styles.categoryActive,
                            ]}
                            onPress={() => setActiveCategory(category)}
                        >
                            <Text
                                style={[
                                    styles.categoryText,
                                    activeCategory?.id === category.id && styles.categoryTextActive,
                                ]}
                            >
                                {category.name}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {error && (
                    <View style={styles.errorContainer}>
                        <Text style={styles.errorText}>{error}</Text>
                    </View>
                )}

                {loadingRecipes && (
                    <View style={styles.recipesLoadingContainer}>
                        <ActivityIndicator size="small" color="#4DB6AC" />
                        <Text style={styles.recipesLoadingText}>Loading recipes...</Text>
                    </View>
                )}

                {/* Popular Recipes */}
                {!loadingRecipes && popularRecipes.length > 0 && (
                    <>
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}>Popular Recipes</Text>
                            <Text style={styles.viewAll}>View All</Text>
                        </View>

                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                            {popularRecipes.map((recipe) => (
                                <TouchableOpacity key={recipe.id} style={styles.popularCard}>
                                    {recipe.image ? (
                                        <Image
                                            source={{ uri: recipe.image }}
                                            style={styles.recipeImage}
                                            contentFit="cover"
                                        />
                                    ) : (
                                        <View style={styles.imagePlaceholder} />
                                    )}
                                    <Text style={styles.popularTitle} numberOfLines={2}>
                                        {recipe.name}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </>
                )}

                {/* Editor's Choice */}
                {!loadingRecipes && editorChoice.length > 0 && (
                    <>
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}>Editor's Choice</Text>
                            <Text style={styles.viewAll}>View All</Text>
                        </View>

                        {editorChoice.map((recipe) => (
                            <TouchableOpacity key={recipe.id} style={styles.editorCard}>
                                {recipe.image ? (
                                    <Image
                                        source={{ uri: recipe.image }}
                                        style={styles.editorImage}
                                        contentFit="cover"
                                    />
                                ) : (
                                    <View style={styles.editorImagePlaceholder} />
                                )}
                                <View style={styles.editorContent}>
                                    <Text style={styles.editorTitle} numberOfLines={2}>
                                        {recipe.name}
                                    </Text>
                                    {recipe.description && (
                                        <Text style={styles.editorAuthor} numberOfLines={1}>
                                            {recipe.description}
                                        </Text>
                                    )}
                                </View>
                                <IconButton icon="arrow-right" />
                            </TouchableOpacity>
                        ))}
                    </>
                )}

                {!loading && filteredRecipes.length === 0 && (
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>
                            {keyword ? "No recipes found matching your search" : "No recipes available"}
                        </Text>
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: "#fff",
    },

    container: {
        paddingHorizontal: 16,
    },

    searchInput: {
        marginBottom: 16,
    },

    categoryContainer: {
        flexDirection: "row",
        marginBottom: 20,
    },

    categoryButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: "#F1F1F1",
        marginRight: 10,
    },

    categoryActive: {
        backgroundColor: "#4DB6AC",
    },

    categoryText: {
        color: "#555",
    },

    categoryTextActive: {
        color: "#fff",
        fontWeight: "600",
    },

    sectionHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 12,
    },

    sectionTitle: {
        fontSize: 18,
        fontWeight: "700",
    },

    viewAll: {
        color: "#4DB6AC",
    },

    popularCard: {
        width: 140,
        marginRight: 12,
    },

    imagePlaceholder: {
        height: 120,
        borderRadius: 16,
        backgroundColor: "#E0E0E0",
        marginBottom: 6,
    },

    recipeImage: {
        width: "100%",
        height: 120,
        borderRadius: 16,
        marginBottom: 6,
    },

    popularTitle: {
        fontWeight: "500",
    },

    editorCard: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#F9F9F9",
        borderRadius: 16,
        padding: 10,
        marginBottom: 12,
    },

    editorImage: {
        width: 70,
        height: 70,
        borderRadius: 14,
    },

    editorImagePlaceholder: {
        width: 70,
        height: 70,
        borderRadius: 14,
        backgroundColor: "#E0E0E0",
    },

    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },

    loadingText: {
        marginTop: 10,
        color: "#666",
    },

    errorContainer: {
        backgroundColor: "#FFEBEE",
        padding: 12,
        borderRadius: 8,
        marginBottom: 16,
    },

    errorText: {
        color: "#C62828",
        textAlign: "center",
    },

    emptyContainer: {
        padding: 40,
        alignItems: "center",
    },

    emptyText: {
        color: "#888",
        fontSize: 16,
    },

    recipesLoadingContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
    },

    recipesLoadingText: {
        marginLeft: 10,
        color: "#666",
    },

    editorContent: {
        flex: 1,
        marginLeft: 10,
    },

    editorTitle: {
        fontWeight: "600",
        marginBottom: 4,
    },

    editorAuthor: {
        color: "#888",
        fontSize: 12,
    },
});

export default Search;
