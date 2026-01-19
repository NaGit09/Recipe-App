import { Category } from "./categories";
import { IngredientItem } from "./ingredient.type";
import { NutritionItem } from "./nutrition.type";
import { UserInfo } from "./user.type";

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
    author?: UserInfo;
}

export interface RecipeState {
    recipes: Recipe[];
    activeRecipe: Recipe | null;
    myRecipes: Recipe[];
    favoriteRecipes: Recipe[];
    loading: boolean;
    error: string | null;
    currentPage: number;
    totalPages: number;
    hasMore: boolean;

    setRecipes: (recipes: Recipe[]) => void;
    getAllRecipes: (page: number, size: number) => Promise<void>;
    getRecipeById: (id: string) => Promise<void>;
    getRecipesByCategoryId: (
        categoryId: string,
        page: number,
        size: number,
    ) => Promise<void>;
    getMyRecipes: () => Promise<void>;
    getMyFavoriteRecipes: () => Promise<void>;
    addFavoriteRecipe: (recipeId: string) => Promise<void>;
    removeFavoriteRecipe: (recipeId: string) => Promise<void>;
    createRecipe: (data: RecipeReq) => Promise<boolean>;
}

export interface RecipeReq {
    name: string;
    description: string;
    image: {
        uri: string;
        name: string;
        type: string;
    };
    instructions: string;
    time: number;
    categoryId: string;
    ingredients: {
        ingredientId: string;
        quantity: number;
    }[];
    nutritions: {
        nutritionId: string;
        value: number;
    }[];
}

export interface RecipePagination {
    content: Recipe[];
    pageable: {
        pageNumber: number;
        pageSize: number;
        sort: {
            sorted: boolean;
            unsorted: boolean;
            empty: boolean;
        };
        offset: number;
        paged: boolean;
        unpaged: boolean;
    };
    totalElements: number;
    totalPages: number;
    last: boolean;
    number: number;
    size: number;
    sort: {
        sorted: boolean;
        unsorted: boolean;
        empty: boolean;
    };
    numberOfElements: number;
    first: boolean;
    empty: boolean;
}
