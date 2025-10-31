import axios from "axios";
import { ApiResponse } from "../types/api.type";
import { StorageInstance } from "../utils/storage";

const BASE_URL = process.env.BASE_URL;
// define axiosInstance reuse for all api
const axiosInstance = axios.create({
  baseURL: BASE_URL || 'http://localhost:8000',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Interceptor grant token if request authentication
axiosInstance.interceptors.request.use(
  (config) => {
    const token = StorageInstance.getItem('accessToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)
//
axiosInstance.interceptors.response.use(
  (response) => {
    const apiResponse = response.data as ApiResponse<any>

    const isSuccess = apiResponse.statusCode >= 200 && apiResponse.statusCode < 300

    if (isSuccess) {
      return apiResponse.data
    } else {
      return Promise.reject({
        isApiError: true,
        code: apiResponse.statusCode,
        message: apiResponse.message,
      })
    }
  },

  (error) => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          console.warn('Unauthorized! Redirecting to login...')
          window.location.href = '/login'
          break
      }
    }

    const errorResponse = {
      isApiError: true,
      code: error.response?.status || 500,
      message:
        error.response?.data?.message || error.message || 'Something went wrong !',
    }
    return Promise.reject(errorResponse)
  }
)
export default axiosInstance
