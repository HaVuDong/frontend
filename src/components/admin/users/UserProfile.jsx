"use client";

import React, { useEffect, useState } from "react";
import { getUsers, deleteUser } from "@/services/userService";
import { toast } from "react-toastify";

export default function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);

  // 🔹 Hàm tải danh sách user
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await getUsers();
      setUsers(data);
    } catch (error) {
      console.error("❌ Lỗi tải users:", error);
      toast.error("Không thể tải danh sách người dùng!");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Xóa user
  const handleDelete = async (id) => {
    if (!confirm("Bạn có chắc chắn muốn xóa người dùng này không?")) return;
    setBusyId(id);
    try {
      await deleteUser(id);
      setUsers((prev) => prev.filter((u) => u._id !== id));
      toast.success("Đã xóa người dùng!");
    } catch (error) {
      console.error("❌ Lỗi khi xóa:", error);
      toast.error("Không thể xóa người dùng!");
    } finally {
      setBusyId(null);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Hiển thị
  if (loading) return <p className="p-6 text-gray-500">Đang tải danh sách người dùng...</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Danh sách người dùng</h2>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-700">
            <tr>
              <th className="text-left px-4 py-2">STT</th>
              <th className="text-left px-4 py-2">Tên đăng nhập</th>
              <th className="text-left px-4 py-2">Email</th>
              <th className="text-left px-4 py-2">Vai trò</th>
              <th className="text-right px-4 py-2">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-6 text-gray-500">
                  Không có người dùng nào.
                </td>
              </tr>
            ) : (
              users.map((user, index) => (
                <tr key={user._id} className="border-t">
                  <td className="px-4 py-2">{index + 1}</td>
                  <td className="px-4 py-2 font-medium">{user.username || user.name}</td>
                  <td className="px-4 py-2">{user.email || "—"}</td>
                  <td className="px-4 py-2">{user.role || "user"}</td>
                  <td className="px-4 py-2 text-right">
                    <button
                      onClick={() => handleDelete(user._id)}
                      disabled={busyId === user._id}
                      className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-60"
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
