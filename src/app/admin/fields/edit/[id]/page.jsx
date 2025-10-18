"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { 
  FaSave, 
  FaArrowLeft, 
  FaTrash, 
  FaFutbol, 
  FaMapMarkerAlt,
  FaDollarSign,
  FaUsers,
  FaImage,
  FaAlignLeft,
  FaEdit
} from "react-icons/fa";
import { toast } from "react-toastify";
import axiosClient from "@/utils/axiosClient";

export default function EditFieldPage() {
  const { id } = useParams();
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

  const [oldImages, setOldImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [previewNew, setPreviewNew] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  const BASE_URL = process.env.NEXT_PUBLIC_API_URL?.replace("/v1", "") || "";

  function setField(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  useEffect(() => {
    async function load() {
      try {
        const res = await axiosClient.get(`/fields/${id}`);
        const data = res.data?.data || res.data;
        setForm(data);
        setOldImages(data.images || []);
      } catch {
        toast.error("Không tải được dữ liệu sân!");
      } finally {
        setLoading(false);
      }
    }
    if (id) load();
  }, [id]);

  function handleNewImages(e) {
    const files = Array.from(e.target.files);
    if (files.length + oldImages.length > 10) {
      toast.warning("⚠️ Tổng số ảnh không được vượt quá 10!");
      return;
    }
    setNewImages(files);
    setPreviewNew(files.map((f) => URL.createObjectURL(f)));
  }

  function removeOldImage(index) {
    setOldImages((prev) => prev.filter((_, i) => i !== index));
  }

  function removeNewImage(index) {
    setNewImages((prev) => prev.filter((_, i) => i !== index));
    setPreviewNew((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const formData = new FormData();
    Object.keys(form).forEach((key) => formData.append(key, form[key]));
    oldImages.forEach((url) => formData.append("oldImages[]", url));
    newImages.forEach((file) => formData.append("images", file));

    setSubmitting(true);
    try {
      await axiosClient.put(`/fields/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("✅ Cập nhật thành công!");
      router.push("/admin/fields");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "❌ Cập nhật thất bại!");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-emerald-500 border-t-transparent mb-4"></div>
          <p className="text-lg text-gray-600 font-medium animate-pulse">
            ⏳ Đang tải dữ liệu sân...
          </p>
        </div>
      </div>
    );
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
              <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-4 rounded-2xl shadow-lg transform transition-transform hover:scale-110 hover:rotate-3">
                <FaEdit className="text-3xl text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Chỉnh sửa sân bóng
                </h1>
                <p className="text-gray-500 text-sm mt-1">Cập nhật thông tin sân: {form.name}</p>
              </div>
            </div>
            <Link
              href="/admin/fields"
              className="group inline-flex items-center gap-2 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-blue-500 hover:to-indigo-500 px-6 py-3 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 font-medium text-gray-700 hover:text-white"
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
                Tên sân
              </label>
              <input
                value={form.name}
                onChange={(e) => setField("name", e.target.value)}
                placeholder="VD: Sân bóng Hồng Hà"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl hover:border-blue-300 focus:ring-4 focus:ring-blue-200 focus:border-blue-500 outline-none transition-all duration-300"
              />
            </div>

            {/* Loại sân */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <FaUsers className="text-blue-600" />
                Loại sân
              </label>
              <div className="relative">
                <select
                  value={form.type}
                  onChange={(e) => setField("type", e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl appearance-none bg-white hover:border-blue-300 focus:ring-4 focus:ring-blue-200 focus:border-blue-500 outline-none transition-all duration-300 cursor-pointer"
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
                Giá thuê (VNĐ/giờ)
              </label>
              <input
                type="number"
                value={form.pricePerHour}
                onChange={(e) => setField("pricePerHour", e.target.value)}
                placeholder="VD: 500000"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl hover:border-blue-300 focus:ring-4 focus:ring-blue-200 focus:border-blue-500 outline-none transition-all duration-300"
              />
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
                placeholder="VD: 123 Đường ABC, Quận 1"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl hover:border-blue-300 focus:ring-4 focus:ring-blue-200 focus:border-blue-500 outline-none transition-all duration-300"
              />
            </div>

            {/* Ảnh hiện tại */}
            <div className="md:col-span-2 space-y-3">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <FaImage className="text-purple-600" />
                Ảnh hiện tại <span className="text-gray-500 font-normal">({oldImages.length} ảnh)</span>
              </label>
              {oldImages.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                  {oldImages.map((url, i) => {
                    const imgUrl = url
                      ? `${BASE_URL}${url.startsWith("/") ? url : `/${url}`}`
                      : "/image/no-image.jpg";
                    return (
                      <div
                        key={i}
                        className="relative group rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                      >
                        <img
                          src={imgUrl}
                          className="w-full h-32 object-cover"
                          onError={(e) => (e.target.src = "/image/no-image.jpg")}
                          alt={`Ảnh ${i + 1}`}
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                          <button
                            type="button"
                            onClick={() => removeOldImage(i)}
                            className="bg-red-500 hover:bg-red-600 text-white rounded-full p-3 shadow-lg transform transition-transform hover:scale-110"
                          >
                            <FaTrash />
                          </button>
                        </div>
                        <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-lg font-semibold">
                          Ảnh {i + 1}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
                  <FaImage className="mx-auto text-4xl text-gray-400 mb-2" />
                  <p className="text-gray-500 text-sm">Chưa có ảnh</p>
                </div>
              )}
            </div>

            {/* Thêm ảnh mới */}
            <div className="md:col-span-2 space-y-3">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <FaImage className="text-indigo-600" />
                Thêm ảnh mới <span className="text-gray-500 font-normal">(Tối đa {10 - oldImages.length} ảnh)</span>
              </label>
              
              <div className="relative">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleNewImages}
                  className="hidden"
                  id="newImageUpload"
                />
                <label
                  htmlFor="newImageUpload"
                  className="flex items-center justify-center w-full px-6 py-4 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all duration-300 group"
                >
                  <div className="text-center">
                    <FaImage className="mx-auto text-4xl text-gray-400 group-hover:text-blue-500 mb-2 transition-colors" />
                    <p className="text-sm text-gray-600 group-hover:text-blue-600">
                      <span className="font-semibold">Nhấn để chọn ảnh mới</span> hoặc kéo thả vào đây
                    </p>
                    <p className="text-xs text-gray-400 mt-1">PNG, JPG, JPEG</p>
                  </div>
                </label>
              </div>

              {previewNew.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mt-4">
                  {previewNew.map((src, i) => (
                    <div
                      key={i}
                      className="relative group rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                    >
                      <img src={src} className="w-full h-32 object-cover" alt={`New ${i + 1}`} />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <button
                          type="button"
                          onClick={() => removeNewImage(i)}
                          className="bg-red-500 hover:bg-red-600 text-white rounded-full p-3 shadow-lg transform transition-transform hover:scale-110"
                        >
                          <FaTrash />
                        </button>
                      </div>
                      <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded-lg font-semibold">
                        Mới {i + 1}
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
                placeholder="Nhập mô tả về sân bóng..."
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl hover:border-blue-300 focus:ring-4 focus:ring-blue-200 focus:border-blue-500 outline-none transition-all duration-300 resize-none"
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
                  : "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 hover:shadow-2xl hover:-translate-y-1 text-white"
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
                  Lưu thay đổi
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