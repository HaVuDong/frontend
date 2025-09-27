"use client";

import Footer from "@/components/admin/layout/Footer";
import Header from "@/components/admin/layout/Header";
import Sidebar from "@/components/admin/layout/Sidebar";
import AdminGuard from "@/components/admin/auth/AdminGuard";

export default function AdminLayout({ children }) {
  return (
    <AdminGuard>
      <div className="flex flex-col min-h-screen">
        <Header />
        <div className="flex flex-1">
          <aside className="bg-blue-300 text-yellow-100 p-4">
            <h2 className="text-black text-3xl font-bold mb-8 text-center tracking-wide">Admin Panel</h2>
            <Sidebar />
          </aside>
          <main className=" bg-gradient-to-br from-blue-100 to-yellow-100 w-4/4 bg-gray-100 p-4 overflow-auto">
            {children}
          </main>
        </div>
        <Footer />
      </div>
    </AdminGuard>
  );
}
