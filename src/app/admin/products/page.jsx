"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { toast } from "react-toastify";
import { getProducts } from "@/services/productService";

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  // ✅ Kiểm tra quyền admin
  useEffect(() => {
    const role = localStorage.getItem("role");
    setIsAdmin(role === "admin");
  }, []);

  // ✅ Lấy danh sách sản phẩm
  useEffect(() => {
    async function loadProducts() {
      try {
        const res = await getProducts();
        const data = res.data || res;
        setProducts(Array.isArray(data) ? data : data.data || []);
      } catch (error) {
        console.error("❌ Lỗi tải sản phẩm:", error);
        toast.error("Không thể tải danh sách sản phẩm!");
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, []);

  if (loading) return <p className="text-center mt-10">⏳ Đang tải dữ liệu...</p>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-green-700">📦 Quản lý sản phẩm</h1>

        {isAdmin && (
          <Link
            href="/admin/products/add"
            className="bg-green-600 hover:bg-green-700 text-white font-semibold px-5 py-2.5 rounded-lg shadow-lg transition-transform hover:scale-105 flex items-center gap-2"
          >
            ➕ Thêm sản phẩm
          </Link>
        )}
      </div>

      {/* Danh sách sản phẩm */}
      {products.length === 0 ? (
        <p className="text-gray-500 text-center">Chưa có sản phẩm nào.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((p) => (
            <div
              key={p._id}
              className="border rounded-xl shadow-sm hover:shadow-lg transition p-4 bg-white"
            >
              {/* Ảnh sản phẩm */}
              <div className="relative w-full h-48 mb-3">
                <Image
                  src={p.image || "/no-image.png"}
                  alt={p.name}
                  fill
                  className="object-cover rounded-lg"
                />
              </div>

              <h3 className="font-bold text-lg text-green-700">{p.name}</h3>
              <p className="text-gray-600 line-clamp-2">{p.description}</p>
              <p className="text-green-600 font-semibold mt-1">
                💰 {p.price?.toLocaleString()}₫
              </p>
              <p className="text-sm text-gray-500 mt-1">
                🏷 {p.brand || "Không rõ"} | 📂 {p.category || "Chưa phân loại"}
              </p>
              <p
                className={`mt-2 text-sm font-medium ${
                  p.status === "active" ? "text-green-500" : "text-red-500"
                }`}
              >
                ⚙️ {p.status === "active" ? "Đang bán" : "Ngừng bán"}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
    