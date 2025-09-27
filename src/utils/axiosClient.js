import API_CONFIG from "@/config/api";
import axios from "axios";

const axiosClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: 5000,
  headers: API_CONFIG.HEADERS,
});

// Response interceptor
axiosClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.error("❌ API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Request interceptor (JWT nếu có)
axiosClient.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("jwt");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosClient;
