"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { getFields } from "@/services/fieldService";
import { toast } from "react-toastify";

export default function ImageGallery() {
  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  useEffect(() => {
    async function fetchFields() {
      try {
        const res = await getFields();
        const data = Array.isArray(res.data) ? res.data : res.data?.data || [];
        setFields(data);
      } catch (error) {
        console.error("❌ Lỗi tải danh sách sân:", error);
        toast.error("Không thể tải danh sách sân!");
      } finally {
        setLoading(false);
      }
    }
    fetchFields();
  }, []);

  if (loading)
    return (
      <div className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <div className="inline-block animate-pulse">
              <div className="h-8 w-64 bg-gradient-to-r from-green-200 to-blue-200 rounded-full mb-4"></div>
            </div>
            <div className="h-12 w-96 bg-gradient-to-r from-green-200 to-blue-200 rounded-lg mx-auto"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gradient-to-br from-gray-200 to-gray-300 rounded-3xl h-80"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );

  if (fields.length === 0)
    return (
      <div className="py-20 text-center bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-2xl mx-auto px-6">
          <div className="text-6xl mb-4">⚽</div>
          <p className="text-gray-500 text-xl italic">Chưa có sân nào được thêm!</p>
        </div>
      </div>
    );

  const BASE_URL = process.env.NEXT_PUBLIC_API_URL?.replace("/v1", "");

  return (
    <section className="relative py-20 px-6 bg-gradient-to-br from-white via-blue-50 to-green-50 overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-green-200 to-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-br from-purple-200 to-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in-down">
          <div className="inline-block mb-4">
            <span className="bg-gradient-to-r from-green-600 to-blue-600 text-white px-6 py-2 rounded-full text-sm font-semibold shadow-lg">
              🏟️ KHÁM PHÁ SÂN BÓNG
            </span>
          </div>
          <h2 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 mb-4 animate-gradient">
            Hình Ảnh Sân Bóng NĐ
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Hệ thống sân bóng hiện đại với cơ sở vật chất đạt chuẩn quốc tế
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {fields.map((field, i) => {
            const firstImage = field.images?.[0];
            const imgUrl = firstImage
              ? `${BASE_URL}${firstImage.startsWith("/") ? firstImage : `/${firstImage}`}`
              : "/image/no-image.jpg";

            return (
              <Link
                key={field._id || i}
                href={`/site/fields/${field._id}`}
                className="group relative animate-fade-in-up"
                style={{ animationDelay: `${i * 100}ms` }}
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <div className="relative bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
                  {/* Image container with 3D effect */}
                  <div className="relative overflow-hidden h-72">
                    <Image
                      src={imgUrl}
                      width={600}
                      height={400}
                      alt={field.name || "Sân bóng"}
                      className="object-cover w-full h-full transform group-hover:scale-110 transition-transform duration-700"
                    />
                    
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300"></div>
                    
                    {/* Shine effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>

                    {/* Floating badge */}
                    <div className="absolute top-4 right-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2 rounded-full text-xs font-bold shadow-lg transform group-hover:scale-110 transition-transform">
                      {field.type || "Sân mini"}
                    </div>

                    {/* Status indicator */}
                    <div className="absolute top-4 left-4 flex items-center gap-2">
                      <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                      </span>
                      <span className="text-white text-xs font-semibold bg-black/40 backdrop-blur-sm px-3 py-1 rounded-full">
                        Đang hoạt động
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 relative">
                    {/* Field name */}
                    <h3 className="text-2xl font-black text-gray-800 group-hover:text-green-600 transition-colors duration-300 mb-2">
                      {field.name}
                    </h3>

                    {/* Location */}
                    <div className="flex items-center gap-2 text-gray-500 mb-4">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <p className="text-sm italic">{field.location || "Đang cập nhật..."}</p>
                    </div>

                    {/* Price tag */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-blue-600">
                          {field.pricePerHour?.toLocaleString("vi-VN") || "?"}đ
                        </span>
                        <span className="text-gray-500 text-sm">/ giờ</span>
                      </div>

                      {/* Arrow icon */}
                      <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                        <svg
                          className="w-5 h-5 text-white transform group-hover:translate-x-1 transition-transform"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 7l5 5m0 0l-5 5m5-5H6"
                          />
                        </svg>
                      </div>
                    </div>

                    {/* Hover info */}
                    <div
                      className={`mt-4 pt-4 border-t border-gray-200 transition-all duration-300 ${
                        hoveredIndex === i
                          ? "opacity-100 translate-y-0"
                          : "opacity-0 translate-y-2"
                      }`}
                    >
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">⭐ Đánh giá cao</span>
                        <span className="text-green-600 font-semibold">Xem chi tiết →</span>
                      </div>
                    </div>
                  </div>

                  {/* Decorative corner */}
                  <div className="absolute top-0 left-0 w-20 h-20 bg-gradient-to-br from-green-400/20 to-transparent rounded-br-full"></div>
                  <div className="absolute bottom-0 right-0 w-20 h-20 bg-gradient-to-tl from-blue-400/20 to-transparent rounded-tl-full"></div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* View all button */}
        <div className="text-center mt-16 animate-fade-in-up animation-delay-600">
          <Link
            href="/site/fields"
            className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-full font-bold text-lg shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 group"
          >
            Xem Tất Cả Sân Bóng
            <svg
              className="w-5 h-5 group-hover:translate-x-2 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
