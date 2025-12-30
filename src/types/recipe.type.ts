import { Category } from "./categories";
import { IngredientItem } from "./ingredient.type";
import { NutritionItem } from "./nutrition.type";

export interface Recipe {
    id: string;
    name: string;
    description: string;
    image: string;
    instructions: string;
    time: number;
    category: Category;
    ingredients: IngredientItem[];
    nutritions: NutritionItem[];
}

export interface RecipeState {
    recipes: Recipe[];
    activeRecipe: Recipe | null;
    myRecipes: Recipe[];
    favoriteRecipes: Recipe[];
    loading: boolean;
    error: string | null;

    setRecipes: (recipes: Recipe[]) => void;
    getAllRecipes: () => Promise<void>;
    getRecipeById: (id: string) => Promise<void>;
    getRecipesByCategoryId: (categoryId: string) => Promise<void>;
    getMyRecipes: () => Promise<void>;
    getMyFavoriteRecipes: () => Promise<void>;
    addFavoriteRecipe: (recipeId: string) => Promise<void>;
    removeFavoriteRecipe: (recipeId: string) => Promise<void>;
}
