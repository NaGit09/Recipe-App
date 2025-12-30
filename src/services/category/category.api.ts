import { CategoryResponse } from "@/src/types/recipe.type";
import axiosInstance from "../axiosInstance";

const API_PREFIX = '/recipe-app/api/v1';

export const getAllCategories = (): Promise<CategoryResponse[]> => {
    return axiosInstance.get(`${API_PREFIX}/categories`);
};

