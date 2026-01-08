import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { getCategories } from "../services/api/category.api";
import { Category } from "../types/categories";

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
                    set({ categories: response, isLoading: false });
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
            partialize: (state) => ({ categories: state.categories } as CategoryState),
        }
    )
)
