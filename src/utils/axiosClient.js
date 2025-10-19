/* eslint-disable no-console */
import axios from "axios";

const axiosClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8017/v1",
  withCredentials: false // ❌ Không gửi cookie, chỉ dùng Bearer token
});

// 🧩 Interceptor: tự động gắn JWT token
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

// ⚙️ Interceptor: xử lý phản hồi & lỗi
axiosClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.response?.statusText ||
      error.message;

    console.error("❌ API Error:", message);

    // Nếu token hết hạn → tự logout
    if (error.response?.status === 401) {
      localStorage.removeItem("jwt");
      localStorage.removeItem("user");
      window.dispatchEvent(new Event("storage"));
    }

    throw error;
  }
);

export default axiosClient;
