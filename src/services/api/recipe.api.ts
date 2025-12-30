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

