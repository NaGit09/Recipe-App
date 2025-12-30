import { Ingredient } from "@/src/types/ingredient.type";
import axiosInstance from "../axiosInstance";

export const getAllIngredient = async (): Promise<Ingredient[]> => {
    return await axiosInstance.get("/ingredient");
};

export const getIngredientById = async (id: string): Promise<Ingredient> => {
    return await axiosInstance.get(`/ingredient/${id}`);
}

export const createIngredient = async (ingredient: Ingredient): Promise<Ingredient> => {
    return await axiosInstance.post("/ingredient", ingredient);
}

export const updateIngredient = async (id: string, ingredient: Ingredient): Promise<Ingredient> => {
    return await axiosInstance.put(`/ingredient/${id}`, ingredient);
}

export const deleteIngredient = async (id: string): Promise<string> => {
    return await axiosInstance.delete(`/ingredient/${id}`);
}
