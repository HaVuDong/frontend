"use client";
import React, { useEffect, useState } from "react";
import { getProductById } from "@/services/productService";
import { useParams } from "next/navigation";
import Image from "next/image";
import { toast } from "react-toastify";

export default function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    async function loadProduct() {
      try {
        const res = await getProductById(id);
        const data = res.data || res;
        setProduct(data);
      } catch (error) {
        console.error("❌ Lỗi tải chi tiết sản phẩm:", error);
        toast.error("Không thể tải chi tiết sản phẩm!");
      }
    }
    loadProduct();
  }, [id]);

  if (!product)
    return <p className="text-center mt-10 text-gray-500">Đang tải sản phẩm...</p>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Ảnh sản phẩm */}
        <div className="relative w-full md:w-1/2 h-96 bg-gray-100 rounded-xl overflow-hidden">
          <Image
            src={product.image || "/no-image.png"}
            alt={product.name}
            fill
            className="object-cover"
          />
        </div>

        {/* Thông tin */}
        <div className="flex-1 space-y-4">
          <h1 className="text-3xl font-bold text-green-700">{product.name}</h1>
          <p className="text-2xl text-green-600 font-semibold">
            {product.price?.toLocaleString()}₫
          </p>
          <p className="text-gray-700 leading-relaxed whitespace-pre-line">
            {product.description}
          </p>
          <button className="px-6 py-3 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-xl font-bold hover:scale-105 transition-all duration-300">
            🛒 Thêm vào giỏ
          </button>
        </div>
      </div>
    </div>
  );
}
