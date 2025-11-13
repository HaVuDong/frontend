"use client";
import React, { useEffect, useState } from "react";
import { getBookingsByUserId, deleteBooking } from "@/services/bookingService";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "react-toastify";
import Link from "next/link";

export default function MyBookingsPage() {
  const { user, loading } = useAuth();
  const [bookings, setBookings] = useState([]);
    const [loadingBooking, setLoadingBooking] = useState(true);
  // ✅ Lấy dữ liệu booking của user
  useEffect(() => {
     // 1. Auth vẫn đang kiểm tra token → chưa làm gì
    if (loading) {
      console.log("⏳ Auth chưa sẵn sàng, đang check token...");
      return;
    }

     if (!user) {
      console.warn("⚠️ Không có user, không thể tải lịch đặt!");
      setLoadingBooking(false); // ✨ Tắt spinner, hiển thị “Chưa có lịch đặt nào”
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
        setLoadingBooking(false); // ✨ Dù thành công hay lỗi cũng tắt spinner
      }
    }

    load();
  }, [loading, user]); // 🔥 Phụ thuộc vào trạng thái auth và user

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
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 py-10 px-4">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 bg-white px-6 py-3 rounded-2xl shadow-lg mb-4 animate-fadeIn">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-teal-500 rounded-xl flex items-center justify-center shadow-lg animate-pulse">
              <span className="text-2xl">🏟️</span>
            </div>
            <div className="text-left">
              <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-teal-600">
                Lịch Đặt Sân Của Tôi
              </h1>
              <p className="text-sm text-gray-600 font-semibold">
                Quản lý tất cả lịch đặt sân của bạn
              </p>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="bg-white rounded-2xl shadow-xl p-12 animate-fadeIn">
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-gray-600 font-semibold">Đang tải lịch đặt sân...</p>
            </div>
          </div>
        ) : bookings.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center animate-fadeIn">
            <div className="flex flex-col items-center gap-6">
              <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
                <span className="text-5xl">📋</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  Chưa có lịch đặt nào
                </h3>
                <p className="text-gray-600 mb-6">
                  Bạn chưa đặt sân nào. Hãy bắt đầu đặt sân ngay hôm nay!
                </p>
                <Link
                  href="/site/bookings"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-teal-500 text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl hover:from-green-600 hover:to-teal-600 transition-all duration-300 hover:scale-105"
                >
                  <span>⚽</span>
                  Đặt sân ngay
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4 animate-fadeIn">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-gradient-to-br from-yellow-400 to-amber-500 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/90 text-sm font-semibold mb-1">Chờ duyệt</p>
                    <p className="text-white text-3xl font-black">
                      {bookings.filter(b => b.status === "pending").length}
                    </p>
                  </div>
                  <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
                    <span className="text-3xl">⏳</span>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/90 text-sm font-semibold mb-1">Đã xác nhận</p>
                    <p className="text-white text-3xl font-black">
                      {bookings.filter(b => b.status === "confirmed").length}
                    </p>
                  </div>
                  <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
                    <span className="text-3xl">✅</span>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-red-500 to-pink-600 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/90 text-sm font-semibold mb-1">Đã hủy</p>
                    <p className="text-white text-3xl font-black">
                      {bookings.filter(b => b.status !== "pending" && b.status !== "confirmed").length}
                    </p>
                  </div>
                  <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
                    <span className="text-3xl">❌</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bookings List - Card View for Mobile, Table for Desktop */}
            <div className="hidden md:block bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gradient-to-r from-green-500 to-teal-500 text-white">
                      <th className="px-4 py-4 text-left font-bold text-sm">
                        <div className="flex items-center gap-2">
                          <span>📅</span>
                          Ngày
                        </div>
                      </th>
                      <th className="px-4 py-4 text-left font-bold text-sm">
                        <div className="flex items-center gap-2">
                          <span>⏰</span>
                          Giờ
                        </div>
                      </th>
                      <th className="px-4 py-4 text-left font-bold text-sm">
                        <div className="flex items-center gap-2">
                          <span>🏟️</span>
                          Sân
                        </div>
                      </th>
                      <th className="px-4 py-4 text-left font-bold text-sm">
                        <div className="flex items-center gap-2">
                          <span>📍</span>
                          Địa chỉ
                        </div>
                      </th>
                      <th className="px-4 py-4 text-left font-bold text-sm">
                        <div className="flex items-center gap-2">
                          <span>💰</span>
                          Giá/giờ
                        </div>
                      </th>
                      <th className="px-4 py-4 text-center font-bold text-sm">
                        <div className="flex items-center justify-center gap-2">
                          <span>📊</span>
                          Trạng thái
                        </div>
                      </th>
                      <th className="px-4 py-4 text-left font-bold text-sm">
                        <div className="flex items-center gap-2">
                          <span>📝</span>
                          Ghi chú
                        </div>
                      </th>
                      <th className="px-4 py-4 text-center font-bold text-sm">
                        <div className="flex items-center justify-center gap-2">
                          <span>⚙️</span>
                          Hành động
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map((b, i) => (
                      <tr 
                        key={i} 
                        className="border-b border-gray-100 hover:bg-gradient-to-r hover:from-green-50 hover:to-teal-50 transition-all duration-300"
                      >
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-2">
                            <div className="w-10 h-10 bg-gradient-to-br from-green-100 to-teal-100 rounded-lg flex items-center justify-center">
                              <span className="text-lg font-black text-green-700">
                                {new Date(b.bookingDate).getDate()}
                              </span>
                            </div>
                            <span className="text-sm font-semibold text-gray-700">
                              {new Date(b.bookingDate).toLocaleDateString("vi-VN")}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-3 py-2 rounded-lg inline-block">
                            <span className="text-sm font-bold text-blue-700">
                              {b.startTime} - {b.endTime}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <span className="font-bold text-green-700">
                            {b.fieldInfo?.name || "Không xác định"}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <span className="text-sm text-gray-600">
                            {b.fieldInfo?.location || "-"}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <span className="font-bold text-orange-600">
                            {b.fieldInfo?.pricePerHour
                              ? `${Number(b.fieldInfo.pricePerHour).toLocaleString()}đ`
                              : "-"}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-center">
                          <span
                            className={`inline-flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-bold shadow-md ${
                              b.status === "pending"
                                ? "bg-gradient-to-r from-yellow-400 to-amber-400 text-white"
                                : b.status === "confirmed"
                                ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white"
                                : "bg-gradient-to-r from-red-500 to-pink-500 text-white"
                            }`}
                          >
                            {b.status === "pending" ? (
                              <>⏳ Chờ duyệt</>
                            ) : b.status === "confirmed" ? (
                              <>✅ Đã xác nhận</>
                            ) : (
                              <>❌ Đã hủy</>
                            )}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <span className="text-sm text-gray-700">
                            {b.notes || "-"}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-center">
                          {b.status === "pending" && (
                            <button
                              onClick={() => handleCancel(b._id)}
                              className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-2 rounded-lg font-bold shadow-md hover:shadow-lg hover:from-red-600 hover:to-pink-600 transition-all duration-300 hover:scale-105 text-xs"
                            >
                              🗑️ Hủy
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-4">
              {bookings.map((b, i) => (
                <div 
                  key={i}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
                >
                  {/* Card Header */}
                  <div className="bg-gradient-to-r from-green-500 to-teal-500 px-4 py-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                          <span className="text-2xl">🏟️</span>
                        </div>
                        <div>
                          <h3 className="text-white font-black text-lg">
                            {b.fieldInfo?.name || "Không xác định"}
                          </h3>
                          <p className="text-white/80 text-xs font-semibold">
                            {new Date(b.bookingDate).toLocaleDateString("vi-VN")}
                          </p>
                        </div>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-lg text-xs font-bold ${
                          b.status === "pending"
                            ? "bg-yellow-400 text-white"
                            : b.status === "confirmed"
                            ? "bg-green-600 text-white"
                            : "bg-red-600 text-white"
                        }`}
                      >
                        {b.status === "pending" ? "⏳" : b.status === "confirmed" ? "✅" : "❌"}
                      </span>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-4 space-y-3">
                    <div className="flex items-center gap-3 bg-gradient-to-r from-blue-50 to-indigo-50 p-3 rounded-xl">
                      <span className="text-xl">⏰</span>
                      <div>
                        <p className="text-xs text-gray-600 font-semibold">Thời gian</p>
                        <p className="text-sm font-black text-blue-700">
                          {b.startTime} - {b.endTime}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 bg-gradient-to-r from-orange-50 to-amber-50 p-3 rounded-xl">
                      <span className="text-xl">💰</span>
                      <div>
                        <p className="text-xs text-gray-600 font-semibold">Giá thuê</p>
                        <p className="text-sm font-black text-orange-600">
                          {b.fieldInfo?.pricePerHour
                            ? `${Number(b.fieldInfo.pricePerHour).toLocaleString()}đ/giờ`
                            : "-"}
                        </p>
                      </div>
                    </div>

                    {b.fieldInfo?.location && (
                      <div className="flex items-center gap-3 bg-gradient-to-r from-purple-50 to-pink-50 p-3 rounded-xl">
                        <span className="text-xl">📍</span>
                        <div>
                          <p className="text-xs text-gray-600 font-semibold">Địa chỉ</p>
                          <p className="text-sm font-bold text-purple-700">
                            {b.fieldInfo.location}
                          </p>
                        </div>
                      </div>
                    )}

                    {b.notes && (
                      <div className="flex items-start gap-3 bg-gradient-to-r from-gray-50 to-slate-50 p-3 rounded-xl">
                        <span className="text-xl">📝</span>
                        <div>
                          <p className="text-xs text-gray-600 font-semibold mb-1">Ghi chú</p>
                          <p className="text-sm text-gray-700">{b.notes}</p>
                        </div>
                      </div>
                    )}

                    {b.status === "pending" && (
                      <button
                        onClick={() => handleCancel(b._id)}
                        className="w-full bg-gradient-to-r from-red-500 to-pink-500 text-white py-3 rounded-xl font-bold shadow-md hover:shadow-lg hover:from-red-600 hover:to-pink-600 transition-all duration-300 hover:scale-105"
                      >
                        🗑️ Hủy đặt sân
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
