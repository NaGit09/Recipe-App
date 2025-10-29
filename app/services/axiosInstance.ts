import axios from "axios";
import { getLocalToken } from "../utils/storage";

const BASE_URL = process.env.BASE_URL;

 const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 3600,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  async (config) => {
    const token = await getLocalToken('accessToken');
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
    (response) => {
        return response.data;
    },
    async (error) => {
        const refreshToken = getLocalToken('refresToken');
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            // call api refresh token ! 
        }

        return Promise.reject(error);
    }
);
export default axiosInstance;