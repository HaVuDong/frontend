"use client";

import Footer from "@/components/admin/layout/Footer";
import Header from "@/components/admin/layout/Header";
import Sidebar from "@/components/admin/layout/Sidebar";
import AdminGuard from "@/components/admin/auth/AdminGuard";
import { useState } from "react";
import { Menu, X, ChevronRight } from "lucide-react";

export default function AdminLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <AdminGuard>
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        {/* Header */}
        <Header />

        {/* Main Content Wrapper */}
        <div className="flex flex-1 relative overflow-hidden">
          {/* Mobile Sidebar Toggle Button */}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="lg:hidden fixed bottom-6 right-6 z-50 w-14 h-14 bg-gradient-to-br from-blue-600 to-purple-600 text-white rounded-2xl shadow-2xl flex items-center justify-center hover:scale-110 transition-all duration-300 group"
          >
            {isSidebarOpen ? (
              <X className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" />
            ) : (
              <Menu className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
            )}
          </button>

          {/* Mobile Overlay */}
          {isSidebarOpen && (
            <div
              className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-30 animate-fadeIn"
              onClick={() => setIsSidebarOpen(false)}
            />
          )}

          {/* Sidebar */}
          <aside
            className={`
              fixed lg:sticky top-0 left-0 h-screen z-40
              w-80 flex-shrink-0
              transform transition-transform duration-300 ease-in-out
              ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}
          >
            <div className="h-full flex flex-col bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 shadow-2xl">
              {/* Sidebar Header */}
              <div className="relative p-6 border-b border-white/10">
                {/* Animated Background */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-0 left-0 w-32 h-32 bg-blue-500 rounded-full blur-3xl animate-pulse"></div>
                  <div className="absolute bottom-0 right-0 w-32 h-32 bg-purple-500 rounded-full blur-3xl animate-pulse animation-delay-2000"></div>
                </div>

                {/* Logo Section */}
                <div className="relative z-10 flex items-center justify-between">
                  <div className="flex items-center gap-3 group cursor-pointer">
                    <div className="w-14 h-14 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-12 transition-all duration-500">
                      <span className="text-3xl font-black text-white">⚽</span>
                    </div>
                    <div>
                      <h2 className="text-xl font-black text-white tracking-wide">
                        Admin Panel
                      </h2>
                      <p className="text-xs text-gray-300 font-semibold">
                        Management System
                      </p>
                    </div>
                  </div>

                  {/* Close button for mobile */}
                  <button
                    onClick={() => setIsSidebarOpen(false)}
                    className="lg:hidden w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors"
                  >
                    <X className="w-5 h-5 text-white" />
                  </button>
                </div>

                {/* Decorative Line */}
                <div className="relative mt-4">
                  <div className="h-1 bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-500 rounded-full"></div>
                  <div className="absolute top-0 left-0 h-1 w-1/3 bg-white rounded-full animate-shimmer"></div>
                </div>
              </div>

              {/* Sidebar Content */}
              <div className="flex-1 overflow-hidden">
                <Sidebar />
              </div>
            </div>
          </aside>

          {/* Main Content Area */}
          <main className="flex-1 overflow-y-auto relative">
            {/* Animated Background Pattern */}
            <div className="absolute inset-0 opacity-30 pointer-events-none">
              <div className="absolute top-0 right-0 w-96 h-96 bg-blue-200 rounded-full blur-3xl animate-blob"></div>
              <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-200 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
              <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-pink-200 rounded-full blur-3xl animate-blob animation-delay-4000"></div>
            </div>

            {/* Content Container */}
            <div className="relative z-10 p-4 md:p-6 lg:p-8">
              {/* Breadcrumb */}
              <div className="mb-6 flex items-center gap-2 text-sm">
                <span className="text-gray-500 hover:text-blue-600 cursor-pointer transition-colors font-semibold">
                  Home
                </span>
                <ChevronRight className="w-4 h-4 text-gray-400" />
                <span className="text-gray-700 font-bold">Dashboard</span>
              </div>

              {/* Content Card */}
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/50 p-6 min-h-[calc(100vh-250px)] animate-fadeIn">
                {children}
              </div>
            </div>
          </main>
        </div>

        {/* Footer */}
        <Footer />
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes blob {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }

        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(400%);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out;
        }

        .animate-blob {
          animation: blob 7s infinite;
        }

        .animate-shimmer {
          animation: shimmer 2s infinite;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }

        /* Custom Scrollbar */
        main::-webkit-scrollbar {
          width: 8px;
        }

        main::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.05);
        }

        main::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #3b82f6, #8b5cf6);
          border-radius: 10px;
        }

        main::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #2563eb, #7c3aed);
        }
      `}</style>
    </AdminGuard>
  );
}
