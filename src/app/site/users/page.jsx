"use client"
import React, { useEffect, useState } from "react"

export default function UserPage() {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // 🔹 Gọi API lấy thông tin user
        fetch("https://68931a76c49d24bce869717c.mockapi.io/users/1")
            .then((res) => res.json())
            .then((data) => {
                // Giả lập thêm dữ liệu mở rộng
                const extraData = {
                    matchesPlayed: 12,
                    bookings: [
                        { date: "2025-09-22", time: "19:00 - 21:00", field: "Sân 5-3" },
                        { date: "2025-09-25", time: "20:00 - 22:00", field: "Sân 7-1" },
                    ],
                    accessories: ["Giày Nike Tiempo", "Áo CLB MU", "Bóng Động Lực số 5"]
                }
                setUser({ ...data, ...extraData })
                setLoading(false)
            })
            .catch((err) => {
                console.error("Lỗi khi lấy user:", err)
                setLoading(false)
            })
    }, [])

    if (loading) {
        return <p className="p-4">Đang tải thông tin...</p>
    }

    if (!user) {
        return <p className="p-4 text-red-500">Không tìm thấy thông tin người dùng.</p>
    }

    return (
        <div className="p-6 max-w-2xl mx-auto bg-white rounded-2xl shadow-lg">
            <h1 className="text-2xl font-bold mb-4 text-center">Thông tin người dùng</h1>
            
            
            <div className="space-y-2 mb-6">
                <p><span className="font-semibold">Tên:</span> {user.name}</p>
                <p><span className="font-semibold">Email:</span> {user.email}</p>
                <p><span className="font-semibold">Số điện thoại:</span> {user.phone || "Chưa có"}</p>
                <p><span className="font-semibold">Địa chỉ:</span> {user.address || "Chưa có"}</p>
            </div>

            
            <div className="mb-6">
                <h2 className="text-lg font-semibold mb-2">Thống kê</h2>
                <p>Số trận đã đá: <span className="font-bold">{user.matchesPlayed}</span></p>
            </div>

            
            <div className="mb-6">
                <h2 className="text-lg font-semibold mb-2">Lịch đã đặt sân</h2>
                <ul className="list-disc list-inside space-y-1">
                    {user.bookings?.map((b, idx) => (
                        <li key={idx}>
                            {b.date} ({b.time}) - {b.field}
                        </li>
                    ))}
                </ul>
            </div>

            
            <div>
                <h2 className="text-lg font-semibold mb-2">Phụ kiện đã mua</h2>
                <ul className="list-disc list-inside space-y-1">
                    {user.accessories?.map((item, idx) => (
                        <li key={idx}>{item}</li>
                    ))}
                </ul>
            </div>
        </div>
    )
}
