import { RecipeState } from "@/src/types/recipe.type";
import { create } from "zustand";
import {
    addFavoriteRecipe,
    getAllRecipes,
    getMyFavoriteRecipes,
    getMyRecipes,
    getRecipeById,
    getRecipesByCategoryId,
    removeFavoriteRecipe,
} from "../services/api/recipe.api";

export const useRecipeStore = create<RecipeState>((set, get) => ({
    recipes: [],
    activeRecipe: null,
    myRecipes: [],
    favoriteRecipes: [],
    loading: false,
    error: null,
    setRecipes: (recipes) => set({ recipes }),

    getAllRecipes: async () => {
        set({ loading: true, error: null });
        try {
            const result = await getAllRecipes();
            set({ recipes: result, loading: false });
        } catch (error: any) {
            set({ error: error.message, loading: false });
        }
    },

    getRecipeById: async (id: string) => {
        set({ loading: true, error: null });
        try {
            const result = await getRecipeById(id);
            set({ activeRecipe: result, loading: false });
        } catch (error: any) {
            set({ error: error.message, loading: false });
        }
    },

    getRecipesByCategoryId: async (categoryId: string) => {
        set({ loading: true, error: null });
        try {
            const result = await getRecipesByCategoryId(categoryId);
            set({ recipes: result, loading: false });
        } catch (error: any) {
            set({ error: error.message, loading: false });
        }
    },

    getMyRecipes: async () => {
        set({ loading: true, error: null });
        try {
            const result = await getMyRecipes();
            set({ myRecipes: result, loading: false });
        } catch (error: any) {
            set({ error: error.message, loading: false });
        }
    },

    getMyFavoriteRecipes: async () => {
        set({ loading: true, error: null });
        try {
            const result = await getMyFavoriteRecipes();
            set({ favoriteRecipes: result, loading: false });
        } catch (error: any) {
            set({ error: error.message, loading: false });
        }
    },

    addFavoriteRecipe: async (recipeId: string) => {
        // Optimistic update could be handled here if we had the recipe object,
        // but for now we'll just refresh the favorites list.
        set({ loading: true, error: null });
        try {
            await addFavoriteRecipe(recipeId);
            // Refresh favorites
            const favorites = await getMyFavoriteRecipes();
            set({ favoriteRecipes: favorites, loading: false });
        } catch (error: any) {
            set({ error: error.message, loading: false });
        }
    },

    removeFavoriteRecipe: async (recipeId: string) => {
        set({ loading: true, error: null });
        try {
            await removeFavoriteRecipe(recipeId);
            // Refresh favorites
            const favorites = await getMyFavoriteRecipes();
            set({ favoriteRecipes: favorites, loading: false });
        } catch (error: any) {
            set({ error: error.message, loading: false });
        }
    },
}));
