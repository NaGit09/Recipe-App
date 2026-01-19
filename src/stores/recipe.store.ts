import { RecipeReq, RecipeState } from "@/src/types/recipe.type";
import { create } from "zustand";
import {
    addFavoriteRecipe,
    createRecipe,
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
    currentPage: 0,
    totalPages: 1,
    hasMore: true,
    setRecipes: (recipes) => set({ recipes }),

    getAllRecipes: async (page: number, size: number) => {
        set({ loading: true, error: null });
        try {
            const result = await getAllRecipes(page, size);

            set((state) => {
                const uniqueNewContent = result.content.filter(
                    (newRecipe) => !state.recipes.some((r) => r.id === newRecipe.id),
                );
                return {
                    recipes:
                        page === 0
                            ? result.content
                            : [...state.recipes, ...uniqueNewContent],
                    loading: false,
                    currentPage: result.number,
                    totalPages: result.totalPages,
                    hasMore: !result.last,
                };
            });
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

    getRecipesByCategoryId: async (
        categoryId: string,
        page: number,
        size: number,
    ) => {
        set({ loading: true, error: null });
        try {
            const result = await getRecipesByCategoryId(categoryId, page, size);

            set((state) => {
                const uniqueNewContent = result.content.filter(
                    (newRecipe) => !state.recipes.some((r) => r.id === newRecipe.id),
                );
                return {
                    recipes:
                        page === 0
                            ? result.content
                            : [...state.recipes, ...uniqueNewContent],
                    loading: false,
                    currentPage: result.number,
                    totalPages: result.totalPages,
                    hasMore: !result.last,
                };
            });
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
        set({ loading: true, error: null });
        try {
            await addFavoriteRecipe(recipeId);
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
            const favorites = await getMyFavoriteRecipes();
            set({ favoriteRecipes: favorites, loading: false });
        } catch (error: any) {
            set({ error: error.message, loading: false });
        }
    },

    createRecipe: async (data: RecipeReq) => {
        set({ loading: true, error: null });
        try {
            await createRecipe(data);
            await get().getMyRecipes();
            set({ loading: false });
            return true;
        } catch (error: any) {
            set({ error: error.message, loading: false });
            return false;
        }
    },
}));
