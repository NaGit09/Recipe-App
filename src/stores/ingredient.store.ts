import { Ingredient, IngredientState } from "@/src/types/ingredient.type";
import { create } from "zustand";
import {
    createIngredient,
    deleteIngredient,
    getAllIngredient,
    getIngredientById,
    updateIngredient
} from "../services/api/ingredient.api";

export const useIngredientStore = create<IngredientState>((set) => ({
    ingredients: [],
    activeIngredient: null,
    loading: false,
    error: null,
    setIngredients: (ingredients) => set({ ingredients }),

    getAllIngredients: async () => {
        set({ loading: true, error: null });
        try {
            const result = await getAllIngredient();
            set({ ingredients: result, loading: false });
        } catch (error: any) {
            set({ error: error.message, loading: false });
        }
    },

    getIngredientById: async (id: string) => {
        set({ loading: true, error: null });
        try {
            const result = await getIngredientById(id);
            set({ activeIngredient: result, loading: false });
        } catch (error: any) {
            set({ error: error.message, loading: false });
        }
    },

    createIngredient: async (ingredient: Ingredient) => {
        set({ loading: true, error: null });
        try {
            await createIngredient(ingredient);
            const result = await getAllIngredient();
            set({ ingredients: result, loading: false });
        } catch (error: any) {
            set({ error: error.message, loading: false });
        }
    },

    updateIngredient: async (id: string, ingredient: Ingredient) => {
        set({ loading: true, error: null });
        try {
            await updateIngredient(id, ingredient);
            const result = await getAllIngredient();
            set({ ingredients: result, loading: false });
        } catch (error: any) {
            set({ error: error.message, loading: false });
        }
    },

    deleteIngredient: async (id: string) => {
        set({ loading: true, error: null });
        try {
            await deleteIngredient(id);
            const result = await getAllIngredient();
            set({ ingredients: result, loading: false });
        } catch (error: any) {
            set({ error: error.message, loading: false });
        }
    }
}));
