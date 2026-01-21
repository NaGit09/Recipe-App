import { Ingredient } from "./ingredient.type";

export enum OrderStatus {
    PENDING,
    SUCCESS,
    FAILED,
    REFUNDED,
    CANCELLED,
}

export enum PaymentMethod {
    COD,
    VN_PAY,
    CREDIT_CARD,
}
export interface OrderItem {
    ingredient: Ingredient;
    quantity: number;
}

export interface Order {
    id: string;
    userId: string;
    totalPrice: number;
    status: string;
    createdAt: Date;
    paymentMethod: string;
    paymentStatus: string;
    orderItems: OrderItem[];
}

export interface OrderRequest {
    userId: string;
    recipeId?: string;
    paymentMethod: string;
    orderStatus: string;
}

export interface OrderState {
    orders: Order[];
    isLoading: boolean;
    error: string | null;
    createOrder: (order: OrderRequest) => Promise<boolean>;
    fetchOrders: (userId: string) => Promise<void>;
}
