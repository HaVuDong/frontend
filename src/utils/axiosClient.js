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
    const token = Cookies.get("jwt");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log("🔐 [Axios] Token attached to request");
    } else {
      console.log("⚠️ [Axios] No token found");
    }

    console.log("🚀 [Axios Request]", {
      method: config.method?.toUpperCase(),
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
    console.log("✅ [Axios Response]", {
      status: response.status,
      url: response.config.url,
      data: response.data,
    });

    return response.data;
  },
  (error) => {
    const status = error.response?.status;
    const url = error.config?.url;
    const serverData = error.response?.data;

    const wrappedError = {
      status: status,
      url: url,
      message:
        serverData?.message ||
        error.message ||
        "Đã xảy ra lỗi không xác định.",
      data: serverData,
      raw: error, // giữ lại lỗi gốc nếu cần debug sâu
    };

    console.error("❌ [Axios Response Error]", wrappedError);

    // 401 - UNAUTHORIZED
    if (status === 401) {
      console.error("🚫 [401] Token không hợp lệ hoặc đã hết hạn");

      Cookies.remove("jwt");
      Cookies.remove("role");
      if (typeof window !== "undefined") {
        localStorage.removeItem("user");
      }

      if (typeof window !== "undefined") {
        const currentPath = window.location.pathname;
        if (currentPath.startsWith("/admin")) {
          console.log("➡️ Redirect về /admin/auth/login");
          window.location.href = "/admin/auth/login";
        } else {
          console.log("➡️ Redirect về /site/auth/login");
          window.location.href = "/site/auth/login";
        }
      }
    }

    // 403 - FORBIDDEN
    if (status === 403) {
      console.error("🚫 [403] Không có quyền truy cập");
      if (typeof window !== "undefined") {
        alert("Bạn không có quyền truy cập chức năng này!");
      }
    }

    // 404 - NOT FOUND
    if (status === 404) {
      console.error("🚫 [404] Không tìm thấy dữ liệu");
    }

    // 500+ - SERVER ERROR
    if (status >= 500) {
      console.error("🚫 [500+] Lỗi server");
      if (typeof window !== "undefined") {
        alert("Lỗi server! Vui lòng thử lại sau.");
      }
    }

    // NETWORK ERROR
    if (error.message === "Network Error") {
      console.error("🚫 [Network Error] Không thể kết nối tới server");
      if (typeof window !== "undefined") {
        alert("Không thể kết nối tới server! Vui lòng kiểm tra kết nối mạng.");
      }
    }

    // Luôn reject 1 object lỗi "đẹp"
    return Promise.reject(wrappedError);
  }
);

// ============================================
// EXPORT
// ============================================
export default axiosClient;
