import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { login, register } from "../services/api/auth.api";
import { LoginReq, RegisterReq, UserInfo } from "../types/user.type";
import { StorageInstance } from "../utils/storage";

interface AuthState {
  user: UserInfo | null;
  token: string | null;
  isLoading : boolean,
  setAuth: (user: UserInfo, token: string) => void;
  register: (dto: RegisterReq) => Promise<boolean>;
  login: (dto: LoginReq) => Promise<boolean>;
  logout: () => boolean;
}

export const useAuthStore = create(
  persist<AuthState>(
    (set, get) => ({
      user: null,
      isLoading : false,
      token: null,

      setAuth: (user, token) =>
        set({ user, token }),

      register: async (dto: RegisterReq) => {
        try {
          const result = await register(dto);
          set({ isLoading: false });
          return result;
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

          const { token, user } = authInfo;

          // Save token , userinfo to async storage
          StorageInstance.setItem('token', token);
          StorageInstance.setItem('user', JSON.stringify(user));
          
          get().setAuth(user, token);
          set({ isLoading: false });
          return true;
        } catch (error) {
          return false;
        }
      },

      logout: () => {
        set({ user: null, token: null });
        return true;
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
