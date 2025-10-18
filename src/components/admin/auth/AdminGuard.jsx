"use client";
import { useEffect, useState } from "react";

export default function AdminGuard({ children }) {
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    // Kiểm tra token và role
    const jwt = localStorage.getItem("jwt");
    const role = localStorage.getItem("role");

    // Nếu không có JWT hoặc role khác "admin" → chặn truy cập
    if (!jwt || role?.toLowerCase() !== "admin") {
      setStatus("unauthorized");
    } else {
      setStatus("authorized");
    }
  }, []);

  if (status === "loading") return null;

  if (status === "unauthorized") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50">
        <div className="bg-white p-8 rounded shadow-lg text-center border border-red-300">
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            403 - Không có quyền truy cập
          </h1>
          <p className="text-gray-700">
            Bạn cần đăng nhập bằng tài khoản <b>admin</b> để truy cập trang này.
          </p>
          <a
            href="/site"
            className="inline-block mt-6 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
          >
            Quay lại trang chủ
          </a>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
