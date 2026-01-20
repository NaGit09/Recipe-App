import axiosInstance from "../axiosInstance";
const base = 'images';


export const getAllImages = () => {
    return axiosInstance.get(base);
}

export const deleteImageById = (id: string) => {
    return axiosInstance.delete(`${base}/${id}`);
}

export const getImageById = (id: string) => {
    return axiosInstance.get(`${base}/${id}`);
}
