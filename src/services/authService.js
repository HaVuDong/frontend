import axiosClient from "@/utils/axiosClient";
import Cookies from "js-cookie";

/* ======================================================
   🟢 REGISTER (Đăng ký)
====================================================== */
export const register = async (username, email, password, phone) => {
  const res = await axiosClient.post("/users/register", {
    username,
    email,
    password,
    phone,
  });
  return res;
};

/* ======================================================
   🟢 LOGIN (Đăng nhập)
====================================================== */
export const login = async (identifier, password) => {
  const res = await axiosClient.post("/users/login", { identifier, password });

  if (res?.token && res?.user) {
    const cookieOptions = {
      expires: 7,
      path: "/",          // Quan trọng: cho phép truy cập toàn site
      sameSite: "lax",
    };

    // ⭐ Lưu token & role vào cookies
    Cookies.set("jwt", res.token, cookieOptions);
    Cookies.set("role", res.user.role, cookieOptions);

    // ⭐ Lưu user vào localStorage
    localStorage.setItem("user", JSON.stringify(res.user));
  }

  return res;
};

/* ======================================================
   🟢 GET CURRENT USER (Lấy user từ localStorage)
====================================================== */
export const getCurrentUser = () => {
  try {
    const user = localStorage.getItem("user");
    if (!user) return null;
    return JSON.parse(user);
  } catch (error) {
    console.error("❌ getCurrentUser error:", error);
    return null;
  }
};

/* ======================================================
   🟢 ME (Lấy user từ API)
====================================================== */
export const me = async () => {
  const res = await axiosClient.get("/users/me");
  return res;
};

/* ======================================================
   🟢 RESET PASSWORD
====================================================== */
export const resetPassword = async (data) => {
  return await axiosClient.post("/users/reset-password", data);
};

/* ======================================================
   🟢 LOGOUT
====================================================== */
export const logout = () => {
  Cookies.remove("jwt", { path: "/" });
  Cookies.remove("role", { path: "/" });
  localStorage.removeItem("user");

  console.log("✅ [authService] Logged out");
};

/* ======================================================
   🟢 EXPORT DEFAULT
====================================================== */
export default {
  register,
  login,
  getCurrentUser,
  resetPassword,
  me,
  logout,
};
