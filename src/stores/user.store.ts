import { UserInfo, UserState } from "@/src/types/user.type";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import {
  getAllUsers as getAllUsersApi,
  getUserProfile as getProfileApi,
  updateProfile as updateProfileApi,
} from "../services/api/user.api";

export const useUserStore = create(
  persist<UserState>(
    (set) => ({
      user: null,
      users: [],
      setUser: (user) => set({ user }),

      updateProfile: async (user: UserInfo) => {
        const result = await updateProfileApi(user);
        set({ user: result });
        return result;
      },
      getProfile: async () => {
        const result = await getProfileApi();
        set({ user: result });
        return result;
      },
      getAllUsers: async () => {
        const result = await getAllUsersApi();
        set({ users: result });
      },
    }),

    {
      name: "user-storage",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
