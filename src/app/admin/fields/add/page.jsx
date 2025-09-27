"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaFutbol, FaSave, FaArrowLeft } from "react-icons/fa";

export default function CourtAddPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    location: "",
    type: "5v5",
    price_per_hour: "",
    image_url: "",
    description: "",
    active: true,
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  function setField(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function validate() {
    const e = {};
    if (!form.name.trim()) e.name = "Vui lòng nhập tên sân";
    if (!form.location.trim()) e.location = "Vui lòng nhập địa điểm";
    if (!form.type) e.type = "Vui lòng chọn loại sân";
    if (form.price_per_hour === "" || Number.isNaN(Number(form.price_per_hour))) {
      e.price_per_hour = "Giá/giờ không hợp lệ";
    } else if (Number(form.price_per_hour) < 0) {
      e.price_per_hour = "Giá/giờ phải ≥ 0";
    }
    return e;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const eobj = validate();
    setErrors(eobj);
    if (Object.keys(eobj).length > 0) return;

    setSubmitting(true);
    try {
      const payload = {
        name: form.name.trim(),
        location: form.location.trim(),
        type: form.type,
        price_per_hour: Number(form.price_per_hour),
        image_url: form.image_url.trim() || null,
        description: form.description.trim() || null,
        active: !!form.active,
      };

      const res = await fetch("/api/courts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg || "Tạo sân thất bại");
      }

      // Thành công → quay lại danh sách
      router.replace("/admin/courts");
    } catch (err) {
      alert(err.message || "Có lỗi xảy ra. Vui lòng thử lại.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <FaFutbol className="text-2xl text-green-600" />
          <h1 className="text-2xl font-bold">Thêm sân bóng</h1>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/admin/courts"
            className="inline-flex items-center gap-2 border px-4 py-2 rounded-xl hover:bg-gray-50"
          >
            <FaArrowLeft /> Quay lại
          </Link>
        </div>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl shadow p-5 grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        {/* Tên sân */}
        <div className="col-span-1">
          <label className="block text-sm font-medium mb-1">Tên sân *</label>
          <input
            value={form.name}
            onChange={(e) => setField("name", e.target.value)}
            className={`w-full px-3 py-2 border rounded-xl focus:outline-none focus:ring-2 ${
              errors.name ? "border-red-500 focus:ring-red-500" : "focus:ring-green-600"
            }`}
            placeholder="VD: Sân A - Khu Thể thao X"
          />
          {errors.name && <p className="text-xs text-red-600 mt-1">{errors.name}</p>}
        </div>

        {/* Địa điểm */}
        <div className="col-span-1">
          <label className="block text-sm font-medium mb-1">Địa điểm *</label>
          <input
            value={form.location}
            onChange={(e) => setField("location", e.target.value)}
            className={`w-full px-3 py-2 border rounded-xl focus:outline-none focus:ring-2 ${
              errors.location ? "border-red-500 focus:ring-red-500" : "focus:ring-green-600"
            }`}
            placeholder="VD: 123 Đường ABC, Quận 1, TP.HCM"
          />
          {errors.location && (
            <p className="text-xs text-red-600 mt-1">{errors.location}</p>
          )}
        </div>

        {/* Loại sân */}
        <div className="col-span-1">
          <label className="block text-sm font-medium mb-1">Loại sân *</label>
          <select
            value={form.type}
            onChange={(e) => setField("type", e.target.value)}
            className={`w-full px-3 py-2 border rounded-xl focus:outline-none focus:ring-2 ${
              errors.type ? "border-red-500 focus:ring-red-500" : "focus:ring-green-600"
            }`}
          >
            <option value="5v5">5 vs 5</option>
            <option value="7v7">7 vs 7</option>
          </select>
          {errors.type && <p className="text-xs text-red-600 mt-1">{errors.type}</p>}
        </div>

        {/* Giá/giờ */}
        <div className="col-span-1">
          <label className="block text-sm font-medium mb-1">Giá/giờ (VNĐ) *</label>
          <input
            type="number"
            min="0"
            step="1000"
            value={form.price_per_hour}
            onChange={(e) => setField("price_per_hour", e.target.value)}
            className={`w-full px-3 py-2 border rounded-xl focus:outline-none focus:ring-2 ${
              errors.price_per_hour
                ? "border-red-500 focus:ring-red-500"
                : "focus:ring-green-600"
            }`}
            placeholder="VD: 150000"
          />
          {errors.price_per_hour && (
            <p className="text-xs text-red-600 mt-1">{errors.price_per_hour}</p>
          )}
        </div>

        {/* Ảnh (URL) */}
        <div className="col-span-1">
          <label className="block text-sm font-medium mb-1">
            Ảnh (URL) <span className="text-gray-400">(tùy chọn)</span>
          </label>
          <input
            value={form.image_url}
            onChange={(e) => setField("image_url", e.target.value)}
            className="w-full px-3 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600"
            placeholder="https://.../image.jpg"
          />
        </div>

        {/* Trạng thái */}
        <div className="col-span-1">
          <label className="block text-sm font-medium mb-1">Trạng thái</label>
          <div className="flex items-center gap-2">
            <input
              id="active"
              type="checkbox"
              checked={form.active}
              onChange={(e) => setField("active", e.target.checked)}
              className="h-4 w-4"
            />
            <label htmlFor="active" className="text-sm">
              Đang hoạt động
            </label>
          </div>
        </div>

        {/* Mô tả */}
        <div className="col-span-1 md:col-span-2">
          <label className="block text-sm font-medium mb-1">
            Mô tả <span className="text-gray-400">(tùy chọn)</span>
          </label>
          <textarea
            rows={4}
            value={form.description}
            onChange={(e) => setField("description", e.target.value)}
            className="w-full px-3 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600"
            placeholder="Ghi chú về kích thước, cỏ nhân tạo, bãi xe, tiện ích…"
          />
        </div>

        {/* Actions */}
        <div className="col-span-1 md:col-span-2 flex items-center justify-end gap-2 pt-2">
          <Link
            href="/admin/courts"
            className="px-4 py-2 rounded-xl border hover:bg-gray-50"
          >
            Hủy
          </Link>
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-green-600 hover:bg-green-700 text-white disabled:opacity-60"
          >
            <FaSave />
            {submitting ? "Đang lưu..." : "Lưu sân"}
          </button>
        </div>
      </form>

      {/* Gợi ý cấu trúc payload gửi lên API */}
      <div className="mt-6 text-xs text-gray-500">
        <p>
          <strong>POST /api/courts</strong> expects JSON:
          <code>
            {" "}
            {"{ name, location, type, price_per_hour, image_url, description, active }"}
          </code>
        </p>
      </div>
    </div>
  );
}
