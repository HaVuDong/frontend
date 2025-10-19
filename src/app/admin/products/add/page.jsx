"use client";
import React, { useState } from "react";
import { addProduct } from "@/services/productService";
import { toast } from "react-toastify";

export default function AddProductPage() {
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    brand: "",
    category: "",
    image: "",
    status: "active"
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addProduct(form);
      toast.success("✅ Thêm sản phẩm thành công!");
      setForm({
        name: "",
        description: "",
        price: "",
        brand: "",
        category: "",
        image: "",
        status: "active"
      });
    } catch (error) {
      console.error(error);
      toast.error("❌ Lỗi khi thêm sản phẩm!");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-xl mt-10">
      <h1 className="text-2xl font-bold mb-6 text-green-600">
        ➕ Thêm sản phẩm mới
      </h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Tên sản phẩm"
          value={form.name}
          onChange={handleChange}
          className="w-full border rounded-lg p-2"
          required
        />
        <textarea
          name="description"
          placeholder="Mô tả sản phẩm"
          value={form.description}
          onChange={handleChange}
          className="w-full border rounded-lg p-2"
        ></textarea>
        <input
          type="number"
          name="price"
          placeholder="Giá (VNĐ)"
          value={form.price}
          onChange={handleChange}
          className="w-full border rounded-lg p-2"
          required
        />
        <input
          type="text"
          name="brand"
          placeholder="Thương hiệu"
          value={form.brand}
          onChange={handleChange}
          className="w-full border rounded-lg p-2"
        />
        <input
          type="text"
          name="category"
          placeholder="Danh mục"
          value={form.category}
          onChange={handleChange}
          className="w-full border rounded-lg p-2"
        />
        <input
          type="text"
          name="image"
          placeholder="URL ảnh sản phẩm"
          value={form.image}
          onChange={handleChange}
          className="w-full border rounded-lg p-2"
        />

        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-semibold"
        >
          💾 Lưu sản phẩm
        </button>
      </form>
    </div>
  );
}
