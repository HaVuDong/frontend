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

  // ✅ Khai báo BASE_URL chuẩn hóa
  const BASE_URL = process.env.NEXT_PUBLIC_API_URL?.replace("/v1", "") || "";

  // load data
  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      try {
        const res = await getFields();
        if (!cancelled) {
          const items = res.data?.data || res.data || res || [];
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
      toast.success("Đã xóa sân thành công");
    } catch (e) {
      console.error(e);
      toast.error("Xóa thất bại, thử lại sau!");
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
      toast.success("Cập nhật trạng thái thành công");
    } catch (e) {
      toast.error("Không thể cập nhật trạng thái!");
    } finally {
      setBusyId(null);
    }
  }

  function goPage(p) {
    if (p < 1 || p > totalPages) return;
    setPage(p);
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <FaFutbol className="text-2xl text-green-600" />
          <h1 className="text-2xl font-bold">Quản lý sân bóng</h1>
        </div>
        <Link
          href="/admin/fields/add"
          className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow"
        >
          <FaPlus /> Thêm sân
        </Link>
      </div>

      {/* Search */}
      <div className="flex gap-3 mb-4">
        <div className="relative flex-1 max-w-lg">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 opacity-60" />
          <input
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Tìm sân theo tên, vị trí..."
            className="w-full pl-10 pr-3 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-gray-700">
              <tr>
                <th className="text-left px-4 py-3">Tên sân</th>
                <th className="text-left px-4 py-3">Loại sân</th>
                <th className="text-left px-4 py-3">Địa điểm</th>
                <th className="text-center px-4 py-3">Hình ảnh</th>
                <th className="text-right px-4 py-3">Giá/giờ</th>
                <th className="text-center px-4 py-3">Trạng thái</th>
                <th className="text-right px-4 py-3">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-gray-500">
                    Đang tải danh sách sân...
                  </td>
                </tr>
              ) : fields.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-gray-500">
                    Không có dữ liệu phù hợp.
                  </td>
                </tr>
              ) : (
                fields.map((f) => {
                  const imgUrl = f.images?.[0]
                    ? `${BASE_URL}${f.images[0].startsWith("/") ? f.images[0] : `/${f.images[0]}`}`
                    : "/image/no-image.jpg";

                  return (
                    <tr key={f._id} className="border-t">
                      <td className="px-4 py-3 font-medium">{f.name}</td>
                      <td className="px-4 py-3">{f.type}</td>
                      <td className="px-4 py-3">{f.location || "-"}</td>
                      <td className="px-4 py-3 text-center">
                        <img
                          src={imgUrl}
                          alt={f.name}
                          className="w-16 h-16 object-cover rounded-lg border mx-auto"
                        />
                      </td>
                      <td className="px-4 py-3 text-right">
                        {f.pricePerHour
                          ? f.pricePerHour.toLocaleString("vi-VN") + " đ"
                          : "-"}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => handleToggleActive(f)}
                          disabled={busyId === f._id}
                          className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${
                            f.isActive
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-100 text-gray-600"
                          }`}
                          title={f.isActive ? "Đang hoạt động" : "Ngừng hoạt động"}
                        >
                          {f.isActive ? <FaToggleOn /> : <FaToggleOff />}
                          {f.isActive ? "Hoạt động" : "Ngừng"}
                        </button>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex justify-end gap-2">
                          <Link
                            href={`/admin/fields/${f._id}`}
                            className="inline-flex items-center gap-2 px-3 py-1 rounded-lg border hover:bg-gray-50"
                          >
                            <FaEye /> Xem
                          </Link>
                          <Link
                            href={`/admin/fields/edit/${f._id}`}
                            className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-amber-500 hover:bg-amber-600 text-white"
                          >
                            <FaEdit /> Sửa
                          </Link>
                          <button
                            onClick={() => handleDelete(f._id)}
                            disabled={busyId === f._id}
                            className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-red-600 hover:bg-red-700 text-white"
                          >
                            <FaTrash /> Xóa
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
          <div className="flex items-center justify-between px-4 py-3 bg-gray-50">
            <span className="text-sm text-gray-600">
              Trang {page}/{totalPages} • Tổng {total} sân
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => goPage(page - 1)}
                disabled={page <= 1}
                className="px-3 py-1 rounded-lg border hover:bg-gray-100 disabled:opacity-50"
              >
                Trước
              </button>
              <button
                onClick={() => goPage(page + 1)}
                disabled={page >= totalPages}
                className="px-3 py-1 rounded-lg border hover:bg-gray-100 disabled:opacity-50"
              >
                Sau
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
