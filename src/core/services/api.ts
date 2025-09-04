import axios from "axios";
import type { AxiosInstance, InternalAxiosRequestConfig } from "axios";
import Cookies from "js-cookie";

const api: AxiosInstance = axios.create({
  baseURL: "https://programming-area-server.vercel.app/api/v1",
  // baseURL: "http://localhost:8000/api/v1",
});

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = Cookies.get("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || "Something went wrong";
    return Promise.reject(new Error(message));
  }
);

export default api;
