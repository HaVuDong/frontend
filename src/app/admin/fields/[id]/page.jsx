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
      {Array.isArray(field.images) && field.images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-4">
          {field.images.map((url, i) => (
            <img
              key={i}
              src={
                url.startsWith("/uploads")
                  ? `${process.env.NEXT_PUBLIC_API_URL}${url}` // nếu url đã có /uploads ở đầu
                  : `${process.env.NEXT_PUBLIC_API_URL}/uploads/fields/${url}` // nếu chỉ là tên file
              }
              alt={`Ảnh ${i + 1}`}
              className="w-full h-48 object-cover rounded-lg border"
              onError={(e) => (e.target.src = "/no-image.png")}
            />
          ))}
        </div>
      )}
      <h1 className="text-3xl font-bold mb-4">{field.name}</h1>
      <p><b>Loại sân:</b> {field.type}</p>
      <p><b>Địa điểm:</b> {field.location}</p>
      <p><b>Giá/giờ:</b> {field.pricePerHour?.toLocaleString("vi-VN")} đ</p>
      <p><b>Trạng thái:</b> {field.status}</p>

      {Array.isArray(field.amenities) && field.amenities.length > 0 ? (
        <div className="mt-3">
          <b>Tiện ích:</b> {field.amenities.join(", ")}
        </div>
      ) : field.amenities ? (
        <p><b>Tiện ích:</b> {field.amenities}</p>
      ) : null}


      {field.description && (
        <p className="mt-4 text-gray-700">{field.description}</p>
      )}
    </div>
  );
}
