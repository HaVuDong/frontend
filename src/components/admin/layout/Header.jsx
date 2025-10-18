// Header.jsx
"use client"
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Bell, Search, Settings, LogOut, User, ChevronDown, Menu } from 'lucide-react'

const Header = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [notifications, setNotifications] = useState(3);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    setUser(userData ? JSON.parse(userData) : null);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    document.cookie = 'role=; path=/;';
    setUser(null);
    setIsDropdownOpen(false);
    router.push('/site/auth/login');
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-white shadow-lg border-b-4 border-gradient">
        <div className="relative"> {/* ✅ BỎ overflow-hidden */}
          {/* Animated Background Gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-10 animate-gradient pointer-events-none"></div>
          
          <div className="relative px-6 py-4">
            <div className="flex items-center justify-between">
              {/* Left Section - Logo & Title */}
              <div className="flex items-center gap-4">
                <button className="lg:hidden p-2 hover:bg-gray-100 rounded-xl transition-all duration-300">
                  <Menu className="w-6 h-6 text-gray-700" />
                </button>
                
                <div className="flex items-center gap-3 group">
                  <div className="relative">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-2xl group-hover:scale-110 transition-all duration-500 animate-float">
                      <span className="text-2xl font-black text-white">Đ</span>
                    </div>
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
                  </div>
                  
                  <div>
                    <h1 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 group-hover:from-purple-600 group-hover:to-pink-600 transition-all duration-500">
                      Admin Dashboard
                    </h1>
                    <p className="text-xs text-gray-500 font-semibold">Quản lý hệ thống</p>
                  </div>
                </div>
              </div>

              {/* Center Section - Search */}
              <div className="hidden md:flex flex-1 max-w-xl mx-8">
                <div className={`relative w-full transition-all duration-300 ${isSearchFocused ? 'scale-105' : ''}`}>
                  <Search className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-all duration-300 ${isSearchFocused ? 'text-blue-600' : 'text-gray-400'}`} />
                  <input
                    type="text"
                    placeholder="Tìm kiếm sân, đặt chỗ, người dùng..."
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-blue-500 focus:bg-white transition-all duration-300 font-semibold text-sm"
                    onFocus={() => setIsSearchFocused(true)}
                    onBlur={() => setIsSearchFocused(false)}
                  />
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                    <kbd className="px-2 py-1 text-xs font-semibold text-gray-500 bg-gray-100 border border-gray-200 rounded">
                      Ctrl K
                    </kbd>
                  </div>
                </div>
              </div>

              {/* Right Section - Actions */}
              <div className="flex items-center gap-3">
                {/* Notifications */}
                <button className="relative p-3 hover:bg-gray-100 rounded-xl transition-all duration-300 group">
                  <Bell className="w-6 h-6 text-gray-700 group-hover:text-blue-600 group-hover:scale-110 transition-all duration-300" />
                  {notifications > 0 && (
                    <span className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-bounce">
                      {notifications}
                    </span>
                  )}
                </button>

                {/* Settings */}
                <button className="p-3 hover:bg-gray-100 rounded-xl transition-all duration-300 group">
                  <Settings className="w-6 h-6 text-gray-700 group-hover:text-blue-600 group-hover:rotate-90 transition-all duration-500" />
                </button>

                {/* User Profile */}
                {user ? (
                  <div className="relative"> {/* ✅ BỎ z-index ở đây */}
                    <button
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className="flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl hover:shadow-lg hover:scale-105 transition-all duration-300 group"
                    >
                      <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center font-black text-lg group-hover:scale-110 transition-all duration-300">
                        {user.username?.charAt(0).toUpperCase()}
                      </div>
                      <div className="hidden lg:block text-left">
                        <p className="font-bold text-sm">{user.username}</p>
                        <p className="text-xs opacity-90">Administrator</p>
                      </div>
                      <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>
                  </div>
                ) : (
                  <Link
                    href="/site/auth/login"
                    className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold rounded-2xl hover:shadow-lg hover:scale-105 transition-all duration-300"
                  >
                    Login
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ✅ DROPDOWN PORTAL - Render bên ngoài header với z-index cực cao */}
      {isDropdownOpen && user && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-[9998] bg-black/10 backdrop-blur-[2px]" 
            onClick={() => setIsDropdownOpen(false)}
          ></div>
          
          {/* Dropdown Menu - Fixed position */}
          <div 
            className="fixed z-[9999] animate-slideDown"
            style={{
              top: '80px', // Điều chỉnh theo chiều cao header
              right: '24px', // Điều chỉnh theo padding
            }}
          >
            <div className="w-64 bg-white rounded-2xl shadow-2xl border-2 border-gray-100 overflow-hidden">
              <div className="p-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                <p className="font-bold text-lg">{user.username}</p>
                <p className="text-sm opacity-90">{user.email || 'admin@example.com'}</p>
              </div>
              
              <div className="p-2">
                <Link
                  href="/site/auth/profile"
                  className="flex items-center gap-3 px-4 py-3 hover:bg-blue-50 rounded-xl transition-all duration-300 group"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  <User className="w-5 h-5 text-gray-600 group-hover:text-blue-600 transition-colors" />
                  <span className="font-semibold text-gray-700 group-hover:text-blue-600">Profile</span>
                </Link>
                
                <Link
                  href="/site/auth/settings"
                  className="flex items-center gap-3 px-4 py-3 hover:bg-blue-50 rounded-xl transition-all duration-300 group"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  <Settings className="w-5 h-5 text-gray-600 group-hover:text-blue-600 transition-colors" />
                  <span className="font-semibold text-gray-700 group-hover:text-blue-600">Settings</span>
                </Link>
                
                <hr className="my-2" />
                
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 rounded-xl transition-all duration-300 group"
                >
                  <LogOut className="w-5 h-5 text-gray-600 group-hover:text-red-600 transition-colors" />
                  <span className="font-semibold text-gray-700 group-hover:text-red-600">Logout</span>
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      <style jsx>{`
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-5px); }
        }
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
        .border-gradient {
          border-image: linear-gradient(to right, #3b82f6, #8b5cf6, #ec4899) 1;
        }
      `}</style>
    </>
  );
};

export default Header;
