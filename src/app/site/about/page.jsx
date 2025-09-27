"use client";
import React, { useEffect, useMemo, useState } from "react";

/* ===== Helpers ===== */
function getNext7Days() {
  const days = [];
  const today = new Date();
  for (let i = 0; i < 7; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    const iso = d.toISOString().slice(0, 10); // YYYY-MM-DD
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
  const fields = useMemo(
    () => [
      "Sân 5-1",
      "Sân 5-2",
      "Sân 5-3",
      "Sân 5-4",
      "Sân 5-5",
      "Sân 5-6",
      "Sân 7-1",
      "Sân 7-2",
    ],
    []
  );
  const timeSlots = useMemo(generateTimeSlots, []);

  // bookings[dayIdx][fieldIdx][slotIdx] = { name, phone, start, end, date, field, note }
  const [bookings, setBookings] = useState({});
  useEffect(() => {
    try {
      const raw = localStorage.getItem("admin-schedule-bookings-grid");
      if (raw) setBookings(JSON.parse(raw));
    } catch { }
  }, []);
  useEffect(() => {
    try {
      localStorage.setItem(
        "admin-schedule-bookings-grid",
        JSON.stringify(bookings)
      );
    } catch { }
  }, [bookings]);

  // Modal state
  const [open, setOpen] = useState(false);
  const [context, setContext] = useState(null); // { dayIdx, fieldIdx, slotIdx }
  const [form, setForm] = useState({
    name: "",
    phone: "",
    start: "",
    end: "",
    note: "",
    date: "",
    field: "",
  });
  const [errors, setErrors] = useState({});

  function toggleBooking(dayIdx, fieldIdx, slotIdx) {
    const slot = timeSlots[slotIdx];
    const fieldName = fields[fieldIdx];
    const dateIso = days[dayIdx].iso;

    const existing =
      bookings?.[dayIdx]?.[fieldIdx]?.[slotIdx] || null;

    // mở modal: nếu đã đặt → hiện dữ liệu; nếu trống → prefill
    setContext({ dayIdx, fieldIdx, slotIdx });
    setForm({
      name: existing?.name || "",
      phone: existing?.phone || "",
      start: existing?.start || slot.start,
      end: existing?.end || slot.end,
      note: existing?.note || "",
      date: existing?.date || dateIso,
      field: existing?.field || fieldName,
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
    if (!form.start) e.start = "Chọn giờ bắt đầu";
    if (!form.end) e.end = "Chọn giờ kết thúc";
    if (form.start && form.end && form.end <= form.start)
      e.end = "Giờ kết thúc phải > giờ bắt đầu";
    return e;
  }

  function saveBooking() {
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) return;

    const { dayIdx, fieldIdx, slotIdx } = context;
    setBookings((prev) => {
      const updated = { ...prev };
      if (!updated[dayIdx]) updated[dayIdx] = {};
      if (!updated[dayIdx][fieldIdx]) updated[dayIdx][fieldIdx] = {};
      updated[dayIdx][fieldIdx][slotIdx] = {
        name: form.name.trim(),
        phone: form.phone.replace(/\s+/g, ""),
        start: form.start,
        end: form.end,
        note: form.note.trim(),
        date: form.date,
        field: form.field,
      };
      return updated;
    });
    setOpen(false);
  }

  function clearBooking() {
    if (!context) return;
    const { dayIdx, fieldIdx, slotIdx } = context;
    setBookings((prev) => {
      const updated = { ...prev };
      if (updated?.[dayIdx]?.[fieldIdx]?.[slotIdx]) {
        delete updated[dayIdx][fieldIdx][slotIdx];
      }
      return updated;
    });
    setOpen(false);
  }

  function isBookedCell(dayIdx, fieldIdx, slotIdx) {
    return !!bookings?.[dayIdx]?.[fieldIdx]?.[slotIdx];
  }

  return (
    <div className="bg-gradient-to-br from-green-200 to-blue-200 min-h-screen py-10 px-4">
      <div className="max-w-6xl mx-auto bg-white/90 backdrop-blur-md p-8 rounded-2xl shadow-lg">
        <h1 className="text-3xl font-extrabold text-center text-green-700 mb-8">
          Lịch Đặt Sân Bóng Đá
        </h1>

        {days.map((day, dayIdx) => (
          <div key={day.iso} className="mb-10">
            <h2 className="text-xl font-bold text-blue-700 mb-4 border-b pb-2">
              {day.label} — <span className="text-gray-500">{day.iso}</span>
            </h2>

            <div className="overflow-x-auto">
              <table className="table-auto w-full border-collapse border border-gray-300 text-sm">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 px-2 py-2">Sân</th>
                    {timeSlots.map((slot, i) => (
                      <th
                        key={i}
                        className="border border-gray-300 px-2 py-2 whitespace-nowrap"
                      >
                        {slot.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {fields.map((f, fieldIdx) => (
                    <tr key={f}>
                      <td className="border border-gray-300 px-2 py-2 font-semibold whitespace-nowrap">
                        {f}
                      </td>
                      {timeSlots.map((slot, slotIdx) => {
                        const data =
                          bookings?.[dayIdx]?.[fieldIdx]?.[slotIdx] || null;
                        const isBooked = !!data;
                        const title = isBooked
                          ? `Đã đặt: ${data.name} (${data.phone})\n${data.start}-${data.end} • ${data.note || ""}`
                          : "Trống: bấm để đặt";
                        return (
                          <td
                            key={slotIdx}
                            onClick={() =>
                              toggleBooking(dayIdx, fieldIdx, slotIdx)
                            }
                            title={title}
                            className={`border border-gray-300 px-2 py-2 text-center cursor-pointer select-none transition-colors duration-200 ${isBooked
                                ? "bg-red-500 text-white font-bold"
                                : "bg-green-100 text-green-700 hover:bg-green-200"
                              }`}
                          >
                            {isBooked ? "Đã đặt" : "Trống"}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-xl rounded-2xl shadow-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">Thông tin đặt sân</h3>
              <button
                onClick={() => setOpen(false)}
                className="px-3 py-1 rounded-lg border hover:bg-gray-50"
              >
                Đóng
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="md:col-span-2 text-sm text-gray-600">
                <div>
                  <b>Ngày:</b> {form.date}
                </div>
                <div>
                  <b>Sân:</b> {form.field}
                </div>
              </div>

              {/* Tên */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Tên người đặt *
                </label>
                <input
                  value={form.name}
                  onChange={(e) => setFieldValue("name", e.target.value)}
                  className={`w-full px-3 py-2 border rounded-xl focus:outline-none focus:ring-2 ${errors.name
                      ? "border-red-500 focus:ring-red-500"
                      : "focus:ring-green-600"
                    }`}
                  placeholder="Nguyễn Văn A"
                />
                {errors.name && (
                  <p className="text-xs text-red-600 mt-1">{errors.name}</p>
                )}
              </div>

              {/* SĐT */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Số điện thoại *
                </label>
                <input
                  value={form.phone}
                  onChange={(e) => setFieldValue("phone", e.target.value)}
                  className={`w-full px-3 py-2 border rounded-xl focus:outline-none focus:ring-2 ${errors.phone
                      ? "border-red-500 focus:ring-red-500"
                      : "focus:ring-green-600"
                    }`}
                  placeholder="09xx xxx xxx"
                />
                {errors.phone && (
                  <p className="text-xs text-red-600 mt-1">{errors.phone}</p>
                )}
              </div>

              {/* Giờ bắt đầu */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Bắt đầu *
                </label>
                <input
                  type="time"
                  value={form.start}
                  onChange={(e) => setFieldValue("start", e.target.value)}
                  className={`w-full px-3 py-2 border rounded-xl focus:outline-none focus:ring-2 ${errors.start
                      ? "border-red-500 focus:ring-red-500"
                      : "focus:ring-green-600"
                    }`}
                  step={60 * 60}
                />
                {errors.start && (
                  <p className="text-xs text-red-600 mt-1">{errors.start}</p>
                )}
              </div>

              {/* Giờ kết thúc */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Kết thúc *
                </label>
                <input
                  type="time"
                  value={form.end}
                  onChange={(e) => setFieldValue("end", e.target.value)}
                  className={`w-full px-3 py-2 border rounded-xl focus:outline-none focus:ring-2 ${errors.end
                      ? "border-red-500 focus:ring-red-500"
                      : "focus:ring-green-600"
                    }`}
                  step={60 * 60}
                />
                {errors.end && (
                  <p className="text-xs text-red-600 mt-1">{errors.end}</p>
                )}
              </div>

              {/* Yêu cầu */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">
                  Yêu cầu đi kèm
                </label>
                <textarea
                  rows={3}
                  value={form.note}
                  onChange={(e) => setFieldValue("note", e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600"
                  placeholder="VD: cần áo bib, mang bóng, đặt cố định..."
                />
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between">
              {/* Nếu slot đã đặt → cho phép xoá */}
              {context &&
                bookings?.[context.dayIdx]?.[context.fieldIdx]?.[
                context.slotIdx
                ] && (
                  <button
                    onClick={clearBooking}
                    className="px-4 py-2 rounded-xl bg-red-600 text-white hover:bg-red-700"
                  >
                    Xóa đặt
                  </button>
                )}

              <div className="ml-auto flex gap-2">
                <button
                  onClick={() => setOpen(false)}
                  className="px-4 py-2 rounded-xl border hover:bg-gray-50"
                >
                  Hủy
                </button>
                <button
                  onClick={saveBooking}
                  className="px-4 py-2 rounded-xl bg-green-600 text-white hover:bg-green-700"
                >
                  Lưu
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
