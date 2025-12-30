import { Nutrition } from "@/src/types/nutrition.type";
import axiosInstance from "../axiosInstance";

export const getAllNutrition = async (): Promise<Nutrition[]> => {
  return await axiosInstance.get("/nutrition");
};

export const getAllNutritionType = async (): Promise<string[]> => {
  return await axiosInstance.get("/nutrition/type");
};

export const getAllNutritionTypeName = async (): Promise<string> => {
  return await axiosInstance.get("/nutrition/type-name");
};

export const getNutritionById = async (id: string): Promise<Nutrition> => {
  return await axiosInstance.get(`/nutrition/${id}`);
};

export const createNutrition = async (
  nutrition: Nutrition
): Promise<Nutrition> => {
  return await axiosInstance.post("/nutrition", nutrition);
};

export const updateNutrition = async (
  id: string,
  nutrition: Nutrition
): Promise<Nutrition> => {
  return await axiosInstance.put(`/nutrition/${id}`, nutrition);
};

export const deleteNutrition = async (id: string): Promise<string> => {
  return await axiosInstance.delete(`/nutrition/${id}`);
};
