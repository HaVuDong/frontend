"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";

export default function Header() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // ⭐ Load user info
  const loadUserInfo = () => {
    const token = Cookies.get("jwt");
    const userStr = localStorage.getItem("user");
    
    console.log("🔄 [Header] Loading user info...");
    console.log("🔄 Token:", token ? "✅ Có" : "❌ Không");
    console.log("🔄 User localStorage:", userStr);
    
    if (token && userStr) {
      try {
        const userData = JSON.parse(userStr);
        console.log("✅ [Header] User loaded:", userData);
        setUser(userData);
        setIsLoggedIn(true);
      } catch (error) {
        console.error("❌ [Header] Parse error:", error);
        setUser(null);
        setIsLoggedIn(false);
      }
    } else {
      console.log("⚠️ [Header] No user data");
      setUser(null);
      setIsLoggedIn(false);
    }
  };

  // ⭐ QUAN TRỌNG: Load ngay khi mount VÀ lắng nghe events
  useEffect(() => {
    console.log("🚀 [Header] Component mounted!");
    loadUserInfo();

    const handleStorageChange = (e) => {
      console.log("📢 [Header] Storage event:", e);
      loadUserInfo();
    };

    const handleUserLoggedIn = (e) => {
      console.log("📢 [Header] userLoggedIn event:", e);
      setTimeout(() => {
        loadUserInfo();
      }, 100); // Delay nhỏ để đảm bảo localStorage đã được set
    };

    // ⭐ Lắng nghe cả 2 events
    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("userLoggedIn", handleUserLoggedIn);

    // ⭐ THÊM: Polling mỗi 1s để check (backup nếu event không fire)
    const interval = setInterval(() => {
      const token = Cookies.get("jwt");
      if (token && !isLoggedIn) {
        console.log("🔁 [Header] Polling detected login, reloading...");
        loadUserInfo();
      } else if (!token && isLoggedIn) {
        console.log("🔁 [Header] Polling detected logout, reloading...");
        loadUserInfo();
      }
    }, 1000);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("userLoggedIn", handleUserLoggedIn);
      clearInterval(interval);
    };
  }, [isLoggedIn]); // ⬅️ Thêm dependency

  const handleLogout = () => {
    console.log("🔴 [Header] Logging out...");
    
    Cookies.remove("jwt");
    Cookies.remove("role");
    localStorage.removeItem("user");
    
    setUser(null);
    setIsLoggedIn(false);
    
    window.dispatchEvent(new Event("storage"));
    
    router.push("/site/auth/login");
  };

  return (
    <header className="bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link 
            href="/site" 
            className="flex items-center gap-3 hover:opacity-90 transition-opacity group"
          >
            <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
              <span className="text-2xl">⚽</span>
            </div>
            <span className="text-2xl font-bold">Sân Bóng Shop</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link 
              href="/site" 
              className="hover:text-green-200 transition-colors font-medium flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/10"
            >
              <span>📦</span> Sản phẩm
            </Link>
            <Link 
              href="/site/booking" 
              className="hover:text-green-200 transition-colors font-medium flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/10"
            >
              <span>⚽</span> Đặt sân
            </Link>
            <Link 
              href="/site/cart" 
              className="hover:text-green-200 transition-colors font-medium flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/10"
            >
              <span>🛒</span> Giỏ hàng
            </Link>
               <Link 
              href="/site/bookings/my" 
              className="hover:text-green-200 transition-colors font-medium flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/10"
            >
              <span>⚽</span> Lịch đã đặt
            </Link>
          </nav>

          {/* User Actions */}
          <div className="flex items-center gap-4">
            {isLoggedIn && user ? (
              <div className="flex items-center gap-3">
                {/* User Info - Desktop */}
                <div className="hidden md:flex items-center gap-3 bg-white/10 px-4 py-2 rounded-lg backdrop-blur-sm hover:bg-white/20 transition-all">
                  <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center font-bold text-lg shadow-lg">
                    {user.username?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold">
                      {user.username || user.email?.split('@')[0]}
                    </span>
                    <span className="text-xs text-green-200 flex items-center gap-1">
                      {user.role === 'admin' ? (
                        <>👑 Admin</>
                      ) : (
                        <>👤 Khách hàng</>
                      )}
                    </span>
                  </div>
                </div>

                {/* Logout Button - Desktop */}
                <button
                  onClick={handleLogout}
                  className="hidden md:flex items-center gap-2 bg-white/10 hover:bg-red-500 px-4 py-2 rounded-lg font-medium transition-all backdrop-blur-sm"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Đăng xuất
                </button>
              </div>
            ) : (
              <Link
                href="/site/auth/login"
                className="bg-white text-green-600 hover:bg-green-50 px-6 py-2.5 rounded-lg font-bold transition-all shadow-lg hover:shadow-xl flex items-center gap-2 transform hover:scale-105"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
                Đăng nhập
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}