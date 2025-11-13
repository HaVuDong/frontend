// src/components/site/Header.jsx
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

  const loadUserInfo = () => {
    const token = Cookies.get("jwt");
    const userStr = typeof window !== 'undefined' ? localStorage.getItem("user") : null;
    
    console.log("🔄 [Header] Loading user info...");
    console.log("🔄 Token:", token ? "✅" : "❌");
    
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

  useEffect(() => {
    console.log("🚀 [Header] Component mounted!");
    loadUserInfo();

    const handleUserChange = () => {
      console.log("📢 [Header] User changed event");
      setTimeout(() => loadUserInfo(), 100);
    };

    window.addEventListener("storage", handleUserChange);
    window.addEventListener("userLoggedIn", handleUserChange);
    window.addEventListener("userLoggedOut", handleUserChange);

    const interval = setInterval(() => {
      const token = Cookies.get("jwt");
      if ((token && !isLoggedIn) || (!token && isLoggedIn)) {
        console.log("🔁 [Header] Polling detected change");
        loadUserInfo();
      }
    }, 2000);

    return () => {
      window.removeEventListener("storage", handleUserChange);
      window.removeEventListener("userLoggedIn", handleUserChange);
      window.removeEventListener("userLoggedOut", handleUserChange);
      clearInterval(interval);
    };
  }, [isLoggedIn]);

  const handleLogout = () => {
    console.log("🔴 [Header] Logging out...");
    
    Cookies.remove("jwt");
    Cookies.remove("role");
    if (typeof window !== 'undefined') {
      localStorage.removeItem("user");
    }
    
    setUser(null);
    setIsLoggedIn(false);
    
    window.dispatchEvent(new Event("userLoggedOut"));
    
    router.push("/site/auth/login");
  };

  return (
    <header className="bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <nav className="flex items-center justify-between">
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
          <div className="hidden md:flex gap-4 items-center">
            {/* Sản phẩm */}
            <Link 
              href="/site" 
              className="text-white/90 hover:text-white hover:bg-white/10 px-3 py-2 rounded-lg transition-all font-medium flex items-center gap-2"
            >
              <span>📦</span> Sản phẩm
            </Link>

            {/* Đặt sân */}
            <Link 
              href="/site/bookings" 
              className="text-white/90 hover:text-white hover:bg-white/10 px-3 py-2 rounded-lg transition-all font-medium flex items-center gap-2"
            >
              <span>⚽</span> Đặt sân
            </Link>

            {/* Giỏ hàng */}
            <Link 
              href="/site/cart" 
              className="text-white/90 hover:text-white hover:bg-white/10 px-3 py-2 rounded-lg transition-all font-medium flex items-center gap-2"
            >
              <span>🛒</span> Giỏ hàng
            </Link>

            {/* ⭐ LỊCH SÂN */}
            <Link 
              href="/site/bookings/my" 
              className="text-white/90 hover:text-white hover:bg-white/10 px-3 py-2 rounded-lg transition-all font-medium flex items-center gap-2"
            >
              <span>📅</span> Lịch sân
            </Link>

            {/* User Section */}
            {isLoggedIn && user ? (
              <div className="flex items-center gap-3">
                {/* User Info */}
                <div className="flex items-center gap-3 bg-white/10 px-4 py-2 rounded-lg backdrop-blur-sm hover:bg-white/20 transition-all">
                  <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center font-bold text-lg shadow-lg">
                    {user.username?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold">
                      {user.username || user.email?.split('@')[0]}
                    </span>
                    <span className="text-xs text-green-200">
                      {user.role === 'admin' ? '👑 Admin' : '👤 Khách hàng'}
                    </span>
                  </div>
                </div>

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 bg-white/10 hover:bg-red-500 px-4 py-2 rounded-lg font-medium transition-all backdrop-blur-sm"
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

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </nav>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 py-4 border-t border-white/20">
            <div className="flex flex-col gap-2">
              <Link 
                href="/site" 
                className="text-white/90 hover:text-white hover:bg-white/10 px-3 py-2 rounded-lg transition-all font-medium flex items-center gap-2"
                onClick={() => setIsMenuOpen(false)}
              >
                <span>📦</span> Sản phẩm
              </Link>
              <Link 
                href="/site/booking" 
                className="text-white/90 hover:text-white hover:bg-white/10 px-3 py-2 rounded-lg transition-all font-medium flex items-center gap-2"
                onClick={() => setIsMenuOpen(false)}
              >
                <span>⚽</span> Đặt sân
              </Link>
              <Link 
                href="/site/cart" 
                className="text-white/90 hover:text-white hover:bg-white/10 px-3 py-2 rounded-lg transition-all font-medium flex items-center gap-2"
                onClick={() => setIsMenuOpen(false)}
              >
                <span>🛒</span> Giỏ hàng
              </Link>
              <Link 
                href="/site/orders" 
                className="text-white/90 hover:text-white hover:bg-white/10 px-3 py-2 rounded-lg transition-all font-medium flex items-center gap-2"
                onClick={() => setIsMenuOpen(false)}
              >
                <span>📋</span> Đơn hàng
              </Link>
              <Link 
                href="/site/bookings/my" 
                className="text-white/90 hover:text-white hover:bg-white/10 px-3 py-2 rounded-lg transition-all font-medium flex items-center gap-2"
                onClick={() => setIsMenuOpen(false)}
              >
                <span>📅</span> Lịch sân
              </Link>

              {isLoggedIn && user ? (
                <>
                  <div className="px-3 py-2 bg-white/10 rounded-lg mt-2">
                    <p className="text-sm font-bold">{user.username || user.email}</p>
                    <p className="text-xs text-green-200">{user.role === 'admin' ? '👑 Admin' : '👤 Khách hàng'}</p>
                  </div>
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      handleLogout();
                    }}
                    className="text-white bg-red-500 hover:bg-red-600 px-3 py-2 rounded-lg transition-all font-medium flex items-center gap-2 justify-center"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Đăng xuất
                  </button>
                </>
              ) : (
                <Link 
                  href="/site/auth/login" 
                  className="bg-white text-green-600 hover:bg-green-50 px-4 py-2 rounded-lg font-bold transition-all flex items-center gap-2 justify-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  Đăng nhập
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}