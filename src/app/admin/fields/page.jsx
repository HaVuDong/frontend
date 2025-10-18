"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  FaFutbol,
  FaPlus,
  FaEdit,
  FaTrash,
  FaSearch,
  FaToggleOn,
  FaToggleOff,
  FaEye,
  FaMapMarkerAlt,
  FaSync,
  FaImage,
} from "react-icons/fa";
import { getFields, deleteField, updateField } from "@/services/fieldService";
import { toast } from "react-toastify";

const PAGE_SIZE = 10;

export default function FieldsPage() {
  const [fields, setFields] = useState([]);
  const [total, setTotal] = useState(0);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);
  const [imageModal, setImageModal] = useState(null);

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(total / PAGE_SIZE)),
    [total]
  );

  // debounce search
  const [searchText, setSearchText] = useState("");
  useEffect(() => {
    const t = setTimeout(() => {
      setPage(1);
      setQuery(searchText.trim());
    }, 350);
    return () => clearTimeout(t);
  }, [searchText]);

  // ✅ Hàm xử lý URL ảnh thông minh - ĐÃ CẢI THIỆN
  const getImageUrl = (images) => {
    if (!images || images.length === 0) return "/image/no-image.jpg";
    
    const firstImage = images[0];
    const BASE_URL = process.env.NEXT_PUBLIC_API_URL?.replace("/v1", "") || "";
    
    // Nếu là URL đầy đủ (http/https)
    if (firstImage.startsWith("http://") || firstImage.startsWith("https://")) {
      return firstImage;
    }
    
    // Nếu là đường dẫn tương đối
    if (firstImage.startsWith("/")) {
      return `${BASE_URL}${firstImage}`;
    }
    
    // Nếu không có dấu / ở đầu
    return `${BASE_URL}/${firstImage}`;
  };

  // load data
  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      try {
        const res = await getFields();
        if (!cancelled) {
          const items = res.data?.data || res.data || res || [];
          
          // ✅ Debug: Log dữ liệu ảnh
          console.log("📸 Sample field images:", items[0]?.images);
          
          const filtered = query
            ? items.filter((f) =>
                f.name.toLowerCase().includes(query.toLowerCase())
              )
            : items;

          const start = (page - 1) * PAGE_SIZE;
          const paginated = filtered.slice(start, start + PAGE_SIZE);

          setFields(paginated);
          setTotal(filtered.length);
        }
      } catch (e) {
        console.error("❌ Lỗi tải sân:", e);
        if (!cancelled) {
          setFields([]);
          setTotal(0);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [query, page]);

  // Xóa sân
  async function handleDelete(id) {
    if (!confirm("Bạn chắc chắn muốn xóa sân này?")) return;
    setBusyId(id);
    try {
      await deleteField(id);
      setFields((prev) => prev.filter((f) => f._id !== id));
      setTotal((t) => Math.max(0, t - 1));
      toast.success("🗑️ Đã xóa sân thành công!");
    } catch (e) {
      console.error(e);
      toast.error("❌ Xóa thất bại, thử lại sau!");
    } finally {
      setBusyId(null);
    }
  }

  // Toggle trạng thái hoạt động
  async function handleToggleActive(field) {
    setBusyId(field._id);
    try {
      await updateField(field._id, { isActive: !field.isActive });
      setFields((prev) =>
        prev.map((f) =>
          f._id === field._id ? { ...f, isActive: !f.isActive } : f
        )
      );
      toast.success("✅ Cập nhật trạng thái thành công!");
    } catch (e) {
      toast.error("❌ Không thể cập nhật trạng thái!");
    } finally {
      setBusyId(null);
    }
  }

  function goPage(p) {
    if (p < 1 || p > totalPages) return;
    setPage(p);
  }

  // Reload data
  function handleReload() {
    setQuery("");
    setSearchText("");
    setPage(1);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header với hiệu ứng gradient */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 mb-6 border border-gray-100 backdrop-blur-sm bg-opacity-95">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-4 rounded-2xl shadow-lg transform hover:scale-110 transition-transform duration-300">
                <FaFutbol className="text-3xl text-white animate-pulse" />
              </div>
              <div>
                <h1 className="text-3xl font-extrabold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                  Quản lý sân bóng
                </h1>
                <p className="text-gray-500 text-sm mt-1">
                  Quản lý và theo dõi tất cả các sân bóng
                </p>
              </div>
            </div>
            <Link
              href="/admin/fields/add"
              className="group relative inline-flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 font-semibold"
            >
              <FaPlus className="group-hover:rotate-90 transition-transform duration-300" />
              <span>Thêm sân mới</span>
              <div className="absolute inset-0 rounded-xl bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
            </Link>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6 border border-gray-100">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
              <input
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder="🔍 Tìm kiếm theo tên sân, vị trí..."
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 hover:border-green-300"
              />
            </div>
            <button
              onClick={handleReload}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 font-semibold"
            >
              <FaSync className="hover:rotate-180 transition-transform duration-500" />
              Làm mới
            </button>
          </div>

          {/* Stats */}
          <div className="mt-4 flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-gray-600">
                Tổng số sân: <span className="font-bold text-green-600">{total}</span>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
              <span className="text-gray-600">
                Trang: <span className="font-bold text-blue-600">{page}/{totalPages}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Table với hiệu ứng đẹp */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gradient-to-r from-green-600 via-emerald-600 to-blue-600 text-white">
                  <th className="text-left px-6 py-4 font-bold text-sm uppercase tracking-wider">
                    Tên sân
                  </th>
                  <th className="text-left px-6 py-4 font-bold text-sm uppercase tracking-wider">
                    Loại sân
                  </th>
                  <th className="text-left px-6 py-4 font-bold text-sm uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <FaMapMarkerAlt />
                      Địa điểm
                    </div>
                  </th>
                  <th className="text-center px-6 py-4 font-bold text-sm uppercase tracking-wider">
                    <div className="flex items-center justify-center gap-2">
                      <FaImage />
                      Hình ảnh
                    </div>
                  </th>
                  <th className="text-right px-6 py-4 font-bold text-sm uppercase tracking-wider">
                    Giá/giờ
                  </th>
                  <th className="text-center px-6 py-4 font-bold text-sm uppercase tracking-wider">
                    Trạng thái
                  </th>
                  <th className="text-right px-6 py-4 font-bold text-sm uppercase tracking-wider">
                    Hành động
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-20 text-center">
                      <div className="flex flex-col items-center gap-4">
                        <div className="relative">
                          <div className="w-16 h-16 border-4 border-green-200 border-t-green-600 rounded-full animate-spin"></div>
                          <FaFutbol className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-green-600 text-2xl animate-pulse" />
                        </div>
                        <p className="text-gray-500 font-medium">Đang tải danh sách sân...</p>
                      </div>
                    </td>
                  </tr>
                ) : fields.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-20 text-center">
                      <div className="flex flex-col items-center gap-4">
                        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center">
                          <FaFutbol className="text-5xl text-gray-300" />
                        </div>
                        <div>
                          <p className="text-gray-500 font-semibold text-lg mb-2">
                            Không tìm thấy sân nào
                          </p>
                          <p className="text-gray-400 text-sm">
                            Thử thay đổi từ khóa tìm kiếm hoặc thêm sân mới
                          </p>
                        </div>
                      </div>
                    </td>
                  </tr>
                ) : (
                  fields.map((f, index) => {
                    const imgUrl = getImageUrl(f.images);
                    const hasMultipleImages = f.images && f.images.length > 1;

                    // ✅ Debug: Log URL ảnh của từng sân
                    console.log(`🖼️ Field: ${f.name} | URL: ${imgUrl}`);

                    return (
                      <tr
                        key={f._id}
                        className="hover:bg-gradient-to-r hover:from-green-50 hover:to-blue-50 transition-all duration-300 group"
                        style={{
                          animation: `fadeInUp 0.3s ease-out ${index * 0.05}s both`,
                        }}
                      >
                        <td className="px-6 py-4">
                          <div className="font-semibold text-gray-800 group-hover:text-green-600 transition-colors duration-300">
                            {f.name}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 border border-blue-200">
                            {f.type}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 text-gray-600 text-sm">
                            <FaMapMarkerAlt className="text-red-500 flex-shrink-0" />
                            <span className="line-clamp-2">{f.location || "-"}</span>
                          </div>
                        </td>
                        
                        {/* ✅ PHẦN XỬ LÝ ẢNH ĐÃ ĐƯỢC CẢI THIỆN */}
                        <td className="px-6 py-4">
                          <div className="flex justify-center">
                            <div 
                              className="relative group/img cursor-pointer"
                              onClick={() => setImageModal(imgUrl)}
                            >
                              {/* ✅ Container với background trắng thay vì gradient */}
                              <div className="w-32 h-24 rounded-xl overflow-hidden border-2 border-gray-200 shadow-md group-hover/img:shadow-2xl transition-all duration-300 bg-white">
                                <img
                                  src={imgUrl}
                                  alt={f.name || "Sân bóng"}
                                  className="w-full h-full object-cover group-hover/img:scale-110 transition-transform duration-300"
                                  onError={(e) => {
                                    console.error(`❌ Lỗi load ảnh: ${imgUrl}`);
                                    e.target.src = "/image/no-image.jpg";
                                    e.target.onerror = null;
                                  }}
                                  onLoad={() => {
                                    console.log(`✅ Ảnh load thành công: ${imgUrl}`);
                                  }}
                                  loading="lazy"
                                  style={{
                                    display: 'block',
                                    opacity: 1,
                                    zIndex: 1,
                                  }}
                                />
                              </div>
                              
                              {/* ✅ Overlay chỉ hiện khi hover - với opacity-0 mặc định */}
                              <div className="absolute inset-0 bg-black rounded-xl transition-all duration-300 flex items-center justify-center pointer-events-none opacity-0 group-hover/img:opacity-40">
                                <FaEye className="text-white text-2xl transform scale-0 group-hover/img:scale-100 transition-all duration-300" />
                              </div>
                              
                              {/* ✅ Badge số lượng ảnh */}
                              {hasMultipleImages && (
                                <div className="absolute top-2 right-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white text-xs px-2.5 py-1 rounded-full font-bold shadow-lg backdrop-blur-sm z-10">
                                  +{f.images.length - 1}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                        
                        <td className="px-6 py-4 text-right">
                          <span className="font-bold text-lg text-green-600">
                            {f.pricePerHour
                              ? f.pricePerHour.toLocaleString("vi-VN")
                              : "0"}
                          </span>
                          <span className="text-gray-500 text-sm ml-1">đ</span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <button
                            onClick={() => handleToggleActive(f)}
                            disabled={busyId === f._id}
                            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-semibold text-sm transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg ${
                              f.isActive
                                ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600"
                                : "bg-gradient-to-r from-gray-400 to-gray-500 text-white hover:from-gray-500 hover:to-gray-600"
                            } ${busyId === f._id ? "opacity-50 cursor-not-allowed" : ""}`}
                            title={f.isActive ? "Đang hoạt động" : "Ngừng hoạt động"}
                          >
                            {busyId === f._id ? (
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            ) : f.isActive ? (
                              <FaToggleOn className="text-lg" />
                            ) : (
                              <FaToggleOff className="text-lg" />
                            )}
                            {f.isActive ? "Hoạt động" : "Ngừng"}
                          </button>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex justify-end gap-2">
                            <Link
                              href={`/admin/fields/${f._id}`}
                              className="group/btn inline-flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-blue-500 text-blue-600 hover:bg-blue-500 hover:text-white transition-all duration-300 font-semibold shadow-md hover:shadow-lg transform hover:scale-105"
                            >
                              <FaEye className="group-hover/btn:scale-110 transition-transform duration-300" />
                              Xem
                            </Link>
                            <Link
                              href={`/admin/fields/edit/${f._id}`}
                              className="group/btn inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white transition-all duration-300 font-semibold shadow-md hover:shadow-lg transform hover:scale-105"
                            >
                              <FaEdit className="group-hover/btn:rotate-12 transition-transform duration-300" />
                              Sửa
                            </Link>
                            <button
                              onClick={() => handleDelete(f._id)}
                              disabled={busyId === f._id}
                              className={`group/btn inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white transition-all duration-300 font-semibold shadow-md hover:shadow-lg transform hover:scale-105 ${
                                busyId === f._id ? "opacity-50 cursor-not-allowed" : ""
                              }`}
                            >
                              <FaTrash className="group-hover/btn:scale-110 transition-transform duration-300" />
                              Xóa
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {!loading && totalPages > 1 && (
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-gray-700">
                    Trang <span className="text-green-600">{page}</span> /{" "}
                    <span className="text-blue-600">{totalPages}</span>
                  </span>
                  <span className="text-gray-400">•</span>
                  <span className="text-sm text-gray-600">
                    Tổng <span className="font-bold text-green-600">{total}</span> sân
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => goPage(1)}
                    disabled={page <= 1}
                    className="px-4 py-2 rounded-lg border-2 border-gray-300 hover:border-green-500 hover:bg-green-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-semibold text-sm"
                  >
                    Đầu
                  </button>
                  <button
                    onClick={() => goPage(page - 1)}
                    disabled={page <= 1}
                    className="px-4 py-2 rounded-lg border-2 border-gray-300 hover:border-green-500 hover:bg-green-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-semibold text-sm"
                  >
                    ← Trước
                  </button>
                  
                  <div className="flex gap-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (page <= 3) {
                        pageNum = i + 1;
                      } else if (page >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = page - 2 + i;
                      }
                      
                      return (
                        <button
                          key={pageNum}
                          onClick={() => goPage(pageNum)}
                          className={`w-10 h-10 rounded-lg font-bold transition-all duration-300 transform hover:scale-110 ${
                            page === pageNum
                              ? "bg-gradient-to-r from-green-600 to-blue-600 text-white shadow-lg"
                              : "border-2 border-gray-300 hover:border-green-500 hover:bg-green-50"
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    onClick={() => goPage(page + 1)}
                    disabled={page >= totalPages}
                    className="px-4 py-2 rounded-lg border-2 border-gray-300 hover:border-green-500 hover:bg-green-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-semibold text-sm"
                  >
                    Sau →
                  </button>
                  <button
                    onClick={() => goPage(totalPages)}
                    disabled={page >= totalPages}
                    className="px-4 py-2 rounded-lg border-2 border-gray-300 hover:border-green-500 hover:bg-green-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-semibold text-sm"
                  >
                    Cuối
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal xem ảnh lớn */}
      {imageModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setImageModal(null)}
        >
          <div className="relative max-w-5xl w-full animate-zoomIn">
            <img
              src={imageModal}
              alt="Preview"
              className="w-full h-auto max-h-[90vh] object-contain rounded-2xl shadow-2xl"
              onClick={(e) => e.stopPropagation()}
              onError={(e) => {
                e.target.src = "/image/no-image.jpg";
              }}
            />
            <button
              onClick={() => setImageModal(null)}
              className="absolute -top-4 -right-4 bg-red-600 hover:bg-red-700 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transform hover:scale-110 hover:rotate-90 transition-all duration-300 font-bold text-2xl border-4 border-white"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* CSS Animation */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        @keyframes zoomIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        
        .animate-zoomIn {
          animation: zoomIn 0.3s ease-out;
        }
        
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}
