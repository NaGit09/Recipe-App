import { OrderRequest } from "@/src/types/order.type";
import axiosInstance from "../axiosInstance";
const base = 'order'

export const createOrder = (order: OrderRequest) => {
    return axiosInstance.post(`${base}`, order)
}

export const getOrdersByUserId = (userId: string) => {
    return axiosInstance.get(`${base}`, {
        params: {
            userId
        }
    })
}
export const getOrderById = (orderId: string) => {
    return axiosInstance.get(`${base}/${orderId}`)
}

export const updateOrder = (orderId : string ,order: OrderRequest) => {
    return axiosInstance.put(`${base}/${orderId}`, order)
}
