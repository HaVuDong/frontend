"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
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

  if (loading) return <div className="p-6">⏳ Đang tải thông tin sân...</div>;
  if (!field) return <div className="p-6 text-red-600">❌ Không tìm thấy sân!</div>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow">
      <h1 className="text-3xl font-bold mb-4">{field.name}</h1>
      <p><b>Loại sân:</b> {field.type}</p>
      <p><b>Địa điểm:</b> {field.location}</p>
      <p><b>Giá/giờ:</b> {field.pricePerHour?.toLocaleString("vi-VN")} đ</p>
      <p><b>Trạng thái:</b> {field.status}</p>

      {field.amenities?.length > 0 && (
        <div className="mt-3">
          <b>Tiện ích:</b> {field.amenities.join(", ")}
        </div>
      )}

      {field.description && (
        <p className="mt-4 text-gray-700">{field.description}</p>
      )}
    </div>
  );
}
