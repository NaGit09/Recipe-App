import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import {
  login as loginApi,
  register as registerApi,
} from "../services/api/auth.api";
import { ApiError } from "../types/api.type";
import { AuthState, LoginReq, RegisterReq } from "../types/auth.type";
import { UserInfo } from "../types/user.type";
import { StorageInstance } from "../utils/storage";

// Auth store handle authencation
export const useAuthStore = create(
  persist<AuthState>(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: false,

      // Update auth state
      setAuth: async (user: UserInfo, token: string) => {
        set({ user, token });

        if (token) {
          await StorageInstance.setItem("token", token);
        }
      },
      // Handle register
      register: async (dto: RegisterReq) => {
        try {
          set({ isLoading: true });
          const success = await registerApi(dto);
          set({ isLoading: false });

          if (!success) {
            return false;
          }

          try {
            const loginResult = await loginApi({
              email: dto.email,
              password: dto.password,
            });

            const { user, token } = loginResult;

            if (user && token) {
              await get().setAuth(user, token);
              return true;
            }
          } catch (loginError) {
            return true;
          }

          return true;
        } catch (error) {
          set({ isLoading: false });
          return false;
        }
      },
      // Handle login
      login: async (dto: LoginReq) => {
        await StorageInstance.removeItem("token");

        try {
          set({ isLoading: true });
          const { email, password } = dto
          console.log("Login attempt:", email, password)
          const authResponse = await loginApi(dto);

          const { user, token } = authResponse;

          if (!user || !token) {
            console.error("Login failed: Missing user or token in response", authResponse);
            set({ isLoading: false });
            return false;
          }


          await StorageInstance.setItem('token', token);
          await StorageInstance.setItem('user', JSON.stringify(user));

          get().setAuth(user, token);
          set({ isLoading: false });
          return true;

        } catch (error) {
          console.error("Login error caught in store:", error);
          const apiError = error as ApiError;
          if (apiError.isApiError) {
            // ensure we are logging what we think we are logging
            console.error(
              `Error code: ${apiError.status}, Message: ${apiError.message}`
            );
          }
          set({ isLoading: false });
          return false;
        }
      },
      // Handle logout 
      logout: async () => {
        set({ user: null, token: null });
        await StorageInstance.removeItem("token");
        await StorageInstance.removeItem("user");
        return true;
      },
    }),
    // Sync token to async storage
    {
      name: "auth-storage",
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => (state) => {
        if (state?.token) {
          StorageInstance.setItem("token", state.token).catch((err) => {
            console.error("Error syncing token on rehydrate:", err);
          });
        }
      },
    }
  )
);
