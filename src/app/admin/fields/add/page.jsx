"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaFutbol, FaSave, FaArrowLeft, FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";
import axiosClient from "@/utils/axiosClient";

export default function AddFieldPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    location: "",
    type: "5 người",
    pricePerHour: "",
    description: "",
    status: "available",
    isActive: true,
  });

  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  function setField(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function handleImageChange(e) {
    const files = Array.from(e.target.files);
    setImages(files);
    setPreviews(files.map((file) => URL.createObjectURL(file)));
  }

  function removePreview(index) {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  }

  function validate() {
    const e = {};
    if (!form.name.trim()) e.name = "Vui lòng nhập tên sân";
    if (!form.type) e.type = "Vui lòng chọn loại sân";
    if (form.pricePerHour === "" || isNaN(Number(form.pricePerHour))) {
      e.pricePerHour = "Giá/giờ không hợp lệ";
    } else if (Number(form.pricePerHour) < 0) {
      e.pricePerHour = "Giá/giờ phải ≥ 0";
    }
    return e;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const eobj = validate();
    setErrors(eobj);
    if (Object.keys(eobj).length > 0) return;

    const formData = new FormData();
    Object.keys(form).forEach((key) => formData.append(key, form[key]));
    images.forEach((file) => formData.append("images", file));

    setSubmitting(true);
    try {
      await axiosClient.post("/fields", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("✅ Thêm sân thành công!");
      router.push("/admin/fields");
    } catch (err) {
      console.error(err);
      toast.error("❌ Thêm sân thất bại!");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <FaFutbol className="text-2xl text-green-600" />
          <h1 className="text-2xl font-bold">Thêm sân bóng</h1>
        </div>
        <Link
          href="/admin/fields"
          className="inline-flex items-center gap-2 border px-4 py-2 rounded-xl hover:bg-gray-50"
        >
          <FaArrowLeft /> Quay lại
        </Link>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl shadow p-6 grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        {/* Tên sân */}
        <div>
          <label className="block text-sm font-medium mb-1">Tên sân *</label>
          <input
            value={form.name}
            onChange={(e) => setField("name", e.target.value)}
            className={`w-full px-3 py-2 border rounded-xl ${
              errors.name ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.name && <p className="text-xs text-red-600">{errors.name}</p>}
        </div>

        {/* Loại sân */}
        <div>
          <label className="block text-sm font-medium mb-1">Loại sân *</label>
          <select
            value={form.type}
            onChange={(e) => setField("type", e.target.value)}
            className="w-full px-3 py-2 border rounded-xl"
          >
            <option value="5 người">Sân 5 người</option>
            <option value="7 người">Sân 7 người</option>
            <option value="11 người">Sân 11 người</option>
          </select>
        </div>

        {/* Giá/giờ */}
        <div>
          <label className="block text-sm font-medium mb-1">Giá thuê (VNĐ)</label>
          <input
            type="number"
            value={form.pricePerHour}
            onChange={(e) => setField("pricePerHour", e.target.value)}
            className="w-full px-3 py-2 border rounded-xl"
          />
        </div>

        {/* Địa điểm */}
        <div>
          <label className="block text-sm font-medium mb-1">Địa điểm</label>
          <input
            value={form.location}
            onChange={(e) => setField("location", e.target.value)}
            className="w-full px-3 py-2 border rounded-xl"
          />
        </div>

        {/* Ảnh */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-2">Ảnh sân (tối đa 10)</label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageChange}
            className="w-full border p-2 rounded-lg"
          />
          {previews.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3">
              {previews.map((src, i) => (
                <div key={i} className="relative">
                  <img
                    src={src}
                    alt=""
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => removePreview(i)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
                  >
                    <FaTrash size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Mô tả */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1">Mô tả</label>
          <textarea
            rows={4}
            value={form.description}
            onChange={(e) => setField("description", e.target.value)}
            className="w-full px-3 py-2 border rounded-xl"
          />
        </div>

        <div className="md:col-span-2 flex justify-end gap-2">
          <Link href="/admin/fields" className="px-4 py-2 border rounded-xl">
            Hủy
          </Link>
          <button
            type="submit"
            disabled={submitting}
            className="px-4 py-2 rounded-xl bg-green-600 text-white"
          >
            {submitting ? "Đang lưu..." : "Lưu sân"}
          </button>
        </div>
      </form>
    </div>
  );
}
