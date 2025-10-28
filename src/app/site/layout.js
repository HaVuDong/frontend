// src/app/site/layout.jsx
"use client";

import { AuthProvider } from "@/hooks/useAuth";
import { ToastContainer } from "react-toastify";
import Header from "@/components/site/layout/Header"; // ⭐ IMPORT HEADER
import "react-toastify/dist/ReactToastify.css";

export default function SiteLayout({ children }) {
  return (
    <AuthProvider>
      <div className="min-h-screen flex flex-col bg-gray-50">
        {/* ⭐ SỬ DỤNG HEADER COMPONENT */}
        <Header />

        {/* Main Content */}
        <main className="flex-1">
          {children}
        </main>

        {/* Footer */}
        <footer className="bg-gray-900 text-white py-12 mt-auto">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              <div>
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <span className="text-2xl">⚽</span>
                  Sân Bóng Shop
                </h3>
                <p className="text-gray-400">
                  Hệ thống đặt sân và mua sắm thể thao hàng đầu Việt Nam
                </p>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-4">📞 Liên hệ</h3>
                <p className="text-gray-400 mb-2">Hotline: 0999 123 456</p>
                <p className="text-gray-400 mb-2">Email: info@sanbong.vn</p>
                <p className="text-gray-400">Địa chỉ: TP. Hồ Chí Minh</p>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-4">🌐 Theo dõi</h3>
                <div className="flex gap-4">
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    Facebook
                  </a>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    Instagram
                  </a>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    Twitter
                  </a>
                </div>
              </div>
            </div>
            <div className="border-t border-gray-800 pt-6 text-center text-gray-400">
              <p>© 2025 Sân Bóng Shop. All rights reserved.</p>
            </div>
          </div>
        </footer>

        <ToastContainer 
          position="top-right" 
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </div>
    </AuthProvider>
  );
}