import { Category } from "../types/categories";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getCategories } from "../services/api/category.api";

interface CategoryState {
    categories: Category[];
    isLoading: boolean;
    error: string | null;
    getAllCategories: () => Promise<Category[]>;
}

 
export const useCategoryStore = create(
    persist<CategoryState>(
        (set, get) => ({
            categories: [],
            isLoading: false,
            error: null,
            getAllCategories: async () => {
                try {
                    set({ isLoading: true });
                    const response = await getCategories()
                    set({ categories: response });
                    return response;
                } catch (error) {
                    set({ error: error as string });
                    return [];
                } finally {
                    set({ isLoading: false });
                }
            },
        }),
        {
            name: "category-store",
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
)
