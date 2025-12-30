import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { login as loginApi, register as registerApi } from "../services/auth/auth.api";
import { LoginReq, RegisterReq } from "../types/user.type";
import { StorageInstance } from "../utils/storage";

interface AuthState {
  userId: string | null;
  accessToken: string | null;
  refreshToken: string | null;
  isLoading : boolean,
  setAuth: (userId: string, accessToken: string, refreshToken: string) => Promise<void>;
  register: (dto: RegisterReq) => Promise<boolean>;
  login: (dto: LoginReq) => Promise<boolean>;
  logout: () => Promise<boolean>;
}

export const useAuthStore = create(
  persist<AuthState>(
    (set, get) => ({
      userId: null,
      isLoading : false,
      accessToken: null,
      refreshToken: null,

      setAuth: async (userId, accessToken, refreshToken) => {
        set({ userId, accessToken, refreshToken });
        // Also save token to StorageInstance for axiosInstance to use
        if (accessToken) {
          await StorageInstance.setItem("accessToken", accessToken);
        }
      },

      register: async (dto: RegisterReq) => {
        try {
          set({ isLoading: true });
          const success = await registerApi(dto);
          set({ isLoading: false });
          
          if (!success) {
            return false;
          }
          
          // After successful registration, auto-login the user
          try {
            const loginResult = await loginApi({ email: dto.email, password: dto.password });
            if (loginResult && loginResult.token && loginResult.user) {
              await get().setAuth(
                loginResult.user.id,
                loginResult.token,
                "" // refreshToken not implemented yet
              );
              return true;
            }
          } catch (loginError) {
            console.error("Auto-login after registration failed:", loginError);
            // Registration succeeded but auto-login failed
            return true; // Still return true since registration was successful
          }
          
          return true;
        } catch (error) {
          console.error("Registration error:", error);
          set({ isLoading: false });
          return false;
        }
      },

      login: async (dto: LoginReq) => {
        try {
          set({ isLoading: true });
          const authResponse = await loginApi(dto);
          
          if (!authResponse || !authResponse.token || !authResponse.user) {
            console.error("Invalid login response:", authResponse);
            set({ isLoading: false });
            return false;
          }

          // Map backend response to frontend format
          const userId = authResponse.user.id;
          const accessToken = authResponse.token;
          const refreshToken = ""; // refreshToken not implemented in backend yet

          await get().setAuth(userId, accessToken, refreshToken);
          set({ isLoading: false });
          console.log("✅ Login successful");
          return true;
        } catch (error: any) {
          console.error("Login error:", error);
          if (error.isApiError) {
            console.error(`Error code: ${error.code}, Message: ${error.message}`);
          }
          set({ isLoading: false });
          return false;
        }
      },

      logout: async () => {
        set({ userId: null, accessToken: null, refreshToken: null });
        // Also remove token from StorageInstance
        await StorageInstance.removeItem("accessToken");
        return true;
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => (state) => {
        // Sync token to StorageInstance when app rehydrates (starts up)
        if (state?.accessToken) {
          StorageInstance.setItem("accessToken", state.accessToken).catch((err) => {
            console.error("Error syncing token on rehydrate:", err);
          });
        }
      },
    }
  )
);
