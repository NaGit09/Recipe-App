export interface Ingredient {
    id: string;
    name: string;
    image?: string;
    unit: string;
    price: number;
    stock: number;
}


export interface IngredientItem {
    ingredient: Ingredient;
    quantity: number;
}

export interface IngredientState {
    ingredients: Ingredient[];
    activeIngredient: Ingredient | null;
    loading: boolean;
    error: string | null;
    setIngredients: (ingredients: Ingredient[]) => void;
    getAllIngredients: () => Promise<void>;
    getIngredientById: (id: string) => Promise<void>;
    createIngredient: (ingredient: Ingredient) => Promise<void>;
    updateIngredient: (id: string, ingredient: Ingredient) => Promise<void>;
    deleteIngredient: (id: string) => Promise<void>;
}
