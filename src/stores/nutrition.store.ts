import { Nutrition, NutritionState } from "@/src/types/nutrition.type";
import { create } from "zustand";
import {
    createNutrition,
    deleteNutrition,
    getAllNutrition,
    getAllNutritionType,
    getNutritionById,
    updateNutrition,
} from "../services/api/nutrition.api";

export const useNutritionStore = create<NutritionState>((set) => ({
    nutritions: [],
    activeNutrition: null,
    nutritionTypes: [],
    loading: false,
    error: null,
    setNutritions: (nutritions) => set({ nutritions }),

    getAllNutritions: async () => {
        set({ loading: true, error: null });
        try {
            const result = await getAllNutrition();
            set({ nutritions: result, loading: false });
        } catch (error: any) {
            set({ error: error.message, loading: false });
        }
    },

    getAllNutritionTypes: async () => {
        set({ loading: true, error: null });
        try {
            const result = await getAllNutritionType();
            set({ nutritionTypes: result, loading: false });
        } catch (error: any) {
            set({ error: error.message, loading: false });
        }
    },

    getNutritionById: async (id: string) => {
        set({ loading: true, error: null });
        try {
            const result = await getNutritionById(id);
            set({ activeNutrition: result, loading: false });
        } catch (error: any) {
            set({ error: error.message, loading: false });
        }
    },

    createNutrition: async (nutrition: Nutrition) => {
        set({ loading: true, error: null });
        try {
            await createNutrition(nutrition);
            const result = await getAllNutrition();
            set({ nutritions: result, loading: false });
        } catch (error: any) {
            set({ error: error.message, loading: false });
        }
    },

    updateNutrition: async (id: string, nutrition: Nutrition) => {
        set({ loading: true, error: null });
        try {
            await updateNutrition(id, nutrition);
            const result = await getAllNutrition();
            set({ nutritions: result, loading: false });
        } catch (error: any) {
            set({ error: error.message, loading: false });
        }
    },

    deleteNutrition: async (id: string) => {
        set({ loading: true, error: null });
        try {
            await deleteNutrition(id);
            const result = await getAllNutrition();
            set({ nutritions: result, loading: false });
        } catch (error: any) {
            set({ error: error.message, loading: false });
        }
    },
}));
