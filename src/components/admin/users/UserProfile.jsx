"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "react-toastify";
import { FaUsers, FaArrowLeft, FaTrashAlt } from "react-icons/fa";
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
      <p className="text-center py-10 text-gray-500">
        ⏳ Đang tải danh sách người dùng...
      </p>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-200 to-blue-200 py-10 px-4">
      <div className="max-w-6xl mx-auto bg-white/90 p-8 rounded-2xl shadow-lg">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <FaUsers className="text-2xl text-green-700" />
            <h1 className="text-2xl font-extrabold text-green-700">
              Danh sách người dùng
            </h1>
          </div>
          <Link
            href="/admin"
            className="inline-flex items-center gap-2 border px-4 py-2 rounded-xl hover:bg-gray-50"
          >
            <FaArrowLeft /> Quay lại trang quản trị
          </Link>
        </div>

        {/* Table */}
        {users.length === 0 ? (
          <div className="text-center text-gray-500 py-10">
            Chưa có người dùng nào trong hệ thống.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table-auto w-full border border-gray-300 text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border px-3 py-2">STT</th>
                  <th className="border px-3 py-2">Tên đăng nhập</th>
                  <th className="border px-3 py-2">Email</th>
                  <th className="border px-3 py-2">Vai trò</th>
                  <th className="border px-3 py-2 text-center">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u, i) => (
                  <tr key={u._id || i} className="hover:bg-gray-50">
                    <td className="border px-3 py-2 text-center">{i + 1}</td>
                    <td className="border px-3 py-2 font-medium text-green-700">
                      {u.username || "—"}
                    </td>
                    <td className="border px-3 py-2">{u.email || "—"}</td>
                    <td className="border px-3 py-2 capitalize">
                      {u.role || "user"}
                    </td>
                    <td className="border px-3 py-2 text-center">
                      <button
                        onClick={() => handleDelete(u._id)}
                        disabled={busyId === u._id}
                        className={`inline-flex items-center gap-1 bg-red-600 text-white px-3 py-1 rounded-lg hover:bg-red-700 text-xs ${
                          busyId === u._id ? "opacity-60" : ""
                        }`}
                      >
                        <FaTrashAlt />{" "}
                        {busyId === u._id ? "Đang xóa..." : "Xóa"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
