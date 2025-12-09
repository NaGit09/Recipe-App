import { auth, LoginReq, RegisterReq } from "@/src/types/user.type";
import axiosInstance from "../axiosInstance"

export const login = (dto : LoginReq) : Promise<auth> => {
    return axiosInstance.post('/auth/login',dto);
}
export const register = (dto: RegisterReq): Promise<auth> => {
    return axiosInstance.post('/auth/register', dto);
}