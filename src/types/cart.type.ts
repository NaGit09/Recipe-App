
export interface CartItem {
    ingredientId: string;
    name: string;
    quantity: number;
    unit: string;
    image?: string;
    price?: number;
}

export interface CartState {
    items: CartItem[];
    addToCart: (item: CartItem) => void;
    removeFromCart: (ingredientId: string) => void;
    clearCart: () => void;
    getTotalItems: () => number;
}
