"use client";
import React, { useEffect, useMemo, useState } from "react";
import { getBookings, createBooking } from "@/services/bookingService";
import { getFields } from "@/services/fieldService";
import { toast } from "react-toastify";
import { useAuth } from "@/hooks/useAuth";
import AuthRequiredModal from "@/components/site/AuthRequiredModal";

export default function BookingSchedulePage() {
  const { user, isReady } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);

  const [fields, setFields] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [popupOpen, setPopupOpen] = useState(false);
  const [form, setForm] = useState({});

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
      d.push({ iso, label });
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

  // 🔹 Kiểm tra đã đặt chưa
  function isBooked(dayIso, field, slotStart) {
    return bookings.find(
      (b) =>
        b.bookingDate?.slice(0, 10) === dayIso &&
        String(b.fieldId) === String(field._id) &&
        b.startTime === slotStart
    );
  }

  // 🔹 Kiểm tra quá giờ
  function isPastDeadline(dayIso, slotStart) {
    const now = new Date();
    const slotTime = new Date(`${dayIso}T${slotStart}:00`);
    return (slotTime - now) / 60000 < 30; // nếu còn <30 phút thì không đặt được
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
    } catch (err) {
      toast.error(err?.response?.data?.message || "Không thể đặt sân!");
    }
  }

  return (
    <div className="bg-gradient-to-br from-green-200 to-blue-200 min-h-screen py-10 px-4">
      <div className="max-w-6xl mx-auto bg-white/90 p-8 rounded-2xl shadow-lg">
        <h1 className="text-3xl font-extrabold text-center text-green-700 mb-8">
          📅 Lịch Đặt Sân Bóng
        </h1>

        {loading ? (
          <p className="text-center text-gray-500 py-10">Đang tải...</p>
        ) : (
          days.map((day, dayIdx) => (
            <section key={day.iso} className="mb-10">
              <h2 className="text-xl font-bold text-blue-700 mb-4 border-b pb-2">
                {day.label} — <span className="text-gray-500">{day.iso}</span>
              </h2>
              <div className="overflow-x-auto">
                <table className="table-auto w-full border-collapse border border-gray-300 text-sm">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="border px-2 py-2">Sân</th>
                      {timeSlots.map((slot, i) => (
                        <th key={i} className="border px-2 py-2 whitespace-nowrap">
                          {slot.label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {fields.map((field) => (
                      <tr key={field._id}>
                        <td className="border px-2 py-2 font-semibold text-center bg-slate-50">
                          {field.name}
                        </td>
                        {timeSlots.map((slot, slotIdx) => {
                          const booking = isBooked(day.iso, field, slot.start);
                          const tooLate = isPastDeadline(day.iso, slot.start);
                          const color = booking
                            ? booking.status === "pending"
                              ? "bg-yellow-400 text-black"
                              : "bg-green-600 text-white"
                            : tooLate
                            ? "bg-gray-400 text-white"
                            : "bg-green-100 hover:bg-green-200 cursor-pointer";
                          return (
                            <td
                              key={slotIdx}
                              onClick={() =>
                                !booking && !tooLate && openPopup(dayIdx, field, slotIdx)
                              }
                              className={`border px-2 py-2 text-center transition-colors ${color}`}
                            >
                              {booking
                                ? booking.status === "pending"
                                  ? "⏳ Chờ duyệt"
                                  : "✅ Đã đặt"
                                : tooLate
                                ? "🚫 Quá giờ"
                                : "Trống"}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          ))
        )}
      </div>

      {/* Popup đặt sân */}
      {popupOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-[9999]">
          <div className="bg-white rounded-xl p-6 w-[90%] max-w-md shadow-xl animate-fadeIn">
            <h3 className="text-lg font-bold text-center text-green-700 mb-4">
              Xác nhận đặt sân
            </h3>
            <p className="text-sm text-gray-700 mb-2">
              📍 <b>{form.fieldName}</b>
            </p>
            <p className="text-sm text-gray-600 mb-2">
              ⏰ {form.start} - {form.end}
            </p>
            <p className="text-sm text-gray-600 mb-4">📅 {form.date}</p>
            <textarea
              value={form.note || ""}
              onChange={(e) => setForm((f) => ({ ...f, note: e.target.value }))}
              placeholder="Ghi chú (tùy chọn)"
              rows={3}
              className="w-full border rounded-xl p-2 mb-4"
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setPopupOpen(false)}
                className="px-4 py-2 border rounded-xl hover:bg-gray-100"
              >
                Đóng
              </button>
              <button
                onClick={handleConfirm}
                className="px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700"
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal đăng nhập */}
      <AuthRequiredModal
        show={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />
    </div>
  );
}
