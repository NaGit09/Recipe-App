import { UserInfo } from "@/src/types/user.type";
import axiosInstance from "../axiosInstance";

export const getUserProfile = async (): Promise<UserInfo> => {
  return await axiosInstance.get("/users/profile");
};

export const updateProfile = async (data: UserInfo): Promise<UserInfo> => {
  return await axiosInstance.put("/users/profile", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
