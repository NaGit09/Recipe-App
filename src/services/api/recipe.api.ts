import { Recipe, RecipePagination } from "@/src/types/recipe.type";
import axiosInstance from "../axiosInstance";

export const getAllRecipes = (
    page: number,
    size: number,
): Promise<RecipePagination> => {
    return axiosInstance.get(`/recipes?page=${page}&size=${size}`);
};

export const getRecipeById = (id: string): Promise<Recipe> => {
    return axiosInstance.get(`/recipes/${id}`);
};

export const getRecipesByCategoryId = (
    categoryId: string,
    page: number,
    size: number,
): Promise<RecipePagination> => {
    return axiosInstance.get(
        `/recipes/${categoryId}/category?page=${page}&size=${size}`,
    );
};

export const getMyRecipes = (): Promise<Recipe[]> => {
    return axiosInstance.get(`/recipes/me`);
};

export const getMyFavoriteRecipes = (): Promise<Recipe[]> => {
    return axiosInstance.get(`/recipes/favorites`);
};

export const addFavoriteRecipe = (recipeId: string): Promise<string> => {
    return axiosInstance.post(`/recipes/${recipeId}/favorite`);
};

export const removeFavoriteRecipe = (recipeId: string): Promise<string> => {
    return axiosInstance.delete(`/recipes/${recipeId}/favorite`);
};

export const createRecipe = async (data: any): Promise<Recipe> => {
    const formData = new FormData();
    Object.keys(data).forEach((key) => {
        const value = data[key];
        if (value !== undefined && value !== null) {
            if (key === "ingredients" && Array.isArray(value)) {
                value.forEach((item: any, index: number) => {
                    formData.append(
                        `ingredients[${index}].ingredientId`,
                        item.ingredientId,
                    );
                    formData.append(
                        `ingredients[${index}].quantity`,
                        item.quantity.toString(),
                    );
                });
            } else if (key === "nutritions" && Array.isArray(value)) {
                value.forEach((item: any, index: number) => {
                    formData.append(`nutritions[${index}].nutritionId`, item.nutritionId);
                    formData.append(`nutritions[${index}].value`, item.value.toString());
                });
            } else {
                formData.append(key, value);
            }
        }
    });

    return await axiosInstance.post("/recipes", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
};
