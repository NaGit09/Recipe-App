import { UserInfo } from "@/src/types/user.type";
import axiosInstance from "../axiosInstance";

export const getUserProfile = async (): Promise<UserInfo> => {
  return await axiosInstance.get("/users/profile");
};

export const updateProfile = async (data: UserInfo): Promise<UserInfo> => {
  const formData = new FormData();

  const allowedFields = ["username", "bio", "avatar"];

  Object.keys(data).forEach((key) => {
    if (allowedFields.includes(key)) {
      const value = data[key as keyof UserInfo];
      if (value !== undefined && value !== null) {
        if (typeof value === "object" && "uri" in value) {
          // Handle file upload if value is a file object (React Native format)
          // We need to verify if UserInfo allows this. 
          // Currently UserInfo.avatar is string. 
          // If we want to support file upload, we cast or just append.
          formData.append(key, value as any);
        } else {
          formData.append(key, String(value));
        }
      }
    }
  });

  return await axiosInstance.put("/users/profile", formData);
};
