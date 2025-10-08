"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { getFields } from "@/services/fieldService";
import { toast } from "react-toastify";

export default function ImageGallery() {
  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(true);

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
      <div className="py-12 text-center text-gray-500 text-lg animate-pulse">
        Đang tải hình ảnh sân...
      </div>
    );

  if (fields.length === 0)
    return (
      <div className="py-12 text-center text-gray-500 text-lg italic">
        Chưa có sân nào được thêm!
      </div>
    );

  // ✅ Lấy base URL từ .env
  const BASE_URL = process.env.NEXT_PUBLIC_API_URL?.replace("/v1", "");

  return (
    <section className="max-w-7xl mx-auto py-16 px-6 font-sans">
      <h2 className="text-3xl md:text-4xl font-extrabold text-green-700 mb-10 text-center tracking-tight drop-shadow-sm">
        Hình Ảnh Sân Bóng NĐ
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {fields.map((field, i) => {
          // ✅ Sửa URL ảnh cho đúng backend
          const firstImage = field.images?.[0];
          const imgUrl = firstImage
            ? `${BASE_URL}${firstImage.startsWith("/") ? firstImage : `/${firstImage}`}`
            : "/image/no-image.jpg";

          return (
            <Link
              key={field._id || i}
              href={`/site/fields/${field._id}`}
              className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 cursor-pointer"
            >
              <div className="relative overflow-hidden">
                <Image
                  src={imgUrl}
                  width={600}
                  height={400}
                  alt={field.name || "Sân bóng"}
                  className="object-cover w-full h-64 transform group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>

              <div className="p-5 text-center">
                <h3 className="text-xl font-semibold text-green-800 group-hover:text-green-600 transition-colors">
                  {field.name}
                </h3>
                <p className="text-gray-500 text-sm mt-1 italic">
                  {field.location || "Đang cập nhật..."}
                </p>
                <p className="mt-3 text-sm text-gray-600">
                  <span className="font-medium text-green-700">
                    {field.type || "Sân mini"}
                  </span>{" "}
                  • {field.pricePerHour?.toLocaleString("vi-VN") || "?"}đ / giờ
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
