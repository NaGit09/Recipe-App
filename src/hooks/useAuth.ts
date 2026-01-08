import { useState } from "react";
import { useAuthStore } from "../stores/auth.store";
import { LoginReq, RegisterReq } from "../types/auth.type";

export const useAuth = () => {
    const { login: loginStore, register: registerStore } = useAuthStore();
    const [loading, setLoading] = useState(false);

    const login = async (dto: LoginReq) => {
        setLoading(true);
        try {
            const result = await loginStore(dto);
            return result;
        } catch (error) {
            console.error("Login error:", error);
            return false;
        } finally {
            setLoading(false);
        }
    };

    const register = async (dto: RegisterReq) => {
        setLoading(true);
        try {
            const result = await registerStore(dto);
            return result;
        } catch (error) {
            console.error("Register error:", error);
            return false;
        } finally {
            setLoading(false);
        }
    };

    return {
        login,
        register,
        loading,
    };
};
