"use client";
import React, { useState } from "react";
import BrandSelect from "./BrandSelect";
import CategorySelect from "./CategorySelect";
import { createProduct } from "@/services/productService";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ProductForm = () => {
  const [creating, setCreating] = useState(false);
  const [productData, setProductData] = useState({
    productName: "",
    description: "",
    price: "",
    image: [],
    brand: "",
    category: "",
    view: "",
    sold: "",
    status: "",
    feature: "",
    ingredient: "",
    instruction: "",
    summary: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setProductData((prev) => ({
      ...prev,
      [name]: ["price", "view", "sold"].includes(name)
        ? parseInt(value) || 0
        : name === "image"
          ? value.split(",").map((img) => img.trim())
          : value,
    }));
  };

  const validate = () => {
    const errors = {};
    if (!productData.productName.trim()) errors.productName = "Tên sản phẩm không được để trống.";
    if (!productData.description.trim()) errors.description = "Mô tả không được để trống.";
    if (productData.price <= 0) errors.price = "Giá phải lớn hơn 0";
    if (productData.price > 1000000) errors.price = "Giá không được vượt quá 1.000.000";
    if (!productData.brand) errors.brand = "Chọn thương hiệu.";
    if (!productData.category) errors.category = "Chọn danh mục.";
    if (!productData.status) errors.status = "Chọn trạng thái.";
    if (!productData.feature.trim()) errors.feature = "Nhập tính năng.";
    if (!productData.ingredient.trim()) errors.ingredient = "Nhập thành phần.";
    if (!productData.instruction.trim()) errors.instruction = "Nhập hướng dẫn.";
    if (!productData.summary.trim()) errors.summary = "Nhập tóm tắt.";
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
      await createProduct(productData);
      toast.success("✅ Tạo sản phẩm thành công!");
      setProductData({
        productName: "",
        description: "",
        price: "",
        image: [],
        brand: "",
        category: "",
        view: "",
        sold: "",
        status: "",
        feature: "",
        ingredient: "",
        instruction: "",
        summary: "",
      });
    } catch (error) {
      toast.error(error?.response?.data?.error?.message || "❌ Đã xảy ra lỗi khi tạo sản phẩm.");
      console.error("Lỗi khi tạo:", error.response?.data || error.message);
    } finally {
      setCreating(false);
    }
  }; 


  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      <form
        onSubmit={handleSubmit}
        className="max-w-5xl mx-auto p-6 bg-gradient-to-br from-blue-200 to-yellow-200 border-2 border-gray-300 rounded-xl shadow-md"
      >
        <div className="text-center p-3 w-full text-3xl font-bold">Thêm sản phẩm</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Tên sản phẩm */}
          <div>
            <label className="block text-lg font-semibold mb-2">Tên sản phẩm</label>
            <input
              type="text"
              name="productName"
              value={productData.productName}
              onChange={handleInputChange}
              className="w-full p-3 border-2 bg-white border-gray-400 rounded-md"
            />
          </div>

          {/* Giá */}
          <div>
            <label className="block text-lg font-semibold mb-2">Giá</label>
            <input
              type="number"
              name="price"
              value={productData.price}
              onChange={handleInputChange}
              className="w-full p-3 border-2 bg-white border-gray-400 rounded-md"
              min={1}
              max={1000000}
              placeholder="Giá sản phẩm"
            />
          </div>

          {/* Ảnh */}
          <div>
            <label className="block text-lg font-semibold mb-2">Ảnh (ngăn cách bởi ,)</label>
            <input
              type="text"
              name="image"
              value={productData.image.join(",")}
              onChange={handleInputChange}
              className="w-full p-3 border-2 bg-white border-gray-400 rounded-md"
            />
          </div>

          {/* Tóm tắt */}
          <div>
            <label className="block text-lg font-semibold mb-2">Tóm tắt</label>
            <input
              type="text"
              name="summary"
              value={productData.summary}
              onChange={handleInputChange}
              className="w-full p-3 border-2 bg-white border-gray-400 rounded-md"
            />
          </div>

          {/* Thương hiệu */}
          <div>
            <label className="block text-lg font-semibold mb-2">Thương hiệu</label>
            <BrandSelect value={productData.brand} handleInputChange={handleInputChange} />
          </div>

          {/* Danh mục */}
          <div>
            <label className="block text-lg font-semibold mb-2">Danh mục</label>
            <CategorySelect value={productData.category} handleInputChange={handleInputChange} />
          </div>

          {/* Trạng thái */}
          <div>
            <label className="block text-lg font-semibold mb-2">Trạng thái</label>
            <select
              name="status"
              value={productData.status}
              onChange={handleInputChange}
              className="w-full p-3 bg-white border-2 border-gray-400 rounded-md"
            >
              <option value="">-- Chọn trạng thái --</option>
              <option value="In stock">In stock</option>
              <option value="Out stock">Out stock</option>
              <option value="Hidden">Hidden</option>
            </select>
          </div>

          {/* Lượt xem */}
          <div>
            <label className="block text-lg font-semibold mb-2">Lượt xem</label>
            <input
              type="number"
              name="view"
              value={productData.view}
              onChange={handleInputChange}
              className="w-full p-3 border-2 bg-white border-gray-400 rounded-md"
            />
          </div>

          {/* Đã bán */}
          <div>
            <label className="block text-lg font-semibold mb-2">Đã bán</label>
            <input
              type="number"
              name="sold"
              value={productData.sold}
              onChange={handleInputChange}
              className="w-full p-3 border-2 bg-white border-gray-400 rounded-md"
            />
          </div>

          {/* Tính năng */}
          <div className="md:col-span-2">
            <label className="block text-lg font-semibold mb-2">Tính năng</label>
            <textarea
              name="feature"
              value={productData.feature}
              onChange={handleInputChange}
              className="w-full p-3 border-2 bg-white border-gray-400 rounded-md"
              rows={3}
            />
          </div>

          {/* Thành phần */}
          <div className="md:col-span-2">
            <label className="block text-lg font-semibold mb-2">Thành phần</label>
            <textarea
              name="ingredient"
              value={productData.ingredient}
              onChange={handleInputChange}
              className="w-full p-3 border-2 bg-white border-gray-400 rounded-md"
              rows={3}
            />
          </div>

          {/* Hướng dẫn sử dụng */}
          <div className="md:col-span-2">
            <label className="block text-lg font-semibold mb-2">Hướng dẫn sử dụng</label>
            <textarea
              name="instruction"
              value={productData.instruction}
              onChange={handleInputChange}
              className="w-full p-3 border-2 bg-white border-gray-400 rounded-md"
              rows={3}
            />
          </div>

          {/* Mô tả */}
          <div className="md:col-span-2">
            <label className="block text-lg font-semibold mb-2">Mô tả</label>
            <textarea
              name="description"
              value={productData.description}
              onChange={handleInputChange}
              className="w-full p-3 border-2 bg-white border-gray-400 rounded-md"
              rows={3}
            />
          </div>
        </div>

        {/* Submit */}
        <div className="mt-6 text-right"> 
          <button
            type="submit"
            className="px-6 py-3 bg-blue-600 text-white font-bold text-lg rounded-md hover:bg-blue-700 transition"
            disabled={creating}
          >
            {creating ? "Đang tạo..." : "Tạo sản phẩm"}
          </button>
        </div>
      </form>
    </>
  );

};

export default ProductForm;
