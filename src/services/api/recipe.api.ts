import { Recipe } from "@/src/types/recipe.type";
import axiosInstance from "../axiosInstance";

export const getAllRecipes = (): Promise<Recipe[]> => {
    return axiosInstance.get(`/recipes`);
};

export const getRecipeById = (id: string): Promise<Recipe> => {
    return axiosInstance.get(`/recipes/${id}`);
};

export const getRecipesByCategoryId = (categoryId: string): Promise<Recipe[]> => {
    return axiosInstance.get(`/recipes/${categoryId}/category`);
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
            if (key === 'ingredients' || key === 'nutritions' || key === 'instructions') {
                // Often these need to be JSON stringified if sent as form-data arrays/objects
                // or appended individually. Let's assume JSON string for objects in array for now
                // based on common patterns, OR append loop. 
                // If the backend expects JSON body, we shouldn't use FormData. 
                // But for Image upload, we usually need FormData.
                // Let's assume we append as JSON string for complex arrays if the backend handles it,
                // or just append them if the key allows multiple values.
                // Given the previous user.api update using append(key, item), let's try that or JSON.
                // For safety with complex nested objects in FormData, JSON.stringify is often safest 
                // if the backend parses it.
                formData.append(key, JSON.stringify(value));
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

