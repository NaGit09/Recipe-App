import { AddCartItem, AddCartReq, CartItemDetail } from "@/src/types/cart.type";
import axiosInstance from "../axiosInstance";

export const getCart = (userId: string): Promise<AddCartItem> => {
  return axiosInstance.get(`/users/${userId}/cart`);
};

export const addCart = (userId: string, items: AddCartReq): Promise<void> => {
  return axiosInstance.put(`/users/${userId}/cart/add-to-cart`, items);
};

export const getCartItem = (userId: string, recipeId: string): Promise<CartItemDetail> => {
  return axiosInstance.get(
    `/users/${userId}/cart/item-detail?recipeId=${recipeId}`
  );
};

export const removeCartItem = (userId: string, items: AddCartReq): Promise<boolean> => {
  return axiosInstance.delete(`/users/${userId}/cart/remove-item`, {
    data: items,
  });
};

export const updateCart = (userId: string, items: AddCartReq) => {
  return axiosInstance.put(`/users/${userId}/cart/update`, items);
};
