import { LoginReq, RegisterReq } from "@/src/types/auth.type";
import { UserRes } from "@/src/types/user.type";

import axiosInstance from "../axiosInstance"

export const login = (dto : LoginReq) : Promise<UserRes> => {
    return axiosInstance.post('/auth/login',dto);
}
export const register = (dto: RegisterReq): Promise<boolean> => {
    return axiosInstance.post('/auth/register', dto);
}
