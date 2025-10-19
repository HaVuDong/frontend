"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";

export default function Header() {
  const [user, setUser] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  // ✅ Load user ban đầu + theo dõi thay đổi login/logout qua storage
  useEffect(() => {
    const loadUser = () => {
      const userData = localStorage.getItem("user");
      if (userData) {
        setUser(JSON.parse(userData));
      } else {
        setUser(null);
      }
    };

    loadUser();
    window.addEventListener("storage", loadUser);
    return () => window.removeEventListener("storage", loadUser);
  }, []);

  // ✅ Scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("jwt");
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    document.cookie = "jwt=; path=/;";
    document.cookie = "role=; path=/;";
    setUser(null);
    window.dispatchEvent(new Event("storage"));
    router.push("/site");
  };

  const navItems = [
  { href: "/site", label: "Trang chủ", icon: "🏠" },
  { href: "/site/products", label: "Sản phẩm", icon: "🛒" },
  { href: "/site/bookings", label: "Đặt sân", icon: "⚽" },
  { href: "/site/bookings/my", label: "Lịch đã đặt", icon: "📅" },
  { href: "/site/contact", label: "Góp Ý", icon: "💬" },
];


  return (
    <>
      {/* Header Container */}
      <header
        className={`sticky top-0 z-50 transition-all duration-500 ${
          isScrolled
            ? "bg-white/95 backdrop-blur-lg shadow-2xl"
            : "bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            
            {/* Logo */}
            <Link href="/site" className="flex items-center gap-3 group">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-white to-green-100 rounded-2xl flex items-center justify-center shadow-xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                  <span className="text-2xl">⚽</span>
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full animate-pulse"></div>
              </div>
              <div className="hidden sm:block">
                <h1 className={`text-2xl font-black tracking-tight transition-colors duration-300 ${
                  isScrolled 
                    ? "text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-teal-600" 
                    : "text-white"
                }`}>
                  Sân Bóng NĐ
                </h1>
                <p className={`text-xs font-semibold transition-colors duration-300 ${
                  isScrolled ? "text-gray-600" : "text-green-100"
                }`}>
                  Đặt sân nhanh chóng
                </p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-2">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`group relative px-5 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 ${
                      isActive
                        ? isScrolled
                          ? "bg-gradient-to-r from-green-500 to-teal-500 text-white shadow-lg scale-105"
                          : "bg-white/20 text-white backdrop-blur-sm shadow-lg scale-105"
                        : isScrolled
                        ? "text-gray-700 hover:bg-green-50 hover:text-green-600"
                        : "text-white/90 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span className="text-lg group-hover:scale-125 transition-transform duration-300">
                        {item.icon}
                      </span>
                      {item.label}
                    </span>
                    {isActive && (
                      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1/2 h-1 bg-gradient-to-r from-transparent via-yellow-400 to-transparent rounded-full"></div>
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* User Section */}
            <div className="flex items-center gap-3">
              {!user ? (
                <Link
                  href="/site/auth/login"
                  className={`group relative px-6 py-2.5 rounded-xl font-bold text-sm overflow-hidden transition-all duration-300 ${
                    isScrolled
                      ? "bg-gradient-to-r from-green-500 to-teal-500 text-white shadow-lg hover:shadow-xl hover:scale-105"
                      : "bg-white text-green-600 shadow-lg hover:shadow-xl hover:scale-105"
                  }`}
                >
                  <span className="relative z-10 flex items-center gap-2">
                    <svg className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                    </svg>
                    Đăng nhập
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-teal-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </Link>
              ) : (
                <div className="flex items-center gap-3">
                  {/* User Avatar & Name */}
                  <div className={`group flex items-center gap-3 px-4 py-2 rounded-xl transition-all duration-300 ${
                    isScrolled
                      ? "bg-gradient-to-r from-green-50 to-teal-50 hover:from-green-100 hover:to-teal-100"
                      : "bg-white/10 backdrop-blur-sm hover:bg-white/20"
                  }`}>
                    <div className="relative">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-lg shadow-lg group-hover:scale-110 transition-transform duration-300 ${
                        isScrolled
                          ? "bg-gradient-to-br from-green-500 to-teal-500 text-white"
                          : "bg-white text-green-600"
                      }`}>
                        {user.username?.[0]?.toUpperCase() || "U"}
                      </div>
                      <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></div>
                    </div>
                    <div className="hidden sm:block">
                      <p className={`font-bold text-sm leading-tight ${
                        isScrolled ? "text-gray-900" : "text-white"
                      }`}>
                        {user.username || "Người dùng"}
                      </p>
                      <p className={`text-xs font-semibold ${
                        isScrolled ? "text-gray-600" : "text-white/80"
                      }`}>
                        Thành viên
                      </p>
                    </div>
                  </div>

                  {/* Logout Button */}
                  <button
                    onClick={handleLogout}
                    className="group relative px-4 py-2.5 rounded-xl font-bold text-sm bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 overflow-hidden"
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      <svg className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Đăng xuất
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </button>
                </div>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className={`lg:hidden p-2 rounded-xl transition-all duration-300 ${
                  isScrolled
                    ? "bg-green-50 text-green-600 hover:bg-green-100"
                    : "bg-white/10 text-white hover:bg-white/20"
                }`}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {isMobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`lg:hidden overflow-hidden transition-all duration-500 ${
            isMobileMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <nav className={`px-4 pb-4 space-y-2 ${
            isScrolled ? "bg-white" : "bg-white/10 backdrop-blur-sm"
          }`}>
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all duration-300 ${
                    isActive
                      ? "bg-gradient-to-r from-green-500 to-teal-500 text-white shadow-lg scale-105"
                      : isScrolled
                      ? "text-gray-700 hover:bg-green-50"
                      : "text-white hover:bg-white/10"
                  }`}
                >
                  <span className="text-xl">{item.icon}</span>
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>

      {/* Decorative Line */}
      <div className="h-1 bg-gradient-to-r from-green-500 via-yellow-400 to-teal-500"></div>
    </>
  );
}
