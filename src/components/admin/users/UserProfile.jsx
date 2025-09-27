"use client";

import React, { useEffect, useState } from "react";
import { getUsers, deleteUser } from "@/services/userService";
import { toast } from "react-toastify";

export default function UserList() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchUsers = async () => {
        try {
            const data = await getUsers();
            setUsers(data);
        } catch (error) {
            toast.error("Không thể tải danh sách người dùng");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm("Bạn có chắc chắn muốn xóa người dùng này không?")) return;
        try {
            await deleteUser(id);
            toast.success("Đã xóa người dùng");
            fetchUsers();
        } catch (error) {
            toast.error("Lỗi khi xóa người dùng");
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    if (loading) return <p>Đang tải danh sách người dùng...</p>;

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">Danh sách người dùng</h2>
            <table className="w-full table-auto border-collapse">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="border p-2">ID</th>
                        <th className="border p-2">Tên</th>
                        <th className="border p-2">Email</th>
                        <th className="border p-2">Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user.id}>
                            <td className="border p-2">{user.id}</td>
                            <td className="border p-2">{user.username || user.name}</td>
                            <td className="border p-2">{user.email}</td>
                            <td className="border p-2">
                                <button
                                    onClick={() => handleDelete(user.id)}
                                    className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                                >
                                    Xóa
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
