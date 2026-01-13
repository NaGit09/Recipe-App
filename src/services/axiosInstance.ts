import axios from "axios";
import { router } from "expo-router";
import { StorageInstance } from "../utils/storage";

const BASE_URL = process.env.EXPO_PUBLIC_URL_BASE;

// Tạo axios instance dùng chung
const axiosInstance = axios.create({
  baseURL: BASE_URL || "http://localhost:8080/recipe-app/api/v1",
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor: gắn token nếu có
axiosInstance.interceptors.request.use(
  async (config) => {
    const token = await StorageInstance.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: axios success chỉ chạy khi HTTP 2xx
axiosInstance.interceptors.response.use(
  (response) => {
    // Nếu backend trả { result: ... } thì lấy result, nếu không thì lấy toàn bộ data
    return response.data?.result ?? response.data;
  },
  (error) => {
    // Xử lý 401 → redirect login
    if (error.response?.status === 401) {
      console.warn("Unauthorized! Redirecting to login...");
      router.replace("/login");
    }

    // Tạo object lỗi chuẩn để FE xử lý
    return Promise.reject({
      isApiError: true,
      code: error.response?.status || 500,
      message:
        error.response?.data?.message ||
        error.message ||
        "Something went wrong!",
    });
  }
);

export default axiosInstance;
