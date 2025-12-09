import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { login, register } from "../services/auth/auth.api";
import { LoginReq, RegisterReq } from "../types/user.type";

interface AuthState {
  userId: string | null;
  accessToken: string | null;
  refreshToken: string | null;
  isLoading : boolean,
  setAuth: (userId: string, accessToken: string, refreshToken: string) => void;
  register: (dto: RegisterReq) => Promise<boolean>;
  login: (dto: LoginReq) => Promise<boolean>;
  logout: () => boolean;
}

export const useAuthStore = create(
  persist<AuthState>(
    (set, get) => ({
      userId: null,
      isLoading : false,
      accessToken: null,
      refreshToken: null,

      setAuth: (userId, accessToken, refreshToken) =>
        set({ userId, accessToken, refreshToken }),

      register: async (dto: RegisterReq) => {
        try {
          const authInfo = await register(dto);
          set({ isLoading: false });
          if (!authInfo) {
            return false;
          }
          const { userId, accessToken, refreshToken } = authInfo;
          get().setAuth(userId, accessToken, refreshToken);
          return true;
        } catch (error) {
          return false;
        }
      },

      login: async (dto: LoginReq) => {
        try {
          set({ isLoading: true });
          const authInfo = await login(dto);
          if (!authInfo) {
            return false;
          }

          const { userId, accessToken, refreshToken } = authInfo;

          get().setAuth(userId, accessToken, refreshToken);
          set({ isLoading: false });
          return true;
        } catch (error) {
          return false;
        }
      },

      logout: () => {
        set({ userId: null, accessToken: null, refreshToken: null });
        return true;
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
