"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { FaSave, FaArrowLeft, FaTrash } from "react-icons/fa";
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
      toast.error("❌ Cập nhật thất bại!");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <div className="p-6">Đang tải dữ liệu...</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-bold">Chỉnh sửa sân</h1>
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
        <input
          value={form.name}
          onChange={(e) => setField("name", e.target.value)}
          placeholder="Tên sân"
          className="w-full border p-2 rounded-lg"
        />
        <input
          value={form.location}
          onChange={(e) => setField("location", e.target.value)}
          placeholder="Địa điểm"
          className="w-full border p-2 rounded-lg"
        />
        <input
          type="number"
          value={form.pricePerHour}
          onChange={(e) => setField("pricePerHour", e.target.value)}
          placeholder="Giá thuê (VNĐ)"
          className="w-full border p-2 rounded-lg"
        />
        <textarea
          rows={4}
          value={form.description}
          onChange={(e) => setField("description", e.target.value)}
          className="w-full border p-2 rounded-lg md:col-span-2"
          placeholder="Mô tả sân..."
        />

        {/* Ảnh cũ */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1">Ảnh hiện tại</label>
          {oldImages.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-2">
              {oldImages.map((url, i) => (
                <div key={i} className="relative">
                  <img
                    src={`${process.env.NEXT_PUBLIC_API_URL}${url}`}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => removeOldImage(i)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
                  >
                    <FaTrash size={12} />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">Chưa có ảnh</p>
          )}
        </div>

        {/* Ảnh mới */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1">Thêm ảnh mới</label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleNewImages}
            className="w-full border p-2 rounded-lg"
          />
          {previewNew.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3">
              {previewNew.map((src, i) => (
                <div key={i} className="relative">
                  <img src={src} className="w-full h-32 object-cover rounded-lg" />
                  <button
                    type="button"
                    onClick={() => removeNewImage(i)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
                  >
                    <FaTrash size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="md:col-span-2 flex justify-end gap-2">
          <Link href="/admin/fields" className="px-4 py-2 border rounded-xl">
            Hủy
          </Link>
          <button
            type="submit"
            disabled={submitting}
            className="px-4 py-2 bg-green-600 text-white rounded-xl"
          >
            {submitting ? "Đang lưu..." : "Lưu thay đổi"}
          </button>
        </div>
      </form>
    </div>
  );
}
