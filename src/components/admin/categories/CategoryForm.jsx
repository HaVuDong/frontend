"use client";
import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { createCategory } from "@/services/categoryService";

const CategoryForm = () => {
  const [creating, setCreating] = useState(false);
  const [formData, setFormData] = useState({
    categoryName: "",
    description: "",
    publishedAt: true, // true = hiển thị
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const validate = () => {
    const errors = {};
    if (!formData.categoryName.trim()) errors.categoryName = "Tên danh mục không được để trống.";
    if (!formData.description.trim()) errors.description = "Mô tả không được để trống.";
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validate();

    if (Object.keys(errors).length > 0) {
      Object.values(errors).forEach((msg) => toast.error(msg));
      return;
    }

    try {
      setCreating(true);
      await createCategory({
        categoryName: formData.categoryName,
        description: formData.description,
        publishedAt: formData.publishedAt ? new Date().toISOString() : null,
      });

      toast.success("✅ Tạo danh mục thành công!");
      setFormData({
        categoryName: "",
        description: "",
        publishedAt: true,
      });
    } catch (err) {
      toast.error("❌ Lỗi khi tạo danh mục.");
      console.error("❌", err.response?.data || err.message);
    } finally {
      setCreating(false);
    }
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      <form
        onSubmit={handleSubmit}
        className="max-w-2xl mx-auto p-6 bg-gradient-to-br from-green-100 to-blue-100 border border-gray-300 rounded-xl shadow-md"
      >
        <div className="text-center text-2xl font-bold mb-6">Thêm danh mục</div>

        {/* Tên danh mục */}
        <div className="mb-4">
          <label className="block font-semibold text-lg mb-2">Tên danh mục</label>
          <input
            type="text"
            name="categoryName"
            value={formData.categoryName}
            onChange={handleChange}
            className="w-full p-3 border border-gray-400 rounded-md"
          />
        </div>

        {/* Mô tả */}
        <div className="mb-4">
          <label className="block font-semibold text-lg mb-2">Mô tả</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full p-3 border border-gray-400 rounded-md"
            rows={4}
          />
        </div>

        {/* Hiển thị */}
        <div className="mb-6">
          <label className="inline-flex items-center gap-2">
            <input
              type="checkbox"
              name="publishedAt"
              checked={formData.publishedAt}
              onChange={handleChange}
              className="w-5 h-5"
            />
            <span className="text-lg">Hiển thị ngay</span>
          </label>
        </div>

        {/* Submit */}
        <div className="text-right">
          <button
            type="submit"
            className="px-6 py-3 bg-green-600 text-white font-bold rounded-md hover:bg-green-700 transition"
            disabled={creating}
          >
            {creating ? "Đang tạo..." : "Tạo danh mục"}
          </button>
        </div>
      </form>
    </>
  );
};

export default CategoryForm;
