"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import Cookies from "js-cookie";
import { me } from "@/services/authService";
import { useRouter } from "next/navigation";

const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = Cookies.get("jwt");
      
      if (!token) {
        setIsAuthenticated(false);
        setUser(null);
        setLoading(false);
        return;
      }

      // Gọi API /users/me để lấy thông tin user
      const response = await me();
      
      if (response.success && response.user) {
        setUser(response.user);
        setIsAuthenticated(true);
        console.log("✅ User authenticated:", response.user);
      } else {
        throw new Error("Invalid user data");
      }
    } catch (error) {
      console.error("❌ Auth check failed:", error);
      setIsAuthenticated(false);
      setUser(null);
      
      // Xóa cookie nếu token không hợp lệ
      Cookies.remove("jwt");
      Cookies.remove("role");
      localStorage.removeItem("user");
    } finally {
      setLoading(false);
    }
  };

  const login = async (userData, token) => {
    // Lưu token và user info
    Cookies.set("jwt", token, { expires: 7 });
    Cookies.set("role", userData.role, { expires: 7 });
    localStorage.setItem("user", JSON.stringify(userData));
    
    setUser(userData);
    setIsAuthenticated(true);
    
    console.log("✅ User logged in:", userData);
  };

  const logout = () => {
    // Xóa tất cả thông tin auth
    Cookies.remove("jwt");
    Cookies.remove("role");
    localStorage.removeItem("user");
    
    setUser(null);
    setIsAuthenticated(false);
    
    // Redirect về trang login
    router.push("/site/auth/login");
    
    console.log("✅ User logged out");
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    checkAuth,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}