"use client";
import React, { useEffect, useState } from "react";
import { getBookingsByUserId, deleteBooking } from "@/services/bookingService";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "react-toastify";
import Link from "next/link";

export default function MyBookingsPage() {
  const { user, isReady } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Lấy dữ liệu booking của user
  useEffect(() => {
    if (!isReady) {
      console.log("⏳ Auth chưa sẵn sàng, chờ isReady...");
      return;
    }

    if (!user) {
      console.warn("⚠️ Chưa có user, không thể tải lịch đặt!");
      return;
    }

    async function load() {
      console.log("🚀 Bắt đầu tải lịch đặt cho user:", user);
      console.log("🆔 userId:", user._id || user.id);

      try {
        const res = await getBookingsByUserId(user._id || user.id);
        console.log("✅ Phản hồi từ API:", res);

        const data = res?.data?.data || res?.data || [];

        console.log("📦 Tổng số booking nhận được:", data.length);
        console.log("🧩 Mẫu dữ liệu đầu tiên:", data[0]);

        // Kiểm tra fieldInfo
        if (data.length > 0) {
          if (data[0].fieldInfo) {
            console.log("🎯 fieldInfo có sẵn trong dữ liệu:", data[0].fieldInfo);
          } else {
            console.warn("⚠️ Không tìm thấy fieldInfo trong dữ liệu booking!");
          }
        }

        // Sắp xếp theo ngày mới nhất
        data.sort((a, b) => new Date(b.bookingDate) - new Date(a.bookingDate));

        setBookings(data);
      } catch (err) {
        console.error("❌ Lỗi tải lịch:", err);
        toast.error("Không thể tải lịch đã đặt!");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [isReady, user]);

  // ✅ Hủy đặt sân
  async function handleCancel(id) {
    console.log("⚙️ Yêu cầu hủy booking ID:", id);
    if (!confirm("Bạn chắc chắn muốn hủy đặt sân này?")) return;
    try {
      await deleteBooking(id);
      toast.success("Đã hủy lịch đặt!");
      console.log("🗑️ Đã xóa booking thành công:", id);
      setBookings((prev) => prev.filter((b) => b._id !== id));
    } catch (err) {
      console.error("❌ Lỗi khi hủy booking:", err);
      toast.error("Không thể hủy đặt sân!");
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 to-blue-100 py-10 px-4">
      <div className="max-w-5xl mx-auto bg-white/90 p-8 rounded-2xl shadow-lg">
        <h1 className="text-2xl font-extrabold text-center text-green-700 mb-6">
          🏟️ Lịch Đặt Sân Của Tôi
        </h1>

        {loading ? (
          <p className="text-center text-gray-500 py-8">⏳ Đang tải dữ liệu...</p>
        ) : bookings.length === 0 ? (
          <div className="text-center text-gray-500 py-10">
            Bạn chưa có lịch đặt nào.
            <Link
              href="/site/bookings"
              className="text-green-700 underline ml-1 hover:text-green-800"
            >
              Đặt ngay
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table-auto w-full border border-gray-300 text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border px-3 py-2">Ngày</th>
                  <th className="border px-3 py-2">Giờ</th>
                  <th className="border px-3 py-2">Sân</th>
                  <th className="border px-3 py-2">Địa chỉ</th>
                  <th className="border px-3 py-2">Giá / giờ</th>
                  <th className="border px-3 py-2">Trạng thái</th>
                  <th className="border px-3 py-2">Ghi chú</th>
                  <th className="border px-3 py-2">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b, i) => (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="border px-3 py-2 text-center">
                      {new Date(b.bookingDate).toLocaleDateString("vi-VN")}
                    </td>
                    <td className="border px-3 py-2 text-center">
                      {b.startTime} - {b.endTime}
                    </td>
                    <td className="border px-3 py-2 font-semibold text-green-700">
                      {b.fieldInfo?.name || "Không xác định"}
                    </td>
                    <td className="border px-3 py-2 text-gray-600">
                      {b.fieldInfo?.location || "-"}
                    </td>
                    <td className="border px-3 py-2 text-center">
                      {b.fieldInfo?.pricePerHour
                        ? `${Number(b.fieldInfo.pricePerHour).toLocaleString()}đ`
                        : "-"}
                    </td>
                    <td className="border px-3 py-2 text-center">
                      <span
                        className={`px-2 py-1 rounded-lg text-xs font-semibold ${
                          b.status === "pending"
                            ? "bg-yellow-200 text-yellow-700"
                            : b.status === "confirmed"
                            ? "bg-green-200 text-green-700"
                            : "bg-red-200 text-red-700"
                        }`}
                      >
                        {b.status === "pending"
                          ? "⏳ Chờ duyệt"
                          : b.status === "confirmed"
                          ? "✅ Đã xác nhận"
                          : "❌ Đã hủy"}
                      </span>
                    </td>
                    <td className="border px-3 py-2 text-gray-700">
                      {b.notes || "-"}
                    </td>
                    <td className="border px-3 py-2 text-center">
                      {b.status === "pending" && (
                        <button
                          onClick={() => handleCancel(b._id)}
                          className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 text-xs"
                        >
                          Hủy
                        </button>
                      )}
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
