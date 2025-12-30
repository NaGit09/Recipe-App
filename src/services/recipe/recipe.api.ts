import { RecipeResponse } from "@/src/types/recipe.type";
import axiosInstance from "../axiosInstance";

const API_PREFIX = '/recipe-app/api/v1';

export const getAllRecipes = (): Promise<RecipeResponse[]> => {
    return axiosInstance.get(`${API_PREFIX}/recipes`);
};

export const getRecipeById = (id: string): Promise<RecipeResponse> => {
    return axiosInstance.get(`${API_PREFIX}/recipes/${id}`);
};

export const getRecipesByCategoryId = (categoryId: string): Promise<RecipeResponse[]> => {
    return axiosInstance.get(`${API_PREFIX}/recipes/${categoryId}/category`);
};

export const getMyRecipes = (): Promise<RecipeResponse[]> => {
    return axiosInstance.get(`${API_PREFIX}/recipes/me`);
};

export const getMyFavoriteRecipes = (): Promise<RecipeResponse[]> => {
    return axiosInstance.get(`${API_PREFIX}/recipes/favorites`);
};

export const addFavoriteRecipe = (recipeId: string): Promise<string> => {
    return axiosInstance.post(`${API_PREFIX}/recipes/${recipeId}/favorite`);
};

export const removeFavoriteRecipe = (recipeId: string): Promise<string> => {
    return axiosInstance.delete(`${API_PREFIX}/recipes/${recipeId}/favorite`);
};

