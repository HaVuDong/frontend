import axios from "axios";
import API_CONFIG from "@/config/api";
import Cookies from "js-cookie";

// ============================================
// CREATE AXIOS INSTANCE
// ============================================
const axiosClient = axios.create({
  baseURL: API_CONFIG.BASE_URL || "http://localhost:8017/v1",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  timeout: 30000, // 30 seconds
});

// ============================================
// REQUEST INTERCEPTOR
// ============================================
axiosClient.interceptors.request.use(
  (config) => {
    // Lấy JWT token từ cookie
    const token = Cookies.get("jwt");

    // Tự động gắn token vào header nếu có
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log("🔐 [Axios] Token attached to request");
    } else {
      console.log("⚠️ [Axios] No token found");
    }

    // Log request info
    console.log("🚀 [Axios Request]", {
      method: config.method.toUpperCase(),
      url: config.url,
      baseURL: config.baseURL,
      fullURL: `${config.baseURL}${config.url}`,
      headers: config.headers,
      data: config.data,
    });

    return config;
  },
  (error) => {
    console.error("❌ [Axios Request Error]", error);
    return Promise.reject(error);
  }
);

// ============================================
// RESPONSE INTERCEPTOR
// ============================================
axiosClient.interceptors.response.use(
  (response) => {
    // Log response info
    console.log("✅ [Axios Response]", {
      status: response.status,
      url: response.config.url,
      data: response.data,
    });

    // Trả về data (không cần response.data.data)
    return response.data;
  },
  (error) => {
    console.error("❌ [Axios Response Error]", {
      status: error.response?.status,
      url: error.config?.url,
      message: error.response?.data?.message || error.message,
      data: error.response?.data,
    });

    // ============================================
    // XỬ LÝ LỖI 401 - UNAUTHORIZED
    // ============================================
    if (error.response?.status === 401) {
      console.error("🚫 [401] Token không hợp lệ hoặc đã hết hạn");

      // Xóa token và thông tin user
      Cookies.remove("jwt");
      Cookies.remove("role");
      localStorage.removeItem("user");

      // Redirect về trang login
      if (typeof window !== "undefined") {
        const currentPath = window.location.pathname;

        // Kiểm tra đang ở admin hay user site
        if (currentPath.startsWith("/admin")) {
          console.log("➡️ Redirect về /admin/auth/login");
          window.location.href = "/admin/auth/login";
        } else {
          console.log("➡️ Redirect về /site/auth/login");
          window.location.href = "/site/auth/login";
        }
      }
    }

    // ============================================
    // XỬ LÝ LỖI 403 - FORBIDDEN
    // ============================================
    if (error.response?.status === 403) {
      console.error("🚫 [403] Không có quyền truy cập");

      if (typeof window !== "undefined") {
        alert("Bạn không có quyền truy cập chức năng này!");
      }
    }

    // ============================================
    // XỬ LÝ LỖI 404 - NOT FOUND
    // ============================================
    if (error.response?.status === 404) {
      console.error("🚫 [404] Không tìm thấy dữ liệu");
    }

    // ============================================
    // XỬ LÝ LỖI 500 - SERVER ERROR
    // ============================================
    if (error.response?.status >= 500) {
      console.error("🚫 [500+] Lỗi server");

      if (typeof window !== "undefined") {
        alert("Lỗi server! Vui lòng thử lại sau.");
      }
    }

    // ============================================
    // XỬ LÝ NETWORK ERROR
    // ============================================
    if (error.message === "Network Error") {
      console.error("🚫 [Network Error] Không thể kết nối tới server");

      if (typeof window !== "undefined") {
        alert("Không thể kết nối tới server! Vui lòng kiểm tra kết nối mạng.");
      }
    }

    // Trả về lỗi để component xử lý
    return Promise.reject(error.response?.data || error);
  }
);

// ============================================
// EXPORT
// ============================================
export default axiosClient;