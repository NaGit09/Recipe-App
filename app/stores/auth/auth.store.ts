import { testAPI } from "@/app/services/auth/auth.api";

import { create } from 'zustand';
interface AuthStore {
    data: any,
    callApi : () => Promise<string>
    }
const useAuth = create<AuthStore>((get, set) => ({
    data: '',
    callApi: async ()  => {
        const resp = await testAPI();
        console.log(resp);
        return resp;
    }
}));
export default useAuth;