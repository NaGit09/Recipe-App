import { create } from "zustand";

interface SearchState {
    keyword: string;
    activeCategory: string;
    setKeyword: (keyword: string) => void;
    setActiveCategory: (categoryId: string) => void;
    reset: () => void;
}

export const useSearchStore = create<SearchState>((set) => ({
    keyword: "",
    activeCategory: "All",
    setKeyword: (keyword) => set({ keyword }),
    setActiveCategory: (activeCategory) => set({ activeCategory }),
    reset: () => set({ keyword: "", activeCategory: "All" }),
}));
