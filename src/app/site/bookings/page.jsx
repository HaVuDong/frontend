"use client";
import React, { useEffect, useMemo, useState } from "react";
import { getBookings, createBooking, cancelBooking } from "@/services/bookingService";
import { getFields } from "@/services/fieldService";
import { toast } from "react-toastify";

function getNext7Days() {
  const days = [];
  const today = new Date();
  for (let i = 0; i < 7; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    const iso = d.toISOString().slice(0, 10);
    const label = d.toLocaleDateString("vi-VN", {
      weekday: "long",
      day: "2-digit",
      month: "2-digit",
    });
    days.push({ iso, label });
  }
  return days;
}

function generateTimeSlots() {
  const slots = [];
  for (let h = 6; h < 23; h++) {
    const start = `${String(h).padStart(2, "0")}:00`;
    const end = `${String(h + 1).padStart(2, "0")}:00`;
    slots.push({ start, end, label: `${start} - ${end}` });
  }
  return slots;
}

export default function BookingSchedulePage() {
  const days = useMemo(getNext7Days, []);
  const timeSlots = useMemo(generateTimeSlots, []);
  const [fields, setFields] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  const [open, setOpen] = useState(false);
  const [context, setContext] = useState(null);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    start: "",
    end: "",
    note: "",
    date: "",
    field: "",
  });
  const [errors, setErrors] = useState({});

  // 🧩 Load dữ liệu + user
  useEffect(() => {
    async function loadData(currentUser) {
      try {
        const [fieldRes, bookingRes] = await Promise.all([getFields(), getBookings()]);
        const allBookings = bookingRes.data?.data || bookingRes.data || [];

        // 🔥 Lọc: chỉ giữ booking hợp lệ hoặc bị admin hủy của chính user
        const filtered = allBookings.filter((b) => {
          if (b.status === "cancelled_admin") {
            if (!currentUser) return false;
            return b.customerId === currentUser._id;
          }
          return true;
        });

        setFields(fieldRes.data?.data || fieldRes.data || []);
        setBookings(filtered);
      } catch (err) {
        console.error(err);
        toast.error("Không thể tải dữ liệu!");
      } finally {
        setLoading(false);
      }
    }

    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        setUser(parsed);
        loadData(parsed);
      } catch {
        console.warn("User info parse lỗi");
        loadData(null);
      }
    } else {
      loadData(null);
    }
  }, []);

  // 🟢 Reload sau khi hủy hoặc đặt
  async function reloadBookings() {
    const res = await getBookings();
    const allBookings = res.data?.data || res.data || [];
    const filtered = allBookings.filter((b) => {
      if (b.status === "cancelled_admin") {
        if (!user) return false;
        return b.customerId === user._id;
      }
      return true;
    });
    setBookings(filtered);
  }

  // 🟣 Mở modal đặt sân
  function openModal(dayIdx, field, slotIdx) {
    const slot = timeSlots[slotIdx];
    const dateIso = days[dayIdx].iso;

    const existing = bookings.find(
      (b) =>
        b.bookingDate?.slice(0, 10) === dateIso &&
        b.fieldId === field._id &&
        b.startTime === slot.start &&
        b.status !== "cancelled_admin"
    );

    const defaultName = user?.fullName || user?.username || "";
    const defaultPhone = user?.phone || "";
    const defaultEmail = user?.email || "";

    setContext({ dayIdx, field, slotIdx, existing });
    setForm({
      name: existing?.customerName || defaultName,
      phone: existing?.customerPhone || defaultPhone,
      email: existing?.customerEmail || defaultEmail,
      start: existing?.startTime || slot.start,
      end: existing?.endTime || slot.end,
      note: existing?.notes || "",
      date: dateIso,
      field: field._id,
    });
    setErrors({});
    setOpen(true);
  }

  function setFieldValue(k, v) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  function validate() {
    const e = {};
    if (!form.name.trim()) e.name = "Vui lòng nhập tên";
    if (!form.phone.trim()) e.phone = "Vui lòng nhập SĐT";
    else if (!/^(0|\+84)\d{9,10}$/.test(form.phone.replace(/\s+/g, "")))
      e.phone = "SĐT không hợp lệ";
    if (!form.email.trim()) e.email = "Vui lòng nhập email";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = "Email không hợp lệ";
    return e;
  }

  // 🔹 Gửi đặt sân
  async function saveBooking() {
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) return;

    try {
      await createBooking({
        fieldId: form.field,
        customerId: user?._id || null,
        customerName: form.name,
        customerPhone: form.phone,
        customerEmail: form.email,
        bookingDate: form.date,
        startTime: form.start,
        endTime: form.end,
        notes: form.note,
        depositAmount: 0, // ✅ giữ lại, không gửi isDeposited
      });
      toast.success("✅ Đặt sân thành công!");
      setOpen(false);
      reloadBookings();
    } catch (err) {
      toast.error(err.response?.data?.message || "Không thể đặt sân!");
    }
  }

  // 🔹 Hủy đặt sân (user tự hủy)
  async function clearBooking() {
    const id = context?.existing?._id;
    if (!id) return;
    if (!confirm("Bạn có chắc chắn muốn hủy đặt sân này?")) return;
    try {
      await cancelBooking(id);
      toast.success("🗑️ Đã hủy đặt sân!");
      setOpen(false);
      reloadBookings();
    } catch (err) {
      toast.error("Không thể hủy đặt sân!");
    }
  }

  // 🧠 Kiểm tra slot có bị chiếm không
  function isBooked(dayIso, field, slotStart) {
    const found = bookings.find(
      (b) =>
        b.bookingDate?.slice(0, 10) === dayIso &&
        b.fieldId === field._id &&
        b.startTime === slotStart
    );

    if (!found) return { booking: null, isUserBlocked: false };

    if (found.status === "cancelled_admin") {
      if (user && found.customerId === user._id) {
        return { booking: found, isUserBlocked: true };
      }
      return { booking: null, isUserBlocked: false };
    }

    return { booking: found, isUserBlocked: false };
  }

  return (
    <div className="bg-gradient-to-br from-green-200 to-blue-200 min-h-screen py-10 px-4">
      <div className="max-w-6xl mx-auto bg-white/90 backdrop-blur-md p-8 rounded-2xl shadow-lg">
        <h1 className="text-3xl font-extrabold text-center text-green-700 mb-8">
          📅 Lịch Đặt Sân Bóng
        </h1>

        {loading ? (
          <p className="text-center text-gray-500 py-10">Đang tải...</p>
        ) : (
          days.map((day, dayIdx) => (
            <div key={day.iso} className="mb-10">
              <h2 className="text-xl font-bold text-blue-700 mb-4 border-b pb-2">
                {day.label} — <span className="text-gray-500">{day.iso}</span>
              </h2>

              <div className="overflow-x-auto">
                <table className="table-auto w-full border-collapse border border-gray-300 text-sm">
                  <thead>
                    <tr className="bg-gray-100">
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
                        <td className="border px-2 py-2 font-semibold">{field.name}</td>
                        {timeSlots.map((slot, slotIdx) => {
                          const { booking, isUserBlocked } = isBooked(day.iso, field, slot.start);

                          const color =
                            booking?.status === "confirmed"
                              ? "bg-green-600 text-white"
                              : booking?.status === "pending"
                              ? "bg-yellow-400 text-black"
                              : isUserBlocked
                              ? "bg-red-500 text-white opacity-80"
                              : "bg-green-100 hover:bg-green-200";

                          return (
                            <td
                              key={slotIdx}
                              onClick={() => {
                                if (booking?.status === "confirmed" || booking?.status === "pending" || isUserBlocked)
                                  return;
                                openModal(dayIdx, field, slotIdx);
                              }}
                              className={`border px-2 py-2 text-center cursor-pointer select-none transition-colors duration-200 ${color}`}
                              title={booking ? `Người đặt: ${booking.customerName}` : ""}
                            >
                              {booking ? (
                                booking.status === "pending" ? (
                                  "⏳ Chờ duyệt"
                                ) : booking.status === "confirmed" ? (
                                  "✅ Đã đặt"
                                ) : isUserBlocked ? (
                                  "❌ Bị từ chối"
                                ) : (
                                  "Trống"
                                )
                              ) : (
                                "Trống"
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))
        )}
      </div>

      {/* 🪟 Modal */}
      {open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-xl rounded-2xl shadow-xl p-5">
            <h3 className="text-lg font-bold mb-4">Thông tin đặt sân</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium mb-1">Tên *</label>
                <input
                  value={form.name}
                  onChange={(e) => setFieldValue("name", e.target.value)}
                  disabled={!!user}
                  className={`w-full px-3 py-2 border rounded-xl ${
                    errors.name ? "border-red-500" : "border-gray-300"
                  }`}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">SĐT *</label>
                <input
                  value={form.phone}
                  onChange={(e) => setFieldValue("phone", e.target.value)}
                  disabled={!!user}
                  className={`w-full px-3 py-2 border rounded-xl ${
                    errors.phone ? "border-red-500" : "border-gray-300"
                  }`}
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Email *</label>
                <input
                  value={form.email}
                  onChange={(e) => setFieldValue("email", e.target.value)}
                  disabled={!!user}
                  className={`w-full px-3 py-2 border rounded-xl ${
                    errors.email ? "border-red-500" : "border-gray-300"
                  }`}
                />
              </div>
            </div>

            <div className="mt-4 flex justify-end gap-3">
              {context?.existing && (
                <button
                  onClick={clearBooking}
                  className="px-4 py-2 rounded-xl bg-red-600 text-white hover:bg-red-700"
                >
                  Hủy
                </button>
              )}
              <button onClick={() => setOpen(false)} className="px-4 py-2 border rounded-xl">
                Đóng
              </button>
              {!context?.existing && (
                <button
                  onClick={saveBooking}
                  className="px-4 py-2 bg-green-600 text-white rounded-xl"
                >
                  Đặt
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
