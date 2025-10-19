"use client";
import React, { useEffect, useState } from "react";
import { getProducts } from "@/services/productService";
import Link from "next/link";
import Image from "next/image";
import { toast } from "react-toastify";

export default function ProductListPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("Tất cả");
  const [fade, setFade] = useState(true);
  const [sortOption, setSortOption] = useState("default");

  const categories = ["Tất cả", "Găng tay", "Giày","Bóng", "Quần áo", "Balo/Túi", "Bảo vệ ống quyển", "Vớ ( Tất )", "Băng keo / băng cổ chân"];

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
        setTimeout(() => setLoading(false), 800);
      }
    }
    loadProducts();
  }, []);

  // ✅ Đếm số lượng sản phẩm theo danh mục
  const countByCategory = (cat) => {
    if (cat === "Tất cả") return products.length;
    return products.filter(
      (p) =>
        p.category?.toLowerCase().trim() === cat.toLowerCase().trim()
    ).length;
  };

  // ✅ Lọc sản phẩm theo danh mục
  let filteredProducts =
    selectedCategory === "Tất cả"
      ? [...products]
      : products.filter(
          (p) =>
            p.category?.toLowerCase().trim() ===
            selectedCategory.toLowerCase().trim()
        );

  // ✅ Sắp xếp sản phẩm
  if (sortOption === "price-asc") {
    filteredProducts.sort((a, b) => (a.price || 0) - (b.price || 0));
  } else if (sortOption === "price-desc") {
    filteredProducts.sort((a, b) => (b.price || 0) - (a.price || 0));
  } else if (sortOption === "name-asc") {
    filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sortOption === "name-desc") {
    filteredProducts.sort((a, b) => b.name.localeCompare(a.name));
  }

  // 🦴 Skeleton Loading
  const SkeletonCard = () => (
    <div className="bg-neutral-900 border border-gray-800 rounded-2xl shadow-lg animate-pulse overflow-hidden">
      <div className="w-full h-52 bg-gray-800" />
      <div className="p-4 space-y-3">
        <div className="h-5 bg-gray-700 rounded w-3/4"></div>
        <div className="h-4 bg-gray-700 rounded w-1/2"></div>
        <div className="h-4 bg-gray-700 rounded w-full"></div>
        <div className="h-9 bg-gray-700 rounded-xl mt-3"></div>
      </div>
    </div>
  );

  if (loading)
    return (
      <div className="max-w-7xl mx-auto p-6">
        <h1 className="text-3xl font-extrabold text-green-400 mb-6 flex items-center gap-2 justify-center md:justify-start">
          🛍️ Danh sách sản phẩm
        </h1>
        <div className="flex flex-wrap gap-3 mb-10 justify-center md:justify-start">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="w-20 h-9 bg-gray-800 rounded-full animate-pulse"
            ></div>
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {Array.from({ length: 8 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    );

  // ⚙️ Hiệu ứng mờ khi đổi danh mục
  const handleCategoryChange = (cat) => {
    setFade(false);
    setTimeout(() => {
      setSelectedCategory(cat);
      setFade(true);
    }, 200);
  };

  return (
    <div className="max-w-7xl mx-auto p-6 transition-all duration-300">
      {/* Tiêu đề */}
      <h1 className="text-3xl font-extrabold text-green-400 mb-6 flex items-center gap-2 justify-center md:justify-start">
        🛍️ Danh sách sản phẩm
      </h1>

      {/* Lọc + Sắp xếp */}
      <div className="flex flex-wrap justify-between items-center mb-10 gap-4">
        {/* 🔖 Thanh danh mục */}
        <div className="flex flex-wrap justify-center md:justify-start gap-3">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 shadow-md ${
                selectedCategory === cat
                  ? "bg-gradient-to-r from-green-500 to-teal-500 text-white shadow-lg scale-105"
                  : "bg-transparent border border-green-500 text-green-400 hover:bg-green-500/10 hover:scale-105"
              }`}
            >
              <span>{cat}</span>
              <span
                className={`text-xs px-2 py-0.5 rounded-full ${
                  selectedCategory === cat
                    ? "bg-white/20 text-white"
                    : "bg-green-500/20 text-green-300"
                }`}
              >
                {countByCategory(cat)}
              </span>
            </button>
          ))}
        </div>

        {/* ⚙️ Bộ chọn sắp xếp */}
        <div className="ml-auto">
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="bg-neutral-900 text-green-400 border border-green-500 rounded-full px-4 py-2 text-sm font-semibold hover:border-teal-400 transition-all duration-300"
          >
            <option value="default">Sắp xếp mặc định</option>
            <option value="price-asc">Giá tăng dần</option>
            <option value="price-desc">Giá giảm dần</option>
            <option value="name-asc">Tên (A → Z)</option>
            <option value="name-desc">Tên (Z → A)</option>
          </select>
        </div>
      </div>

      {/* Danh sách sản phẩm */}
      <div
        className={`transition-opacity duration-500 ${
          fade ? "opacity-100" : "opacity-0"
        }`}
      >
        {filteredProducts.length === 0 ? (
          <p className="text-gray-400 text-center text-sm">
            Không có sản phẩm trong danh mục này.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {filteredProducts.map((p) => (
              <div
                key={p._id}
                className="bg-neutral-900 border border-gray-800 rounded-2xl shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 overflow-hidden"
              >
                {/* Ảnh */}
                <div className="relative w-full h-52 bg-gray-800">
                  <Image
                    src={p.image || "/no-image.png"}
                    alt={p.name}
                    fill
                    className="object-contain p-3"
                  />
                </div>

                {/* Nội dung */}
                <div className="p-4">
                  <h3 className="font-bold text-lg text-gray-100 line-clamp-1 mb-1">
                    {p.name}
                  </h3>
                  <p className="text-green-400 font-semibold mb-1">
                    {p.price?.toLocaleString()}₫
                  </p>
                  <p className="text-sm text-gray-400 line-clamp-2 mb-4">
                    {p.description}
                  </p>

                  <Link
                    href={`/site/products/${p._id}`}
                    className="block text-center py-2 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-xl font-semibold hover:shadow-md hover:scale-[1.02] transition-all duration-300"
                  >
                    Xem chi tiết
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
