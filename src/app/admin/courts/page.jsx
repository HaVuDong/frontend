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
  FaCalendarAlt,
} from "react-icons/fa";

const PAGE_SIZE = 10;

export default function CourtsPage() {
  const [courts, setCourts] = useState([]);
  const [total, setTotal] = useState(0);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(total / PAGE_SIZE)),
    [total]
  );

  // debounce search text -> query
  const [searchText, setSearchText] = useState("");
  useEffect(() => {
    const t = setTimeout(() => {
      setPage(1);
      setQuery(searchText.trim());
    }, 350);
    return () => clearTimeout(t);
  }, [searchText]);

  // load data
  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          query,
          page: String(page),
          limit: String(PAGE_SIZE),
        });
        // TODO: nếu dùng PHP backend, đổi URL dưới đây cho phù hợp
        const res = await fetch(`/api/courts?${params.toString()}`, {
          cache: "no-store",
        });
        if (!res.ok) throw new Error("Failed to fetch courts");
        const data = await res.json();
        if (!cancelled) {
          setCourts(data.items || []);
          setTotal(data.total ?? (data.items ? data.items.length : 0));
        }
      } catch (e) {
        console.error(e);
        if (!cancelled) {
          setCourts([]);
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

  async function handleDelete(id) {
    if (!confirm("Xóa sân này? Hành động không thể hoàn tác.")) return;
    setBusyId(id);
    try {
      const res = await fetch(`/api/courts/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      setCourts((prev) => prev.filter((c) => c.id !== id));
      setTotal((t) => Math.max(0, t - 1));
    } catch (e) {
      alert("Xóa thất bại. Vui lòng thử lại.");
    } finally {
      setBusyId(null);
    }
  }

  async function handleToggleActive(court) {
    setBusyId(court.id);
    try {
      const res = await fetch(`/api/courts/${court.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: !court.active }),
      });
      if (!res.ok) throw new Error("Toggle failed");
      setCourts((prev) =>
        prev.map((c) => (c.id === court.id ? { ...c, active: !c.active } : c))
      );
    } catch (e) {
      alert("Cập nhật trạng thái thất bại.");
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
      </div>

      {/* Toolbar: Search */}
      <div className="flex gap-3 mb-4">
        <div className="relative flex-1 max-w-lg">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 opacity-60" />
          <input
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Tìm theo tên, địa chỉ, loại sân..."
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
                <th className="text-left px-4 py-3">Địa điểm</th>
                <th className="text-left px-4 py-3">Loại sân</th>
                <th className="text-right px-4 py-3">Giá/giờ</th>
                <th className="text-center px-4 py-3">Trạng thái</th>
                <th className="text-right px-4 py-3">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-gray-500">
                    Đang tải danh sách sân...
                  </td>
                </tr>
              ) : courts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-gray-500">
                    Không có dữ liệu phù hợp.
                  </td>
                </tr>
              ) : (
                courts.map((c) => (
                  <tr key={c.id} className="border-t">
                    <td className="px-4 py-3 font-medium">{c.name}</td>
                    <td className="px-4 py-3">{c.location || "-"}</td>
                    <td className="px-4 py-3">{c.type || "5v5 / 7v7 / 11v11"}</td>
                    <td className="px-4 py-3 text-right">
                      {typeof c.price_per_hour === "number"
                        ? c.price_per_hour.toLocaleString("vi-VN") + " đ"
                        : "-"}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center">
                        <button
                          onClick={() => handleToggleActive(c)}
                          disabled={busyId === c.id}
                          className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${
                            c.active
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-100 text-gray-600"
                          }`}
                          title={c.active ? "Đang hoạt động" : "Ngừng hoạt động"}
                        >
                          {c.active ? <FaToggleOn /> : <FaToggleOff />}
                          {c.active ? "Hoạt động" : "Ngừng"}
                        </button>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        {/* Xem lịch của từng sân (nếu bạn muốn lọc theo sân) */}
                        <Link
                          href={`/admin/schedule?courtId=${encodeURIComponent(c.id)}`}
                          className="inline-flex items-center gap-2 px-3 py-1 rounded-lg border hover:bg-gray-50"
                          title="Xem lịch sân này"
                        >
                          <FaCalendarAlt /> Lịch
                        </Link>

                        <Link
                          href={`/admin/courts/${c.id}/edit`}
                          className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-amber-500 hover:bg-amber-600 text-white"
                        >
                          <FaEdit /> Sửa
                        </Link>
                        <button
                          onClick={() => handleDelete(c.id)}
                          disabled={busyId === c.id}
                          className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-red-600 hover:bg-red-700 text-white"
                        >
                          <FaTrash /> Xóa
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
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

      {/* Gợi ý: đồng bộ với trang lịch */}
      <div className="mt-6 text-xs text-gray-500 space-y-1">
        <p>
          Nút <strong>“Xem lịch đặt sân”</strong> ở trên dẫn tới <code>/admin/schedule</code>.
          Hãy đặt file lịch của bạn tại: <code>src/app/admin/schedule/page.jsx</code>
          (dán code “Lịch Đặt Sân Bóng Đá” bạn đã gửi vào đó).
        </p>
        <p>
          Nếu muốn lọc lịch theo từng sân, đọc param <code>courtId</code> trong trang lịch:
          <code> const params = new URLSearchParams(window.location.search); const courtId = params.get("courtId");</code>
          rồi highlight/cố định hàng tương ứng (VD: “Sân 5-1”).
        </p>
      </div>
    </div>
  );
}
