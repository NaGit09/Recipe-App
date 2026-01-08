import { UserInfo, UserState } from "@/src/types/user.type";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { updateProfile as updateProfileApi, getUserProfile as getProfileApi } from "../services/api/user.api";

export const useUserStore = create(
  persist<UserState>(
    (set) => ({
      user: null,
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
    }),

    {
      name: "user-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
