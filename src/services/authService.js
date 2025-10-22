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

// ⭐ 🟢 Đăng nhập - FIX
export const login = async (identifier, password) => {
  const res = await axiosClient.post("/users/login", { identifier, password });

  console.log("✅ [authService] Login response:", res);

  // ⭐ Lưu cookies NGAY LẬP TỨC
  if (res?.token && res?.user) {
    console.log("💾 [authService] Saving to cookies...");
    console.log("Token:", res.token);
    console.log("Role:", res.user.role);
    
    // ⭐ SỬA: Thêm options cho cookies
    const cookieOptions = {
      expires: 7,
      path: '/',  // ⬅️ QUAN TRỌNG: Cho phép truy cập từ mọi path
      sameSite: 'lax',  // ⬅️ Bảo mật nhưng vẫn cho phép redirect
    };
    
    Cookies.set("jwt", res.token, cookieOptions);
    Cookies.set("role", res.user.role, cookieOptions);
    
    // ⭐ Verify cookies đã được set
    const verifyToken = Cookies.get("jwt");
    const verifyRole = Cookies.get("role");
    
    console.log("✅ [authService] Verify - Token:", verifyToken ? "✅ Đã lưu" : "❌ Chưa lưu");
    console.log("✅ [authService] Verify - Role:", verifyRole);
    
    // ⭐ Lưu localStorage
    localStorage.setItem("user", JSON.stringify(res.user));
    console.log("✅ [authService] Saved to localStorage");
  } else {
    console.error("❌ [authService] Missing token or user in response");
  }

  return res;
};

// 🟢 Lấy thông tin user hiện tại
export const me = async () => {
  const res = await axiosClient.get("/users/me");
  return res;
};

// ⭐ THÊM: Logout function
export const logout = () => {
  Cookies.remove("jwt", { path: '/' });
  Cookies.remove("role", { path: '/' });
  localStorage.removeItem("user");
  console.log("✅ [authService] Logged out");
};