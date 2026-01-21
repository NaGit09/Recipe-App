import { OrderRequest, OrderState } from "@/src/types/order.type";
import { create } from "zustand";
import { createOrder, getOrdersByUserId } from "../services/api/order.api";

export const useOrderStore = create<OrderState>((set, get) => ({
    orders: [],
    isLoading: false,
    error: null,

    createOrder: async (order: OrderRequest) => {
        try {
            set({ isLoading: true, error: null });
            await createOrder(order);
            set({ isLoading: false });
            return true;
        } catch (error: any) {
            set({
                isLoading: false,
                error: error.message || "Failed to create order",
            });
            console.error("Create order error:", error);
            return false;
        }
    },

    fetchOrders: async (userId: string) => {
        try {
            set({ isLoading: true, error: null });
            const response: any = await getOrdersByUserId(userId);
            set({
                orders: Array.isArray(response) ? response : [],
                isLoading: false,
            });
        } catch (error: any) {
            set({
                isLoading: false,
                error: error.message || "Failed to fetch orders",
            });
            console.error("Fetch orders error:", error);
        }
    },
}));
