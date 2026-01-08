import { Ingredient } from "@/src/types/ingredient.type";
import axiosInstance from "../axiosInstance";

export const getAllIngredient = async (): Promise<Ingredient[]> => {
    return await axiosInstance.get("/ingredients");
};

export const getIngredientById = async (id: string): Promise<Ingredient> => {
    return await axiosInstance.get(`/ingredients/${id}`);
}

export const createIngredient = async (ingredient: Ingredient): Promise<Ingredient> => {
    return await axiosInstance.post("/ingredients", ingredient);
}

export const updateIngredient = async (id: string, ingredient: Ingredient): Promise<Ingredient> => {
    return await axiosInstance.put(`/ingredients/${id}`, ingredient);
}

export const deleteIngredient = async (id: string): Promise<string> => {
    return await axiosInstance.delete(`/ingredients/${id}`);
}
