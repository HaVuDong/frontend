"use client";
import React, { useEffect, useMemo, useState } from "react";
import { getBookings, createBooking } from "@/services/bookingService";
import { getFields } from "@/services/fieldService";
import { toast } from "react-toastify";
import { useAuth } from "@/hooks/useAuth";
import AuthRequiredModal from "@/components/site/AuthRequiredModal";
import Footer from "@/components/site/layout/Footer";

export default function BookingSchedulePage() {
  const { user, isReady } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);

  const [fields, setFields] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [popupOpen, setPopupOpen] = useState(false);
  const [form, setForm] = useState({});
  const [selectedDay, setSelectedDay] = useState(0);

  // 🔹 7 ngày kế tiếp
  const days = useMemo(() => {
    const d = [];
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      const iso = date.toISOString().slice(0, 10);
      const label = date.toLocaleDateString("vi-VN", {
        weekday: "long",
        day: "2-digit",
        month: "2-digit",
      });
      const shortLabel = date.toLocaleDateString("vi-VN", {
        weekday: "short",
        day: "2-digit",
        month: "2-digit",
      });
      d.push({ iso, label, shortLabel });
    }
    return d;
  }, []);

  // 🔹 Khung giờ từ 6h - 23h
  const timeSlots = useMemo(() => {
    const s = [];
    for (let h = 6; h < 23; h++) {
      const start = `${String(h).padStart(2, "0")}:00`;
      const end = `${String(h + 1).padStart(2, "0")}:00`;
      s.push({ start, end, label: `${start} - ${end}` });
    }
    return s;
  }, []);

  // 🔹 Lấy dữ liệu ban đầu
  useEffect(() => {
    (async () => {
      try {
        const [f, b] = await Promise.all([getFields(), getBookings()]);
        setFields(f?.data || f || []);
        setBookings(b?.data || b || []);
      } catch {
        toast.error("Không thể tải dữ liệu!");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // 🔹 Kiểm tra đã đặt chưa (fix logic cancelled_admin)
  function isBooked(dayIso, field, slotStart) {
    return bookings.find((b) => {
      const isSameDate = b.bookingDate?.slice(0, 10) === dayIso;
      const isSameField = String(b.fieldId) === String(field._id);
      const isSameSlot = b.startTime === slotStart;

      // ⚙️ Nếu bị admin hủy, chỉ ẩn với user khác (cho phép người khác đặt lại)
      if (
        b.status === "cancelled_admin" &&
        String(b.userId) !== String(user?._id || user?.id)
      ) {
        return false;
      }

      return isSameDate && isSameField && isSameSlot;
    });
  }

  // 🔹 Kiểm tra quá giờ
  function isPastDeadline(dayIso, slotStart) {
    const now = new Date();
    const slotTime = new Date(`${dayIso}T${slotStart}:00`);
    return (slotTime - now) / 60000 < 30;
  }

  // 🔹 Mở popup đặt sân
  function openPopup(dayIdx, field, slotIdx) {
    if (!isReady) return;
    if (!user || !(user._id || user.id)) {
      setShowLoginModal(true);
      return;
    }

    const slot = timeSlots[slotIdx];
    const dateIso = days[dayIdx].iso;

    setForm({
      date: dateIso,
      start: slot.start,
      end: slot.end,
      fieldName: field.name,
      fieldId: field._id,
      name: user.username || user.fullName || "",
      phone: user.phone || "",
      email: user.email || "",
      note: "",
    });
    setPopupOpen(true);
  }

  // 🔹 Gửi API đặt sân
  async function handleConfirm() {
    try {
      const payload = {
        fieldId: form.fieldId,
        userId: user._id || user.id,
        userName: form.name,
        userPhone: form.phone,
        userEmail: form.email,
        bookingDate: form.date,
        startTime: form.start,
        endTime: form.end,
        notes: form.note,
      };
      await createBooking(payload);
      toast.success("✅ Đặt sân thành công!");
      setPopupOpen(false);
      // Reload data
      const b = await getBookings();
      setBookings(b?.data || b || []);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Không thể đặt sân!");
    }
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-3 bg-white px-6 py-3 rounded-2xl shadow-lg mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-teal-500 rounded-xl flex items-center justify-center shadow-lg animate-pulse">
                <span className="text-2xl">⚽</span>
              </div>
              <div className="text-left">
                <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-teal-600">
                  Lịch Đặt Sân Bóng
                </h1>
                <p className="text-sm text-gray-600 font-semibold">
                  Chọn sân và thời gian phù hợp với bạn
                </p>
              </div>
            </div>
          </div>

          {/* Day Selector - Tabs */}
          <div className="bg-white rounded-2xl shadow-xl p-4 mb-6">
            <div className="grid grid-cols-7 gap-2 md:gap-3">
              {days.map((day, idx) => (
                <button
                  key={day.iso}
                  onClick={() => setSelectedDay(idx)}
                  className={`group relative px-2 py-4 rounded-xl font-bold text-sm transition-all duration-300 ${
                    selectedDay === idx
                      ? "bg-gradient-to-r from-green-500 to-teal-500 text-white shadow-lg scale-105"
                      : "bg-gray-50 text-gray-700 hover:bg-gray-100 hover:scale-105"
                  }`}
                >
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-xs opacity-90">
                      {day.shortLabel.split(",")[0]}
                    </span>
                    <span className="text-lg md:text-xl font-black">
                      {day.iso.slice(8, 10)}
                    </span>
                    <span className="text-xs opacity-90">
                      Tháng {day.iso.slice(5, 7)}
                    </span>
                  </div>
                  {selectedDay === idx && (
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1/2 h-1 bg-yellow-400 rounded-full"></div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Legend */}
          <div className="bg-white rounded-2xl shadow-lg p-4 mb-6">
            <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
              <span className="text-xl">📋</span>
              Chú thích trạng thái
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {[
                { label: "Trống", color: "bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 border-2 border-green-300" },
                { label: "⏳ Chờ duyệt", color: "bg-gradient-to-r from-yellow-400 to-amber-400 text-white" },
                { label: "✅ Đã đặt", color: "bg-gradient-to-r from-green-600 to-emerald-600 text-white" },
                { label: "🏁 Hoàn thành", color: "bg-gradient-to-r from-blue-500 to-indigo-500 text-white" },
                { label: "🚫 Quá giờ", color: "bg-gradient-to-r from-gray-400 to-gray-500 text-white" },
              ].map((item, i) => (
                <div
                  key={i}
                  className={`${item.color} px-3 py-2 rounded-lg text-xs font-bold text-center shadow-md`}
                >
                  {item.label}
                </div>
              ))}
            </div>
          </div>

          {/* Schedule Table */}
          {loading ? (
            <div className="bg-white rounded-2xl shadow-xl p-12">
              <div className="flex flex-col items-center gap-4">
                <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-gray-600 font-semibold">Đang tải lịch đặt sân...</p>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              {/* Day Header */}
              <div className="bg-gradient-to-r from-green-500 to-teal-500 px-6 py-4">
                <h2 className="text-xl font-black text-white flex items-center gap-3">
                  <span className="text-2xl">📅</span>
                  {days[selectedDay].label}
                  <span className="ml-auto text-sm font-semibold bg-white/20 px-3 py-1 rounded-full">
                    {days[selectedDay].iso}
                  </span>
                </h2>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gradient-to-r from-gray-50 to-gray-100">
                      <th className="sticky left-0 z-20 bg-gradient-to-r from-gray-100 to-gray-200 border-b-2 border-gray-300 px-4 py-4 text-left font-black text-gray-800">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">🏟️</span>
                          Sân bóng
                        </div>
                      </th>
                      {timeSlots.map((slot, i) => (
                        <th
                          key={i}
                          className="border-b-2 border-gray-300 px-3 py-4 text-center font-bold text-gray-700 whitespace-nowrap text-sm"
                        >
                          <div className="flex flex-col items-center gap-1">
                            <span className="text-xs text-gray-500">Khung giờ</span>
                            <span className="text-sm font-black">{slot.label}</span>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {fields.map((field, fieldIdx) => (
                      <tr
                        key={field._id}
                        className={`${
                          fieldIdx % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                        } hover:bg-blue-50/30 transition-colors duration-200`}
                      >
                        <td className="sticky left-0 z-10 bg-gradient-to-r from-green-50 to-teal-50 border-b border-gray-200 px-4 py-3 font-black text-gray-800">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-teal-500 rounded-lg flex items-center justify-center text-white font-black shadow-md">
                              {fieldIdx + 1}
                            </div>
                            <span className="text-sm">{field.name}</span>
                          </div>
                        </td>
                        {timeSlots.map((slot, slotIdx) => {
                          const booking = isBooked(days[selectedDay].iso, field, slot.start);
                          const tooLate = isPastDeadline(days[selectedDay].iso, slot.start);
                          const slotEndTime = new Date(`${days[selectedDay].iso}T${slot.end}:00`);
                          const now = new Date();

                          const isCompleted =
                            booking && slotEndTime < now && booking.status === "confirmed";

                          // 🔹 Hiển thị text theo trạng thái backend
                          const label = booking
                            ? booking.status === "pending"
                              ? "⏳"
                              : booking.status === "confirmed"
                              ? isCompleted
                                ? "🏁"
                                : "✅"
                              : booking.status === "cancelled_refunded"
                              ? "💸"
                              : booking.status === "cancelled_no_refund"
                                ? "🚫"
                                : booking.status === "cancelled_admin"
                                  ? "❌"
                                  : booking.status === "completed"
                                    ? "🏁"
                                    : "❔"
                            : tooLate
                            ? "🚫"
                            : "✨";

                          const tooltip = booking
                            ? booking.status === "pending"
                              ? "Chờ duyệt"
                              : booking.status === "confirmed"
                              ? isCompleted
                                ? "Hoàn thành"
                                : "Đã đặt"
                              : booking.status === "cancelled_refunded"
                              ? "Đã hủy (Hoàn tiền)"
                              : booking.status === "cancelled_no_refund"
                                ? "Đã hủy (Không hoàn tiền)"
                                : booking.status === "cancelled_admin"
                                  ? "Hủy bởi admin"
                                  : booking.status === "completed"
                                    ? "Hoàn thành"
                                    : "Không rõ"
                            : tooLate
                            ? "Quá giờ"
                            : "Trống - Click để đặt";

                          // 🔹 Màu sắc tương ứng
                          const color = booking
                            ? booking.status === "pending"
                              ? "bg-gradient-to-br from-yellow-400 to-amber-400 text-white shadow-md"
                              : booking.status === "confirmed"
                              ? isCompleted
                                ? "bg-gradient-to-br from-blue-500 to-indigo-500 text-white shadow-md"
                                : "bg-gradient-to-br from-green-600 to-emerald-600 text-white shadow-md"
                              : booking.status === "cancelled_refunded"
                              ? "bg-gradient-to-br from-teal-500 to-cyan-500 text-white shadow-md"
                              : booking.status === "cancelled_no_refund"
                                ? "bg-gradient-to-br from-gray-600 to-gray-700 text-white shadow-md"
                                : booking.status === "cancelled_admin"
                                  ? "bg-gradient-to-br from-red-600 to-pink-600 text-white shadow-md"
                                  : booking.status === "completed"
                                    ? "bg-gradient-to-br from-blue-500 to-indigo-500 text-white shadow-md"
                                    : "bg-gradient-to-br from-slate-300 to-slate-400 text-black shadow-md"
                            : tooLate
                            ? "bg-gradient-to-br from-gray-400 to-gray-500 text-white shadow-md"
                            : "bg-gradient-to-br from-green-100 to-emerald-100 text-green-700 hover:from-green-200 hover:to-emerald-200 cursor-pointer shadow-sm hover:shadow-lg border-2 border-green-300 hover:border-green-400";

                          return (
                            <td
                              key={slotIdx}
                              onClick={() =>
                                !booking && !tooLate && openPopup(selectedDay, field, slotIdx)
                              }
                              title={tooltip}
                              className={`border-b border-gray-200 px-3 py-4 text-center transition-all duration-300 ${color} ${
                                !booking && !tooLate ? "hover:scale-105" : ""
                              }`}
                            >
                              <div className="flex flex-col items-center gap-1">
                                <span className="text-2xl">{label}</span>
                                <span className="text-[10px] font-bold opacity-90">
                                  {booking
                                    ? booking.status === "pending"
                                      ? "Chờ"
                                      : booking.status === "confirmed"
                                      ? isCompleted
                                        ? "Xong"
                                        : "Đặt"
                                      : "Hủy"
                                    : tooLate
                                    ? "Quá giờ"
                                    : "Trống"}
                                </span>
                              </div>
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Popup đặt sân */}
        {popupOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-[9999] p-4 animate-fadeIn">
            <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl transform transition-all duration-300 scale-100 hover:scale-[1.02]">
              {/* Header */}
              <div className="bg-gradient-to-r from-green-500 to-teal-500 px-6 py-5 rounded-t-3xl">
                <h3 className="text-2xl font-black text-white text-center flex items-center justify-center gap-3">
                  <span className="text-3xl">⚽</span>
                  Xác nhận đặt sân
                </h3>
              </div>

              {/* Content */}
              <div className="p-6 space-y-4">
                {/* Field Info */}
                <div className="bg-gradient-to-r from-green-50 to-teal-50 rounded-2xl p-4 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-teal-500 rounded-xl flex items-center justify-center shadow-lg">
                      <span className="text-2xl">🏟️</span>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 font-semibold">Sân bóng</p>
                      <p className="text-lg font-black text-gray-900">{form.fieldName}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white rounded-xl p-3 shadow-sm">
                      <p className="text-xs text-gray-600 font-semibold mb-1">⏰ Thời gian</p>
                      <p className="text-sm font-black text-gray-900">
                        {form.start} - {form.end}
                      </p>
                    </div>
                    <div className="bg-white rounded-xl p-3 shadow-sm">
                      <p className="text-xs text-gray-600 font-semibold mb-1">📅 Ngày đặt</p>
                      <p className="text-sm font-black text-gray-900">{form.date}</p>
                    </div>
                  </div>
                </div>

                {/* Note Input */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    📝 Ghi chú (tùy chọn)
                  </label>
                  <textarea
                    value={form.note || ""}
                    onChange={(e) => setForm((f) => ({ ...f, note: e.target.value }))}
                    placeholder="Nhập ghi chú của bạn..."
                    rows={3}
                    className="w-full border-2 border-gray-200 rounded-xl p-3 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-300 resize-none"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => setPopupOpen(false)}
                    className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-bold hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 hover:scale-105"
                  >
                    ❌ Hủy
                  </button>
                  <button
                    onClick={handleConfirm}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-xl font-bold shadow-lg hover:shadow-xl hover:from-green-600 hover:to-teal-600 transition-all duration-300 hover:scale-105"
                  >
                    ✅ Xác nhận
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal đăng nhập */}
        <AuthRequiredModal
          show={showLoginModal}
          onClose={() => setShowLoginModal(false)}
        />

        {/* Add CSS Animation */}
        <style jsx>{`
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: scale(0.95);
            }
            to {
              opacity: 1;
              transform: scale(1);
            }
          }
          .animate-fadeIn {
            animation: fadeIn 0.3s ease-out;
          }
        `}</style>
      </div>

      <Footer />
    </>
  );
}
