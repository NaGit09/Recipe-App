import { CartState } from "@/src/types/cart.type";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export const useCartStore = create(
    persist<CartState>(
        (set, get) => ({
            items: [],
            addToCart: (item) => {
                const currentItems = get().items;
                const existingItemIndex = currentItems.findIndex(
                    (i) => i.ingredientId === item.ingredientId
                );

                if (existingItemIndex > -1) {
                    // Update quantity if already exists
                    const updatedItems = [...currentItems];
                    updatedItems[existingItemIndex].quantity += item.quantity;
                    set({ items: updatedItems });
                } else {
                    // Add new item
                    set({ items: [...currentItems, item] });
                }
            },
            removeFromCart: (ingredientId) => {
                set({
                    items: get().items.filter((i) => i.ingredientId !== ingredientId),
                });
            },
            clearCart: () => set({ items: [] }),
            getTotalItems: () => get().items.length,
        }),
        {
            name: "cart-storage",
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);
