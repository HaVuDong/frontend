"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { FaCalendarAlt, FaArrowLeft, FaRegCopy, FaCheck } from "react-icons/fa";
import { getBookings, updateBooking } from "@/services/bookingService";
import { toast } from "react-toastify";

export default function AdminScheduleListPage() {
  const [bookings, setBookings] = useState([]);
  const [copiedIdx, setCopiedIdx] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  // 🧩 Load danh sách lịch đặt
  async function fetchBookings() {
    try {
      const res = await getBookings();
      const data = Array.isArray(res.data) ? res.data : res.data?.data || [];
      setBookings(data);
    } catch (error) {
      console.error("❌ Lỗi tải danh sách lịch:", error);
      toast.error("Không thể tải danh sách lịch đặt!");
    } finally {
      setLoading(false);
    }
  }

  // 📋 Copy mã booking
  async function copyCode(code, idx) {
    await navigator.clipboard.writeText(code);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 1200);
  }

  // ✅ Duyệt hoặc từ chối đặt sân
  async function handleApprove(id, status) {
    try {
      await updateBooking(id, { status });
      toast.success(
        status === "confirmed"
          ? "✅ Đã duyệt đặt sân!"
          : status === "cancelled_admin"
          ? "❌ Admin đã từ chối lịch đặt!"
          : "🗑️ Đã cập nhật trạng thái!"
      );
      fetchBookings(); // reload danh sách
    } catch (err) {
      console.error("❌ Lỗi cập nhật trạng thái:", err);
      toast.error("Không thể cập nhật trạng thái!");
    }
  }

  // 🎨 Hàm render trạng thái
  function renderStatus(status) {
    switch (status) {
      case "confirmed":
        return (
          <span className="px-2 py-1 rounded text-xs font-semibold bg-green-100 text-green-700">
            ✅ Đã duyệt
          </span>
        );
      case "pending":
        return (
          <span className="px-2 py-1 rounded text-xs font-semibold bg-yellow-100 text-yellow-700">
            ⏳ Chờ duyệt
          </span>
        );
      case "cancelled_admin":
        return (
          <span className="px-2 py-1 rounded text-xs font-semibold bg-red-100 text-red-700">
            ❌ Bị từ chối (Admin)
          </span>
        );
      case "cancelled_no_refund":
      case "cancelled_refunded":
        return (
          <span className="px-2 py-1 rounded text-xs font-semibold bg-gray-100 text-gray-600">
            🚫 Người dùng hủy
          </span>
        );
      default:
        return (
          <span className="px-2 py-1 rounded text-xs font-semibold bg-gray-50 text-gray-600">
            Không xác định
          </span>
        );
    }
  }

  if (loading)
    return <p className="p-6 text-gray-500">Đang tải danh sách lịch đặt...</p>;

  return (
    <div className="bg-gradient-to-br from-green-200 to-blue-200 min-h-screen py-10 px-4">
      <div className="max-w-6xl mx-auto bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-lg">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <FaCalendarAlt className="text-2xl text-green-700" />
            <h1 className="text-2xl font-extrabold text-green-700">
              Danh sách lịch đã đặt
            </h1>
          </div>
          <Link
            href="/admin/fields"
            className="inline-flex items-center gap-2 border px-4 py-2 rounded-xl hover:bg-gray-50"
          >
            <FaArrowLeft /> Quay lại danh sách sân
          </Link>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="table-auto w-full border-collapse border border-gray-300 text-sm">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="border px-3 py-2">Mã đặt</th>
                <th className="border px-3 py-2">Ngày</th>
                <th className="border px-3 py-2">Giờ</th>
                <th className="border px-3 py-2">Sân</th>
                <th className="border px-3 py-2">Người đặt</th>
                <th className="border px-3 py-2">SĐT</th>
                <th className="border px-3 py-2">Trạng thái</th>
                <th className="border px-3 py-2 text-center">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {bookings.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center text-gray-500 py-6">
                    Chưa có lịch đặt nào
                  </td>
                </tr>
              ) : (
                bookings.map((b, i) => (
                  <tr key={b._id || i} className="hover:bg-gray-50">
                    {/* Mã đặt */}
                    <td className="border px-3 py-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs">{b._id}</span>
                        <button
                          onClick={() => copyCode(b._id, i)}
                          className="px-2 py-1 rounded border hover:bg-gray-50 text-xs flex items-center gap-1"
                        >
                          {copiedIdx === i ? (
                            <FaCheck className="text-green-600" />
                          ) : (
                            <FaRegCopy />
                          )}
                          {copiedIdx === i ? "Đã copy" : "Copy"}
                        </button>
                      </div>
                    </td>

                    {/* Ngày & giờ */}
                    <td className="border px-3 py-2">
                      {new Date(b.bookingDate).toLocaleDateString("vi-VN")}
                    </td>
                    <td className="border px-3 py-2">
                      {b.startTime} - {b.endTime}
                    </td>

                    {/* Sân */}
                    <td className="border px-3 py-2">{b.fieldName || "-"}</td>

                    {/* Người đặt */}
                    <td className="border px-3 py-2">{b.customerName || "-"}</td>
                    <td className="border px-3 py-2">{b.customerPhone || "-"}</td>

                    {/* Trạng thái */}
                    <td className="border px-3 py-2">{renderStatus(b.status)}</td>

                    {/* Hành động */}
                    <td className="border px-3 py-2 text-center">
                      {b.status === "pending" ? (
                        <div className="flex gap-2 justify-center">
                          <button
                            onClick={() => handleApprove(b._id, "confirmed")}
                            className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 text-xs"
                          >
                            Duyệt
                          </button>
                          <button
                            onClick={() => handleApprove(b._id, "cancelled_admin")}
                            className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 text-xs"
                          >
                            Từ chối
                          </button>
                        </div>
                      ) : (
                        "-"
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
