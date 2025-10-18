"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "react-toastify";
import { FaUsers, FaArrowLeft, FaTrashAlt, FaUserShield, FaEnvelope, FaUserCircle } from "react-icons/fa";
import axiosClient from "@/utils/axiosClient";

export default function AdminUserListPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);

  // ✅ Lấy danh sách người dùng qua cookie (JWT)
  useEffect(() => {
    async function loadUsers() {
      console.log("🚀 Bắt đầu tải danh sách người dùng (qua cookie JWT)...");
      try {
        const res = await axiosClient.get("/users", { withCredentials: true });
        console.log("✅ Phản hồi API:", res);

        const data = res?.data?.data || res?.data || [];
        console.log("📦 Tổng số người dùng nhận được:", data.length);
        setUsers(data);
      } catch (err) {
        console.error("❌ Lỗi tải users:", err);
        const msg =
          err.response?.data?.message ||
          err.message ||
          "Không thể tải danh sách người dùng!";
        toast.error(msg);

        // Nếu token hết hạn hoặc không có quyền → logout
        if (
          msg.toLowerCase().includes("invalid token") ||
          msg.toLowerCase().includes("unauthorized") ||
          msg.toLowerCase().includes("forbidden")
        ) {
          toast.info("Phiên đăng nhập hết hạn, vui lòng đăng nhập lại!");
          setTimeout(() => (window.location.href = "/site/auth/login"), 1000);
        }
      } finally {
        setLoading(false);
      }
    }

    loadUsers();
  }, []);

  // ✅ Xóa user
  async function handleDelete(id) {
    console.log("⚙️ Gửi yêu cầu xóa user ID:", id);
    if (!confirm("Bạn có chắc chắn muốn xóa người dùng này không?")) return;

    setBusyId(id);
    try {
      const res = await axiosClient.delete(`/users/${id}`, {
        withCredentials: true,
      });
      console.log("🗑️ Đã xóa user:", res);
      setUsers((prev) => prev.filter((u) => u._id !== id));
      toast.success("🗑️ Đã xóa người dùng!");
    } catch (err) {
      console.error("❌ Lỗi khi xóa user:", err);
      toast.error(err.response?.data?.message || "Không thể xóa người dùng!");
    } finally {
      setBusyId(null);
    }
  }

  // 🕓 Hiển thị khi đang tải
  if (loading)
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-emerald-500 border-t-transparent mb-4"></div>
          <p className="text-lg text-gray-600 font-medium animate-pulse">
            ⏳ Đang tải danh sách người dùng...
          </p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50 py-10 px-4 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-emerald-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute top-0 right-0 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-white/50 transform transition-all duration-500 hover:shadow-3xl">
          {/* Header */}
          <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-4 rounded-2xl shadow-lg transform transition-transform hover:scale-110 hover:rotate-3">
                <FaUsers className="text-3xl text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-extrabold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  Danh sách người dùng
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                  Tổng số: <span className="font-semibold text-emerald-600">{users.length}</span> người dùng
                </p>
              </div>
            </div>
            <Link
              href="/admin"
              className="group inline-flex items-center gap-2 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-emerald-500 hover:to-teal-500 px-6 py-3 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 font-medium text-gray-700 hover:text-white"
            >
              <FaArrowLeft className="transition-transform group-hover:-translate-x-1" /> 
              Quay lại trang quản trị
            </Link>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-6 rounded-2xl shadow-lg text-white transform transition-all hover:scale-105">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-emerald-100 text-sm font-medium">Tổng người dùng</p>
                  <p className="text-3xl font-bold mt-1">{users.length}</p>
                </div>
                <FaUserCircle className="text-5xl opacity-30" />
              </div>
            </div>
            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-6 rounded-2xl shadow-lg text-white transform transition-all hover:scale-105">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">Quản trị viên</p>
                  <p className="text-3xl font-bold mt-1">
                    {users.filter(u => u.role === 'admin').length}
                  </p>
                </div>
                <FaUserShield className="text-5xl opacity-30" />
              </div>
            </div>
            <div className="bg-gradient-to-br from-purple-500 to-pink-600 p-6 rounded-2xl shadow-lg text-white transform transition-all hover:scale-105">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium">Người dùng thường</p>
                  <p className="text-3xl font-bold mt-1">
                    {users.filter(u => u.role !== 'admin').length}
                  </p>
                </div>
                <FaUsers className="text-5xl opacity-30" />
              </div>
            </div>
          </div>

          {/* Table */}
          {users.length === 0 ? (
            <div className="text-center py-20">
              <div className="inline-block bg-gray-100 p-8 rounded-full mb-4">
                <FaUsers className="text-6xl text-gray-300" />
              </div>
              <p className="text-gray-500 text-lg font-medium">
                Chưa có người dùng nào trong hệ thống.
              </p>
            </div>
          ) : (
            <div className="overflow-hidden rounded-2xl border border-gray-200 shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white">
                      <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider">STT</th>
                      <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider">
                        <div className="flex items-center gap-2">
                          <FaUserCircle /> Tên đăng nhập
                        </div>
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider">
                        <div className="flex items-center gap-2">
                          <FaEnvelope /> Email
                        </div>
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider">
                        <div className="flex items-center gap-2">
                          <FaUserShield /> Vai trò
                        </div>
                      </th>
                      <th className="px-6 py-4 text-center text-sm font-bold uppercase tracking-wider">Hành động</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {users.map((u, i) => (
                      <tr 
                        key={u._id || i} 
                        className="hover:bg-gradient-to-r hover:from-emerald-50 hover:to-teal-50 transition-all duration-200 transform hover:scale-[1.01]"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-full font-bold text-emerald-700 text-sm">
                            {i + 1}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center text-white font-bold shadow-md">
                              {(u.username || "U")[0].toUpperCase()}
                            </div>
                            <span className="font-semibold text-gray-800">{u.username || "—"}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                          {u.email || "—"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold shadow-sm ${
                            u.role === 'admin' 
                              ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white' 
                              : 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700'
                          }`}>
                            {u.role === 'admin' && <FaUserShield />}
                            {u.role || "user"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <button
                            onClick={() => handleDelete(u._id)}
                            disabled={busyId === u._id}
                            className={`group inline-flex items-center gap-2 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white px-4 py-2 rounded-xl font-medium text-sm shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 ${
                              busyId === u._id ? "opacity-60 cursor-not-allowed" : ""
                            }`}
                          >
                            <FaTrashAlt className="transition-transform group-hover:rotate-12" />
                            {busyId === u._id ? (
                              <>
                                <span className="inline-block animate-spin rounded-full h-3 w-3 border-2 border-white border-t-transparent"></span>
                                Đang xóa...
                              </>
                            ) : (
                              "Xóa"
                            )}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}