"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  FaFutbol, 
  FaSave, 
  FaArrowLeft, 
  FaTrash, 
  FaMapMarkerAlt,
  FaDollarSign,
  FaUsers,
  FaImage,
  FaAlignLeft,
  FaTimes
} from "react-icons/fa";
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
    if (files.length > 10) {
      toast.warning("⚠️ Chỉ được chọn tối đa 10 ảnh!");
      return;
    }
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
    if (Object.keys(eobj).length > 0) {
      toast.error("❌ Vui lòng kiểm tra lại thông tin!");
      return;
    }

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
      toast.error(err.response?.data?.message || "❌ Thêm sân thất bại!");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50 py-8 px-4 relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-4 rounded-2xl shadow-lg transform transition-transform hover:scale-110 hover:rotate-3">
                <FaFutbol className="text-3xl text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-extrabold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  Thêm sân bóng mới
                </h1>
                <p className="text-gray-500 text-sm mt-1">Điền thông tin chi tiết về sân bóng</p>
              </div>
            </div>
            <Link
              href="/admin/fields"
              className="group inline-flex items-center gap-2 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-emerald-500 hover:to-teal-500 px-6 py-3 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 font-medium text-gray-700 hover:text-white"
            >
              <FaArrowLeft className="transition-transform group-hover:-translate-x-1" />
              Quay lại
            </Link>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Tên sân */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <FaFutbol className="text-emerald-600" />
                Tên sân <span className="text-red-500">*</span>
              </label>
              <input
                value={form.name}
                onChange={(e) => setField("name", e.target.value)}
                placeholder="VD: Sân bóng Hồng Hà"
                className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-300 focus:ring-4 focus:ring-emerald-200 focus:border-emerald-500 outline-none ${
                  errors.name ? "border-red-500 bg-red-50" : "border-gray-200 hover:border-emerald-300"
                }`}
              />
              {errors.name && (
                <p className="text-xs text-red-600 flex items-center gap-1 animate-pulse">
                  <FaTimes className="text-red-500" /> {errors.name}
                </p>
              )}
            </div>

            {/* Loại sân */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <FaUsers className="text-blue-600" />
                Loại sân <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  value={form.type}
                  onChange={(e) => setField("type", e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl appearance-none bg-white hover:border-emerald-300 focus:ring-4 focus:ring-emerald-200 focus:border-emerald-500 outline-none transition-all duration-300 cursor-pointer"
                >
                  <option value="5 người">⚽ Sân 5 người</option>
                  <option value="7 người">⚽ Sân 7 người</option>
                  <option value="11 người">⚽ Sân 11 người</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                  ▼
                </div>
              </div>
            </div>

            {/* Giá/giờ */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <FaDollarSign className="text-green-600" />
                Giá thuê (VNĐ/giờ) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={form.pricePerHour}
                onChange={(e) => setField("pricePerHour", e.target.value)}
                placeholder="VD: 500000"
                className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-300 focus:ring-4 focus:ring-emerald-200 focus:border-emerald-500 outline-none ${
                  errors.pricePerHour ? "border-red-500 bg-red-50" : "border-gray-200 hover:border-emerald-300"
                }`}
              />
              {errors.pricePerHour && (
                <p className="text-xs text-red-600 flex items-center gap-1 animate-pulse">
                  <FaTimes className="text-red-500" /> {errors.pricePerHour}
                </p>
              )}
            </div>

            {/* Địa điểm */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <FaMapMarkerAlt className="text-red-600" />
                Địa điểm
              </label>
              <input
                value={form.location}
                onChange={(e) => setField("location", e.target.value)}
                placeholder="VD: 123 Đường ABC, Quận 1, TP.HCM"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl hover:border-emerald-300 focus:ring-4 focus:ring-emerald-200 focus:border-emerald-500 outline-none transition-all duration-300"
              />
            </div>

            {/* Ảnh sân */}
            <div className="md:col-span-2 space-y-3">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <FaImage className="text-purple-600" />
                Ảnh sân <span className="text-gray-500 font-normal">(Tối đa 10 ảnh)</span>
              </label>
              
              <div className="relative">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  id="imageUpload"
                />
                <label
                  htmlFor="imageUpload"
                  className="flex items-center justify-center w-full px-6 py-4 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-emerald-500 hover:bg-emerald-50 transition-all duration-300 group"
                >
                  <div className="text-center">
                    <FaImage className="mx-auto text-4xl text-gray-400 group-hover:text-emerald-500 mb-2 transition-colors" />
                    <p className="text-sm text-gray-600 group-hover:text-emerald-600">
                      <span className="font-semibold">Nhấn để chọn ảnh</span> hoặc kéo thả vào đây
                    </p>
                    <p className="text-xs text-gray-400 mt-1">PNG, JPG, JPEG (Tối đa 10 ảnh)</p>
                  </div>
                </label>
              </div>

              {previews.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mt-4">
                  {previews.map((src, i) => (
                    <div
                      key={i}
                      className="relative group rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                    >
                      <img
                        src={src}
                        alt={`Preview ${i + 1}`}
                        className="w-full h-32 object-cover"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <button
                          type="button"
                          onClick={() => removePreview(i)}
                          className="bg-red-500 hover:bg-red-600 text-white rounded-full p-3 shadow-lg transform transition-transform hover:scale-110"
                        >
                          <FaTrash />
                        </button>
                      </div>
                      <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded-lg">
                        Ảnh {i + 1}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Mô tả */}
            <div className="md:col-span-2 space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <FaAlignLeft className="text-indigo-600" />
                Mô tả chi tiết
              </label>
              <textarea
                rows={5}
                value={form.description}
                onChange={(e) => setField("description", e.target.value)}
                placeholder="Nhập mô tả về sân bóng: Tình trạng, tiện ích, điểm nổi bật..."
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl hover:border-emerald-300 focus:ring-4 focus:ring-emerald-200 focus:border-emerald-500 outline-none transition-all duration-300 resize-none"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-4 mt-8 pt-6 border-t border-gray-200">
            <Link
              href="/admin/fields"
              className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 font-medium"
            >
              Hủy bỏ
            </Link>
            <button
              type="submit"
              disabled={submitting}
              className={`inline-flex items-center gap-2 px-8 py-3 rounded-xl font-semibold shadow-lg transition-all duration-300 transform ${
                submitting
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 hover:shadow-2xl hover:-translate-y-1 text-white"
              }`}
            >
              {submitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                  Đang lưu...
                </>
              ) : (
                <>
                  <FaSave />
                  Lưu sân bóng
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      <style jsx>{`
        @keyframes blob {
          0%,
          100% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}