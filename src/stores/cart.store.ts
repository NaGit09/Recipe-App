import { AddCartReq, CartState } from "@/src/types/cart.type";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import {
    addCart,
    getCart,
    removeCartItem,
    updateCart,
} from "../services/api/cart.api";

// Cart store handle cart operations
export const useCartStore = create(
    persist<CartState>(
        (set, get) => ({
            items: [],
            isLoading: false,
            error: null,

            fetchCart: async (userId: string) => {
                try {
                    set({ isLoading: true, error: null });
                    const cartData = await getCart(userId);

                    if (cartData && cartData.items) {
                        set({ items: cartData.items, isLoading: false });
                    } else {
                        set({ items: [], isLoading: false });
                    }

                } catch (error: any) {
                    set({ isLoading: false, error: error.message || "Failed to fetch cart" });
                    console.error("Fetch cart error:", error);
                }
            },

            addToCart: async (userId: string, req: AddCartReq) => {
                try {
                    set({ isLoading: true, error: null });
                    await addCart(userId, req);
                    await get().fetchCart(userId);
                } catch (error: any) {
                    set({ isLoading: false, error: error.message || "Failed to add to cart" });
                    console.error("Add to cart error:", error);
                }
            },

            removeFromCart: async (userId: string, req: AddCartReq) => {
                try {
                    set({ isLoading: true, error: null });
                    const success = await removeCartItem(userId, req);
                    if (success) {
                        await get().fetchCart(userId);
                    } else {
                        await get().fetchCart(userId);
                    }
                } catch (error: any) {
                    set({ isLoading: false, error: error.message || "Failed to remove from cart" });
                    console.error("Remove from cart error:", error);
                }
            },

            updateCartItem: async (userId: string, req: AddCartReq) => {
                try {
                    set({ isLoading: true, error: null });
                    const response: any = await updateCart(userId, req);
                    if (response && response.items) {
                        set({ items: response.items, isLoading: false });
                    } else {
                        await get().fetchCart(userId);
                    }
                } catch (error: any) {
                    set({ isLoading: false, error: error.message || "Failed to update cart" });
                    console.error("Update cart error:", error);
                }
            },

            clearCart: () => set({ items: [], error: null }),
        }),
        {
            name: "cart-storage",
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);
