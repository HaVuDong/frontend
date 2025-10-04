import axiosClient from "@/utils/axiosClient";

// 🟢 Đăng ký người dùng
export const register = async (username, email, password) => {
  try {
    const response = await axiosClient.post("/users/register", {
      username,
      email,
      password,
    });
    return response;
  } catch (error) {
    console.error("❌ Lỗi đăng ký:", error);
    throw error.response?.data || error;
  }
};

// 🟢 Đăng nhập người dùng
export const login = async (identifier, password) => {
  try {
    // gọi đúng endpoint backend: /v1/users/login
    const response = await axiosClient.post("/users/login", {
      identifier, // có thể là username hoặc email
      password,
    });
    return response; // { success, token, user }
  } catch (error) {
    console.error("❌ Lỗi đăng nhập:", error);
    throw error.response?.data || error;
  }
};

// 🟢 Lấy thông tin user đang đăng nhập
export const me = async () => {
  try {
    const response = await axiosClient.get("/users/me");
    return response;
  } catch (error) {
    console.error("❌ Lỗi lấy thông tin user:", error);
    throw error.response?.data || error;
  }
};
