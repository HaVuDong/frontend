"use client";
import { useEffect, useState } from "react";
import { getFields } from "@/services/fieldService";
import { useRouter } from "next/navigation";
import Footer from "@/components/site/layout/Footer";

export default function FieldList() {
  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  useEffect(() => {
    setLoading(true);
    getFields()
      .then((res) => {
        setFields(res.data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("❌ Lỗi fetch fields:", err);
        setLoading(false);
      });
  }, []);

  // Filter logic
  const filteredFields = fields.filter((f) => {
    const matchSearch = f.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.location?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchFilter = filter === "all" ||
      (filter === "available" && f.status === "available") ||
      (filter === "unavailable" && f.status !== "available");
    return matchSearch && matchFilter;
  });

  // Navigate to field detail
  const handleFieldClick = (fieldId) => {
    router.push(`/site/fields/${fieldId}`);
  };

  return (
    <>
      <div className="space-y-6">
        {/* Header Section with Search & Filter */}
        <div className="bg-white rounded-2xl shadow-xl p-6 animate-fadeIn">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
            {/* Title & Count */}
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-teal-500 rounded-xl flex items-center justify-center shadow-lg animate-pulse">
                <span className="text-3xl">🏟️</span>
              </div>
              <div>
                <h2 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-teal-600">
                  Danh Sách Sân Bóng
                </h2>
                <p className="text-sm text-gray-600 font-semibold">
                  Tìm thấy <span className="text-green-600 font-black">{filteredFields.length}</span> sân
                </p>
              </div>
            </div>

            {/* Search Bar */}
            <div className="w-full lg:w-auto flex-1 lg:max-w-md">
              <div className="relative group">
                <input
                  type="text"
                  placeholder="🔍 Tìm kiếm sân bóng..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-5 py-3 pl-12 rounded-xl border-2 border-gray-200 focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all duration-300 font-semibold text-gray-700 placeholder:text-gray-400 group-hover:border-green-300"
                />
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl group-focus-within:scale-110 transition-transform duration-300">
                  🔍
                </span>
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-gray-200 hover:bg-red-500 rounded-full flex items-center justify-center text-xs font-bold text-gray-600 hover:text-white transition-all duration-300 hover:scale-110"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>

            {/* Filter Buttons */}
            <div className="flex items-center gap-2 bg-gray-100 p-1.5 rounded-xl">
              <button
                onClick={() => setFilter("all")}
                className={`px-4 py-2 rounded-lg font-bold text-sm transition-all duration-300 ${
                  filter === "all"
                    ? "bg-gradient-to-r from-green-500 to-teal-500 text-white shadow-lg scale-105"
                    : "text-gray-600 hover:bg-white hover:shadow"
                }`}
              >
                🏟️ Tất cả
              </button>
              <button
                onClick={() => setFilter("available")}
                className={`px-4 py-2 rounded-lg font-bold text-sm transition-all duration-300 ${
                  filter === "available"
                    ? "bg-gradient-to-r from-green-500 to-teal-500 text-white shadow-lg scale-105"
                    : "text-gray-600 hover:bg-white hover:shadow"
                }`}
              >
                ✅ Còn trống
              </button>
              <button
                onClick={() => setFilter("unavailable")}
                className={`px-4 py-2 rounded-lg font-bold text-sm transition-all duration-300 ${
                  filter === "unavailable"
                    ? "bg-gradient-to-r from-green-500 to-teal-500 text-white shadow-lg scale-105"
                    : "text-gray-600 hover:bg-white hover:shadow"
                }`}
              >
                🔒 Đã đặt
              </button>
            </div>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-fadeIn">
          <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-5 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/90 text-xs font-semibold mb-1">Tổng số sân</p>
                <p className="text-white text-3xl font-black">{fields.length}</p>
              </div>
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
                <span className="text-2xl">🏟️</span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-5 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/90 text-xs font-semibold mb-1">Còn trống</p>
                <p className="text-white text-3xl font-black">
                  {fields.filter(f => f.status === "available").length}
                </p>
              </div>
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
                <span className="text-2xl">✅</span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-500 to-amber-600 rounded-2xl p-5 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/90 text-xs font-semibold mb-1">Đã đặt</p>
                <p className="text-white text-3xl font-black">
                  {fields.filter(f => f.status !== "available").length}
                </p>
              </div>
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
                <span className="text-2xl">🔒</span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl p-5 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/90 text-xs font-semibold mb-1">Kết quả</p>
                <p className="text-white text-3xl font-black">{filteredFields.length}</p>
              </div>
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
                <span className="text-2xl">🔍</span>
              </div>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="bg-white rounded-2xl shadow-xl p-16 animate-fadeIn">
            <div className="flex flex-col items-center gap-6">
              <div className="relative">
                <div className="w-20 h-20 border-4 border-green-200 rounded-full"></div>
                <div className="w-20 h-20 border-4 border-green-500 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
              </div>
              <div className="text-center">
                <p className="text-xl font-black text-gray-800 mb-2">Đang tải danh sách sân...</p>
                <p className="text-sm text-gray-600">Vui lòng chờ trong giây lát</p>
              </div>
            </div>
          </div>
        ) : filteredFields.length === 0 ? (
          /* Empty State */
          <div className="bg-white rounded-2xl shadow-xl p-16 text-center animate-fadeIn">
            <div className="flex flex-col items-center gap-6">
              <div className="w-32 h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center animate-bounce">
                <span className="text-6xl">😔</span>
              </div>
              <div>
                <h3 className="text-2xl font-black text-gray-800 mb-3">
                  Không tìm thấy sân nào
                </h3>
                <p className="text-gray-600 mb-6">
                  {searchTerm 
                    ? `Không có kết quả cho "${searchTerm}"`
                    : "Hiện tại chưa có sân bóng nào"}
                </p>
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-teal-500 text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl hover:from-green-600 hover:to-teal-600 transition-all duration-300 hover:scale-105"
                  >
                    <span>🔄</span>
                    Xóa bộ lọc
                  </button>
                )}
              </div>
            </div>
          </div>
        ) : (
          /* Fields Grid - Beautiful Card Design */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFields.map((field, index) => (
              <div
                key={field._id}
                className="animate-fadeIn group cursor-pointer"
                style={{
                  animationDelay: `${index * 0.1}s`,
                  animationFillMode: "both"
                }}
                onClick={() => handleFieldClick(field._id)}
              >
                <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden group-hover:scale-105 group-hover:-translate-y-2 border-2 border-transparent group-hover:border-green-400">
                  {/* Card Header with Gradient */}
                  <div className="relative h-48 bg-gradient-to-br from-green-400 via-teal-400 to-blue-500 overflow-hidden">
                    {/* Animated Background Pattern */}
                    <div className="absolute inset-0 opacity-20">
                      <div className="absolute top-0 left-0 w-32 h-32 bg-white rounded-full -translate-x-16 -translate-y-16 group-hover:scale-150 transition-transform duration-700"></div>
                      <div className="absolute bottom-0 right-0 w-40 h-40 bg-white rounded-full translate-x-20 translate-y-20 group-hover:scale-150 transition-transform duration-700"></div>
                    </div>
                    
                    {/* Field Icon */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-24 h-24 bg-white/30 backdrop-blur-sm rounded-2xl flex items-center justify-center group-hover:rotate-12 group-hover:scale-110 transition-all duration-500 shadow-2xl">
                        <span className="text-6xl">⚽</span>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div className="absolute top-4 right-4">
                      <span className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-black shadow-lg backdrop-blur-sm ${
                        field.status === "available"
                          ? "bg-green-500/90 text-white"
                          : "bg-red-500/90 text-white"
                      }`}>
                        {field.status === "available" ? "✅ Còn trống" : "🔒 Đã đặt"}
                      </span>
                    </div>

                    {/* Field Type Badge */}
                    <div className="absolute top-4 left-4">
                      <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-black bg-white/90 text-gray-800 shadow-lg backdrop-blur-sm">
                        👥 {field.type || "7 người"}
                      </span>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-5 space-y-4">
                    {/* Field Name */}
                    <div>
                      <h3 className="text-xl font-black text-gray-800 mb-1 group-hover:text-green-600 transition-colors duration-300 line-clamp-1">
                        {field.name}
                      </h3>
                      <div className="h-1 w-16 bg-gradient-to-r from-green-500 to-teal-500 rounded-full group-hover:w-full transition-all duration-500"></div>
                    </div>

                    {/* Location */}
                    <div className="flex items-start gap-3 bg-gradient-to-r from-purple-50 to-pink-50 p-3 rounded-xl group-hover:from-purple-100 group-hover:to-pink-100 transition-all duration-300">
                      <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:rotate-12 transition-transform duration-300">
                        <span className="text-sm">📍</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-600 font-semibold mb-0.5">Địa chỉ</p>
                        <p className="text-sm font-bold text-gray-800 line-clamp-2">
                          {field.location || "Chưa cập nhật"}
                        </p>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="flex items-center gap-3 bg-gradient-to-r from-orange-50 to-amber-50 p-3 rounded-xl group-hover:from-orange-100 group-hover:to-amber-100 transition-all duration-300">
                      <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-amber-500 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:rotate-12 transition-transform duration-300">
                        <span className="text-sm">💰</span>
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-gray-600 font-semibold mb-0.5">Giá thuê</p>
                        <p className="text-lg font-black text-orange-600">
                          {field.pricePerHour 
                            ? `${Number(field.pricePerHour).toLocaleString()}đ`
                            : "Liên hệ"
                          }
                          <span className="text-xs font-semibold text-gray-600">/giờ</span>
                        </p>
                      </div>
                    </div>

                    {/* Action Button */}
                    <button
                      className="w-full bg-gradient-to-r from-green-500 to-teal-500 text-white py-3 rounded-xl font-bold shadow-md group-hover:shadow-xl group-hover:from-green-600 group-hover:to-teal-600 transition-all duration-300 flex items-center justify-center gap-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleFieldClick(field._id);
                      }}
                    >
                      <span>👁️</span>
                      <span>Xem chi tiết</span>
                      <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
                    </button>
                  </div>

                  {/* Hover Glow Effect */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-green-400 to-teal-400 opacity-0 group-hover:opacity-20 transition-opacity duration-500 pointer-events-none"></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Floating Action Button */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-8 right-8 w-14 h-14 bg-gradient-to-br from-green-500 to-teal-500 text-white rounded-full shadow-2xl hover:shadow-3xl hover:scale-110 transition-all duration-300 flex items-center justify-center font-bold text-xl z-50 group"
        >
          <span className="group-hover:-translate-y-1 transition-transform duration-300">⬆️</span>
        </button>

        {/* Add required CSS animations */}
        <style jsx>{`
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          .animate-fadeIn {
            animation: fadeIn 0.6s ease-out;
          }
          .line-clamp-1 {
            display: -webkit-box;
            -webkit-line-clamp: 1;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }
          .line-clamp-2 {
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }
        `}</style>
      </div>
      
      <Footer />
    </>
  );
}
