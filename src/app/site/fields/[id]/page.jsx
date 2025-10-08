"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image"; // 👈 thêm dòng này
import { getFieldById } from "@/services/fieldService";

export default function FieldDetailPage() {
  const params = useParams();
  const id = params?.id;

  const [field, setField] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    getFieldById(id)
      .then((res) => {
        // API trả về { success, data }
        setField(res.data);
      })
      .catch((err) => {
        console.error("❌ Lỗi load field:", err);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading)
    return (
      <div className="p-6 text-center text-gray-500 animate-pulse">
        ⏳ Đang tải thông tin sân...
      </div>
    );

  if (!field)
    return (
      <div className="p-6 text-center text-red-600">
        ❌ Không tìm thấy sân!
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow">
      {/* Tiêu đề */}
      <h1 className="text-3xl font-bold mb-4 text-green-700 text-center">
        {field.name}
      </h1>

      {/* Hình ảnh sân */}
      {field.images?.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          {field.images.map((img, idx) => (
            <Image
              key={idx}
              src={`${process.env.NEXT_PUBLIC_API_URL}${img}`}
              alt={`Ảnh ${idx + 1} của ${field.name}`}
              width={600}
              height={400}
              className="object-cover w-full h-64 rounded-lg shadow-sm"
            />
          ))}
        </div>
      ) : (
        <div className="mb-6 text-center text-gray-400 italic">
          (Chưa có hình ảnh sân)
        </div>
      )}

      {/* Thông tin chi tiết */}
      <div className="space-y-2 text-gray-700 leading-relaxed">
        <p>
          <b>Loại sân:</b> {field.type || "Đang cập nhật"}
        </p>
        <p>
          <b>Địa điểm:</b> {field.location || "Chưa có"}
        </p>
        <p>
          <b>Giá/giờ:</b>{" "}
          {field.pricePerHour
            ? `${field.pricePerHour.toLocaleString("vi-VN")} đ`
            : "Đang cập nhật"}
        </p>
        <p>
          <b>Trạng thái:</b> {field.status || "Không rõ"}
        </p>
        <p>
          <b>Tiện ích:</b>{" "}
          {Array.isArray(field.amenities)
            ? field.amenities.join(", ")
            : typeof field.amenities === "string"
            ? field.amenities
            : "Không có thông tin"}
        </p>
      </div>

      {/* Mô tả */}
      {field.description && (
        <div className="mt-6 p-4 bg-gray-50 border border-gray-100 rounded-lg">
          <h2 className="text-lg font-semibold mb-2 text-green-800">
            Mô tả chi tiết
          </h2>
          <p className="text-gray-600">{field.description}</p>
        </div>
      )}
    </div>
  );
}
