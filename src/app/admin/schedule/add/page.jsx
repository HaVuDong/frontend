"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  FaCalendarPlus,
  FaSave,
  FaArrowLeft,
  FaExclamationTriangle,
  FaSyncAlt,
  FaRegCopy,
  FaCheck,
} from "react-icons/fa";

/* ===== Helpers ===== */
function toTimeOptions({ from = 6, to = 23, stepMin = 60 } = {}) {
  const out = [];
  for (let h = from; h <= to; h++) {
    for (let m = 0; m < 60; m += stepMin) {
      out.push(`${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`);
    }
  }
  return out;
}
function todayISO() {
  const d = new Date();
  return d.toISOString().slice(0, 10);
}
function slugCourt(courtName = "", courtId = "") {
  if (courtName) {
    const m = courtName.match(/\d+/g);
    if (m) return "S" + m.join("-");
    return courtName.replace(/\s+/g, "").slice(0, 6).toUpperCase();
  }
  return courtId ? `C${courtId}` : "SAN";
}
function hhmm(timeStr) {
  return timeStr ? timeStr.replace(":", "") : "0000";
}
function randBase36(n = 4) {
  return [...crypto.getRandomValues(new Uint8Array(n))]
    .map((x) => (x % 36).toString(36))
    .join("")
    .toUpperCase();
}
function makeBookingCode({ courtName, courtId, date, start }) {
  return `${slugCourt(courtName, courtId)}-${date}-${hhmm(start)}-${randBase36(
    4
  )}`;
}

export default function BookingAddEditPage() {
  const router = useRouter();
  const params = useSearchParams();
  const bookingId = params.get("id");

  const [courts, setCourts] = useState([]);
  const [form, setForm] = useState({
    courtId: "",
    courtName: "",
    date: todayISO(),
    start: "18:00",
    end: "19:00",
    customer_name: "",
    customer_phone: "",
    price: "",
    status: "booked",
    note: "",
    booking_code: "",
  });
  const [errors, setErrors] = useState({});
  const [conflict, setConflict] = useState(null);
  const [copied, setCopied] = useState(false);

  const timeOptions = useMemo(
    () => toTimeOptions({ from: 6, to: 23, stepMin: 60 }),
    []
  );

  // load courts từ API (giả lập)
  useEffect(() => {
    (async () => {
      const res = await fetch("/api/courts");
      const data = res.ok ? await res.json() : [];
      setCourts(data);
    })();
  }, []);

  // generate mã mặc định
  useEffect(() => {
    if (!form.booking_code) {
      setForm((f) => ({
        ...f,
        booking_code: makeBookingCode({
          courtName: f.courtName,
          courtId: f.courtId,
          date: f.date,
          start: f.start,
        }),
      }));
    }
  }, [form.booking_code]);

  function setField(k, v) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  function regenerateCode() {
    setForm((f) => ({
      ...f,
      booking_code: makeBookingCode({
        courtName: f.courtName,
        courtId: f.courtId,
        date: f.date,
        start: f.start,
      }),
    }));
    setCopied(false);
  }
  async function copyCode() {
    await navigator.clipboard.writeText(form.booking_code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  }

  function validate() {
    const e = {};
    if (!form.date) e.date = "Chọn ngày";
    if (!form.start) e.start = "Chọn giờ bắt đầu";
    if (!form.end) e.end = "Chọn giờ kết thúc";
    if (!form.booking_code) e.booking_code = "Thiếu mã";
    return e;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const eobj = validate();
    setErrors(eobj);
    if (Object.keys(eobj).length) return;

    const payload = { ...form };
    const url = bookingId ? `/api/bookings/${bookingId}` : "/api/bookings";
    const method = bookingId ? "PATCH" : "POST";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) return alert("Lưu thất bại");
    router.push("/admin/schedule");
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <FaCalendarPlus className="text-green-600 text-2xl" />
          <h1 className="text-xl font-bold">Thêm lịch đặt sân</h1>
        </div>
        <Link
          href="/admin/schedule"
          className="px-3 py-2 border rounded-lg flex gap-2 items-center"
        >
          <FaArrowLeft /> Quay lại
        </Link>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-4 rounded-xl shadow grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        {/* Sân */}
        <div>
          <label className="block text-sm">Chọn sân</label>
          <select
            value={form.courtId}
            onChange={(e) => setField("courtId", e.target.value)}
            className="w-full border rounded p-2"
          >
            <option value="">-- chọn --</option>
            {courts.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          <input
            className="w-full border rounded p-2 mt-1"
            placeholder="Tên sân tự nhập"
            value={form.courtName}
            onChange={(e) => setField("courtName", e.target.value)}
          />
        </div>

        {/* Ngày */}
        <div>
          <label className="block text-sm">Ngày</label>
          <input
            type="date"
            value={form.date}
            onChange={(e) => setField("date", e.target.value)}
            className="w-full border rounded p-2"
          />
        </div>

        {/* Giờ */}
        <div>
          <label className="block text-sm">Bắt đầu</label>
          <select
            value={form.start}
            onChange={(e) => setField("start", e.target.value)}
            className="w-full border rounded p-2"
          >
            {timeOptions.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm">Kết thúc</label>
          <select
            value={form.end}
            onChange={(e) => setField("end", e.target.value)}
            className="w-full border rounded p-2"
          >
            {timeOptions.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </div>

        {/* Người đặt */}
        <div>
          <label className="block text-sm">Tên KH</label>
          <input
            className="w-full border rounded p-2"
            value={form.customer_name}
            onChange={(e) => setField("customer_name", e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm">SĐT</label>
          <input
            className="w-full border rounded p-2"
            value={form.customer_phone}
            onChange={(e) => setField("customer_phone", e.target.value)}
          />
        </div>

        {/* Mã */}
        <div className="md:col-span-2">
          <label className="block text-sm">Mã đặt sân</label>
          <div className="flex gap-2">
            <input
              readOnly
              className="flex-1 border rounded p-2 bg-gray-100"
              value={form.booking_code}
            />
            <button
              type="button"
              onClick={regenerateCode}
              className="border rounded px-3 py-2"
            >
              <FaSyncAlt />
            </button>
            <button
              type="button"
              onClick={copyCode}
              className="border rounded px-3 py-2 flex items-center gap-1"
            >
              {copied ? <FaCheck className="text-green-600" /> : <FaRegCopy />}
              {copied ? "Đã copy" : "Copy"}
            </button>
          </div>
        </div>

        {/* Ghi chú */}
        <div className="md:col-span-2">
          <label className="block text-sm">Ghi chú</label>
          <textarea
            className="w-full border rounded p-2"
            value={form.note}
            onChange={(e) => setField("note", e.target.value)}
          />
        </div>

        <div className="md:col-span-2 flex justify-end gap-2">
          <Link
            href="/admin/schedule"
            className="px-4 py-2 border rounded-lg"
          >
            Hủy
          </Link>
          <button
            type="submit"
            className="px-4 py-2 bg-green-600 text-white rounded-lg flex gap-2 items-center"
          >
            <FaSave /> Lưu
          </button>
        </div>
      </form>
    </div>
  );
}
