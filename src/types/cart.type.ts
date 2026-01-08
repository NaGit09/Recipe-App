import { Category } from "./categories";
import { Ingredient, IngredientItem } from "./ingredient.type";
import { NutritionItem } from "./nutrition.type";

export interface CartItem {
    ingredientId: string;
    name: string;
    quantity: number;
    unit: string;
    image?: string;
    price?: number;
}

export interface CartState {
    items: CartItemDetail[];
    isLoading: boolean;
    error: string | null;
    fetchCart: (userId: string) => Promise<void>;
    addToCart: (userId: string, req: AddCartReq) => Promise<void>;
    removeFromCart: (userId: string, req: AddCartReq) => Promise<void>;
    updateCartItem: (userId: string, req: AddCartReq) => Promise<void>;
    clearCart: () => void;
}

export interface AddCartReq {
    recipeId: string;
    quantity: number;
    ingredients: {
        id: string;
        quantity: number;
    }[];
}

export interface CartItemDetail {
    recipe: {
        id: string;
        name: string;
        description: string;
        image: string;
        instructions: string;
        time: number;
        category: Category;
        ingredients: IngredientItem[];
        nutritions: NutritionItem[];
    },
    items: {
        ingredient: Ingredient;
        quantity: number;
    }[]
}

export interface AddCartItem {
    userId: string;
    items: CartItemDetail[];
}