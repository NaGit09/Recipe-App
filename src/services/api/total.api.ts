import axiosInstance from "../axiosInstance";

export const getTotalUser = () : Promise<number> => {
    return axiosInstance.get("/users/total");
}

export const getTotalRecipe = () : Promise<number> => {
    return axiosInstance.get("/recipes/total");
}

export const getTotalIngredient = () : Promise<number> => {
    return axiosInstance.get("/ingredients/total");
}