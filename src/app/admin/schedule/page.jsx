"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { FaCalendarAlt, FaArrowLeft, FaRegCopy, FaCheck } from "react-icons/fa";

export default function AdminScheduleListPage() {
  const [bookings, setBookings] = useState([]);
  const [copiedIdx, setCopiedIdx] = useState(null);

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/bookings");
      const data = res.ok ? await res.json() : [];
      setBookings(data);
    })();
  }, []);

  async function copyCode(code, idx) {
    await navigator.clipboard.writeText(code);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 1200);
  }

  return (
    <div className="bg-gradient-to-br from-green-200 to-blue-200 min-h-screen py-10 px-4">
      <div className="max-w-5xl mx-auto bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <FaCalendarAlt className="text-2xl text-green-700" />
            <h1 className="text-2xl font-extrabold text-green-700">
              Danh sách lịch đã đặt
            </h1>
          </div>
          <Link
            href="/admin/courts"
            className="inline-flex items-center gap-2 border px-4 py-2 rounded-xl hover:bg-gray-50"
          >
            <FaArrowLeft /> Quay lại danh sách sân
          </Link>
        </div>

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
                <th className="border px-3 py-2">Yêu cầu</th>
              </tr>
            </thead>
            <tbody>
              {bookings.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center text-gray-500 py-6">
                    Chưa có lịch đặt nào
                  </td>
                </tr>
              ) : (
                bookings.map((b, i) => (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="border px-3 py-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono">{b.booking_code}</span>
                        <button
                          onClick={() => copyCode(b.booking_code, i)}
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
                    <td className="border px-3 py-2">{b.date}</td>
                    <td className="border px-3 py-2">
                      {b.start} - {b.end}
                    </td>
                    <td className="border px-3 py-2">{b.courtName}</td>
                    <td className="border px-3 py-2">{b.customer_name}</td>
                    <td className="border px-3 py-2">{b.customer_phone}</td>
                    <td className="border px-3 py-2">{b.note || "-"}</td>
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
