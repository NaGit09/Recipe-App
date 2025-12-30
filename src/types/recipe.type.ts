export interface CategoryResponse {
    id: string;
    name: string;
    status: string;
}

export interface IngredientResponse {
    id: string;
    name: string;
    image?: string;
}

export interface NutritionResponse {
    id: string;
    name: string;
    type: string;
}

export interface IngredientItemResponse {
    ingredient: IngredientResponse;
    quantity: number;
}

export interface NutritionItemResponse {
    nutrition: NutritionResponse;
    value: number;
}

export interface RecipeResponse {
    id: string;
    name: string;
    description: string;
    image: string;
    instructions: string;
    time: number;
    category: CategoryResponse;
    ingredients: IngredientItemResponse[];
    nutritions: NutritionItemResponse[];
}

