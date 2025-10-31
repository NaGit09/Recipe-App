import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { LoginReq } from "../types/user.type";
import { login } from "../services/auth/auth.api";
import { StorageInstance } from "../utils/storage";

interface AuthState {
  userId: string | null;
  accessToken: string | null;
  refreshToken: string | null;
  setAuth: (userId: string, accessToken: string, refreshToken: string) => void;
  register: () => boolean;
  login: (dto: LoginReq) => Promise<boolean>;
  logout: () => boolean;
}

export const useAuthStore = create(
  persist<AuthState>(
    (set, get) => ({
      userId: null,
      accessToken: null,
      refreshToken: null,

      setAuth: (userId, accessToken, refreshToken) =>
        set({ userId, accessToken, refreshToken }),

      register: () => true,

      login: async (dto: LoginReq) => {
        try {
          const authInfo = await login(dto);
          console.log(authInfo);

          if (!authInfo) {
            return false;
          }

          const { info, accessToken, refreshToken } = authInfo;

          get().setAuth(info.id, accessToken, refreshToken);

          await StorageInstance.setItem("userId", info.id);
          await StorageInstance.setItem("accessToken", accessToken);
          await StorageInstance.setItem("refreshToken", refreshToken);

          return true;
        } catch (error) {
          return false;
        }
      },

      logout: () => {
        set({ userId: null, accessToken: null, refreshToken: null });
        StorageInstance.clearAll();
        return true;
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
