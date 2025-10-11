import axiosClient from "@/utils/axiosClient";
import Cookies from "js-cookie";

// 🟢 Đăng ký
export const register = async (username, email, password, phone) => {
  const res = await axiosClient.post("/users/register", {
    username,
    email,
    password,
    phone,
  });
  return res;
};

// 🟢 Đăng nhập
export const login = async (identifier, password) => {
  const res = await axiosClient.post("/users/login", { identifier, password });

  // ✅ Lưu cookie để middleware đọc
  if (res?.token) {
    Cookies.set("jwt", res.token, { expires: 7 });
    Cookies.set("role", res.user.role, { expires: 7 });
    localStorage.setItem("user", JSON.stringify(res.user));
  }

  return res;
};

// 🟢 Lấy thông tin user hiện tại (nếu backend có /me)
export const me = async () => {
  const res = await axiosClient.get("/users/me");
  return res;
};
