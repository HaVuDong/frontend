"use client";

import { useEffect, useState } from "react";
import Cookies from "js-cookie"; // ⬅️ THÊM IMPORT
import { useRouter } from "next/navigation";

export default function AdminGuard({ children }) {
  const router = useRouter();
  const [status, setStatus] = useState("loading");
  const [debugInfo, setDebugInfo] = useState({});

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = () => {
    console.log("🔐 [AdminGuard] Checking authentication...");

    // ⭐ ĐỌC TỪ COOKIES (không phải localStorage)
    const jwt = Cookies.get("jwt");
    const role = Cookies.get("role");
    const userStr = typeof window !== 'undefined' ? localStorage.getItem("user") : null;

    console.log("🎫 JWT from cookies:", jwt ? "✅ Có" : "❌ Không");
    console.log("👤 Role from cookies:", role);
    console.log("📦 User from localStorage:", userStr);

    // ⭐ Debug info
    setDebugInfo({
      jwt: jwt ? "✅ Có" : "❌ Không",
      role: role || "N/A",
      user: userStr ? JSON.parse(userStr) : null,
      cookies: typeof window !== 'undefined' ? document.cookie : "N/A",
    });

    // ⭐ KIỂM TRA ĐIỀU KIỆN
    if (!jwt) {
      console.log("❌ [AdminGuard] No JWT token found");
      setStatus("unauthorized");
      return;
    }

    if (role?.toLowerCase() !== "admin") {
      console.log("❌ [AdminGuard] Role is not admin:", role);
      setStatus("unauthorized");
      return;
    }

    console.log("✅ [AdminGuard] Authentication successful!");
    setStatus("authorized");
  };

  // ⭐ Loading state
  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50" suppressHydrationWarning>
        <div className="text-center" suppressHydrationWarning>
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mb-4" suppressHydrationWarning></div>
          <p className="text-lg text-gray-600 font-medium animate-pulse" suppressHydrationWarning>
            ⏳ Đang kiểm tra quyền truy cập...
          </p>
        </div>
      </div>
    );
  }

  // ⭐ Unauthorized state
  if (status === "unauthorized") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-orange-50 to-pink-50 relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-red-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>

        <div className="relative z-10 bg-white/90 backdrop-blur-xl p-10 rounded-3xl shadow-2xl text-center border border-white/50 max-w-2xl">
          {/* Icon */}
          <div className="w-24 h-24 bg-gradient-to-br from-red-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <span className="text-5xl">🚫</span>
          </div>

          {/* Title */}
          <h1 className="text-4xl font-black bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent mb-4">
            403 - Không có quyền truy cập
          </h1>

          {/* Message */}
          <p className="text-gray-700 text-lg mb-6">
            Bạn cần đăng nhập bằng tài khoản <span className="font-bold text-red-600">admin</span> để truy cập trang này.
          </p>

          {/* Debug Info */}
          <div className="bg-gray-100 p-4 rounded-xl mb-6 text-left">
            <p className="text-sm font-bold text-gray-800 mb-2">🔍 Thông tin debug:</p>
            <div className="text-xs space-y-1 font-mono">
              <p><strong>JWT Token:</strong> {debugInfo.jwt}</p>
              <p><strong>Role:</strong> {debugInfo.role}</p>
              <p><strong>User:</strong> {debugInfo.user ? debugInfo.user.username || debugInfo.user.email : "Không có"}</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => router.push("/site/auth/login")}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1"
            >
              🔐 Đăng nhập Admin
            </button>
            <button
              onClick={() => router.push("/site")}
              className="px-8 py-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1"
            >
              🏠 Về trang chủ
            </button>
          </div>

          {/* Retry Button */}
          <button
            onClick={checkAuth}
            className="mt-4 text-sm text-blue-600 hover:text-blue-800 font-medium underline"
          >
            🔄 Thử lại
          </button>
        </div>

        <style jsx>{`
          @keyframes blob {
            0%, 100% { transform: translate(0px, 0px) scale(1); }
            33% { transform: translate(30px, -50px) scale(1.1); }
            66% { transform: translate(-20px, 20px) scale(0.9); }
          }
          .animate-blob { animation: blob 7s infinite; }
          .animation-delay-2000 { animation-delay: 2s; }
        `}</style>
      </div>
    );
  }

  // ⭐ Authorized - render children
  return <>{children}</>;
}