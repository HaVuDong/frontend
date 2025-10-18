/* eslint-disable no-console */
import axios from "axios";

const axiosClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8017/v1",
  withCredentials: false // ❌ Không cần gửi cookie nữa vì dùng Authorization header
});

// ✅ Thêm interceptor để tự động gắn token vào header
axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("jwt");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Xử lý lỗi chung
axiosClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.error("❌ API Error:", error.response?.data || error.message);
    throw error;
  }
);

export default axiosClient;
