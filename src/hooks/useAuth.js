"use client";
import { createContext, useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem("user");
      const jwt = Cookies.get("jwt"); // ✅ đọc token từ cookie

      if (savedUser && jwt) {
        setUser(JSON.parse(savedUser));
      }
    } catch (err) {
      console.error("❌ Lỗi load auth:", err);
    } finally {
      setIsReady(true);
    }
  }, []);

  const login = (data) => {
    // Lưu user vào localStorage
    localStorage.setItem("user", JSON.stringify(data.user));

    // Lưu JWT + role vào cookie
    Cookies.set("jwt", data.token, { expires: 7 });
    Cookies.set("role", data.user.role, { expires: 7 });

    setUser(data.user);
  };

  const logout = () => {
    Cookies.remove("jwt");
    Cookies.remove("role");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isReady, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
