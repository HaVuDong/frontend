/* eslint-disable no-console */
import axios from "axios";

const axiosClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8017/v1",
  withCredentials: true, // ✅ gửi cookie theo domain
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
