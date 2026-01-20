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
            // Optionally fetch orders if needed immediately
            // await get().fetchOrders(order.userId);
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
            // Assuming response is the array of orders or has a property for it.
            // Based on axiosInstance, response is apiResponse.result.
            // Adjust if result is wrapped.
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
