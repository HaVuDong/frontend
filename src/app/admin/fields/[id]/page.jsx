"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { 
  FaFutbol, 
  FaMapMarkerAlt, 
  FaDollarSign, 
  FaUsers,
  FaCheckCircle,
  FaTimesCircle,
  FaArrowLeft,
  FaEdit,
  FaStar,
  FaWifi,
  FaParking,
  FaShower
} from "react-icons/fa";
import { getFieldById } from "@/services/fieldService";

export default function FieldDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id;

  const [field, setField] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);

  const BASE_URL = process.env.NEXT_PUBLIC_API_URL?.replace("/v1", "") || "";

  useEffect(() => {
    if (!id) return;
    getFieldById(id)
      .then((res) => setField(res.data))
      .catch((err) => console.error("❌ Lỗi load field:", err))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-emerald-500 border-t-transparent mb-4"></div>
          <p className="text-lg text-gray-600 font-medium animate-pulse">
            ⏳ Đang tải thông tin sân...
          </p>
        </div>
      </div>
    );
  }

  if (!field) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center bg-white/80 backdrop-blur-xl p-12 rounded-3xl shadow-2xl border border-white/50">
          <FaTimesCircle className="mx-auto text-6xl text-red-500 mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Không tìm thấy sân!</h2>
          <p className="text-gray-600 mb-6">Sân bóng này có thể đã bị xóa hoặc không tồn tại.</p>
          <Link
            href="/admin/fields"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl hover:shadow-lg transition-all"
          >
            <FaArrowLeft /> Quay lại danh sách
          </Link>
        </div>
      </div>
    );
  }

  const images = Array.isArray(field.images) && field.images.length > 0 
    ? field.images 
    : ["/image/no-image.jpg"];

  const mainImage = images[selectedImage]
    ? `${BASE_URL}${images[selectedImage].startsWith("/") ? images[selectedImage] : `/${images[selectedImage]}`}`
    : "/image/no-image.jpg";

  const statusConfig = {
    available: { label: "Đang hoạt động", color: "bg-green-500", icon: <FaCheckCircle /> },
    maintenance: { label: "Bảo trì", color: "bg-yellow-500", icon: <FaTimesCircle /> },
    unavailable: { label: "Không khả dụng", color: "bg-red-500", icon: <FaTimesCircle /> },
  };

  const status = statusConfig[field.status] || statusConfig.available;

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50 py-8 px-4 relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-4 rounded-2xl shadow-lg">
                <FaFutbol className="text-3xl text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-extrabold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  Chi tiết sân bóng
                </h1>
                <p className="text-gray-500 text-sm mt-1">Thông tin đầy đủ về sân</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Link
                href={`/admin/fields/edit/${id}`}
                className="group inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 px-6 py-3 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 font-medium text-white"
              >
                <FaEdit className="transition-transform group-hover:rotate-12" />
                Chỉnh sửa
              </Link>
              <Link
                href="/admin/fields"
                className="group inline-flex items-center gap-2 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-emerald-500 hover:to-teal-500 px-6 py-3 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 font-medium text-gray-700 hover:text-white"
              >
                <FaArrowLeft className="transition-transform group-hover:-translate-x-1" />
                Quay lại
              </Link>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Images Section */}
          <div className="lg:col-span-2 bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <FaStar className="text-yellow-500" />
              Hình ảnh sân
            </h2>
            
            {/* Main Image */}
            <div className="relative rounded-2xl overflow-hidden shadow-2xl mb-4 group">
              <img
                src={mainImage}
                alt={field.name}
                className="w-full h-96 object-cover transition-transform duration-500 group-hover:scale-110"
                onError={(e) => (e.target.src = "/image/no-image.jpg")}
              />
              <div className="absolute bottom-4 right-4 bg-black/70 text-white px-4 py-2 rounded-xl font-semibold">
                {selectedImage + 1} / {images.length}
              </div>
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="grid grid-cols-4 md:grid-cols-6 gap-3">
                {images.map((url, i) => {
                  const thumbUrl = url
                    ? `${BASE_URL}${url.startsWith("/") ? url : `/${url}`}`
                    : "/image/no-image.jpg";
                  return (
                    <div
                      key={i}
                      onClick={() => setSelectedImage(i)}
                      className={`relative rounded-xl overflow-hidden cursor-pointer shadow-lg transition-all duration-300 transform hover:scale-110 ${
                        selectedImage === i
                          ? "ring-4 ring-emerald-500 scale-105"
                          : "hover:ring-2 hover:ring-gray-300"
                      }`}
                    >
                      <img
                        src={thumbUrl}
                        alt={`Thumbnail ${i + 1}`}
                        className="w-full h-20 object-cover"
                        onError={(e) => (e.target.src = "/image/no-image.jpg")}
                      />
                      {selectedImage === i && (
                        <div className="absolute inset-0 bg-emerald-500/30 flex items-center justify-center">
                          <FaCheckCircle className="text-white text-2xl" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Info Section */}
          <div className="space-y-6">
            {/* Basic Info Card */}
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">{field.name}</h2>
              
              <div className="space-y-4">
                {/* Type */}
                <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
                  <div className="bg-blue-500 p-2 rounded-lg">
                    <FaUsers className="text-white text-xl" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium">Loại sân</p>
                    <p className="font-bold text-gray-800">Sân {field.type}</p>
                  </div>
                </div>

                {/* Price */}
                <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl">
                  <div className="bg-green-500 p-2 rounded-lg">
                    <FaDollarSign className="text-white text-xl" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium">Giá thuê</p>
                    <p className="font-bold text-emerald-600 text-lg">
                      {field.pricePerHour?.toLocaleString("vi-VN")} đ<span className="text-sm text-gray-500">/giờ</span>
                    </p>
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-red-50 to-pink-50 rounded-xl">
                  <div className="bg-red-500 p-2 rounded-lg">
                    <FaMapMarkerAlt className="text-white text-xl" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 font-medium">Địa điểm</p>
                    <p className="font-semibold text-gray-800 text-sm">{field.location || "Chưa cập nhật"}</p>
                  </div>
                </div>

                {/* Status */}
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <div className={`${status.color} p-2 rounded-lg`}>
                    <span className="text-white text-xl">{status.icon}</span>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium">Trạng thái</p>
                    <p className="font-bold text-gray-800">{status.label}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Amenities Card */}
            {((Array.isArray(field.amenities) && field.amenities.length > 0) || field.amenities) && (
              <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <FaStar className="text-yellow-500" />
                  Tiện ích
                </h3>
                <div className="space-y-2">
                  {(Array.isArray(field.amenities) ? field.amenities : [field.amenities]).map((amenity, i) => (
                    <div key={i} className="flex items-center gap-2 text-gray-700">
                      <FaCheckCircle className="text-green-500" />
                      <span>{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Description Section */}
        {field.description && (
          <div className="mt-6 bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <FaFutbol className="text-emerald-600" />
              Mô tả chi tiết
            </h3>
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
              {field.description}
            </p>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes blob {
          0%,
          100% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}