import { Category } from "@/src/types/categories";
import axiosInstance from "../axiosInstance";

// Admin api
export const createCategory = async (dto: Category) => {
    return await axiosInstance.post('/categories', dto);
}

export const getCategories = async () : Promise<Category[]> => {
    return await axiosInstance.get('/categories');
}

export const updateCategory = async (id: string) => {
    return await axiosInstance.put(`/categories/${id}`);
}

export const deleteCategory = async (id: string) => {
    return await axiosInstance.delete(`/categories/${id}`);
}
