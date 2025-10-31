import { auth, LoginReq } from "@/src/types/user.type";
import axiosInstance from "../axiosInstance"

export const login = (dto : LoginReq) : Promise<auth> => {
    return axiosInstance.post('/auth/login',dto);
}