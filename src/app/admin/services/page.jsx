"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  FaConciergeBell,
  FaPlus,
  FaEdit,
  FaTrash,
  FaSearch,
  FaToggleOn,
  FaToggleOff,
} from "react-icons/fa";

const PAGE_SIZE = 10;

export default function ServicesPage() {
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);

  const [page, setPage] = useState(1);
  const totalPages = useMemo(() => Math.max(1, Math.ceil(total / PAGE_SIZE)), [total]);

  const [status, setStatus] = useState("all"); // all | active | inactive
  const [searchText, setSearchText] = useState("");
  const [query, setQuery] = useState("");

  // debounce search
  useEffect(() => {
    const t = setTimeout(() => {
      setQuery(searchText.trim());
      setPage(1);
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
          status,
          page: String(page),
          limit: String(PAGE_SIZE),
        });
        const res = await fetch(`/api/services?${params.toString()}`, { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to fetch services");
        const data = await res.json();
        if (!cancelled) {
          const arr = Array.isArray(data) ? data : data.items || [];
          setItems(arr);
          setTotal(data.total ?? arr.length);
        }
      } catch (e) {
        console.error(e);
        if (!cancelled) {
          setItems([]);
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
  }, [query, status, page]);

  function goPage(p) {
    if (p < 1 || p > totalPages) return;
    setPage(p);
  }

  async function handleToggleActive(s) {
    setBusyId(s.id);
    try {
      const res = await fetch(`/api/services/${s.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: !s.active }),
      });
      if (!res.ok) throw new Error("Toggle failed");
      setItems((prev) => prev.map((x) => (x.id === s.id ? { ...x, active: !x.active } : x)));
    } catch (e) {
      alert("Cập nhật trạng thái thất bại.");
    } finally {
      setBusyId(null);
    }
  }

  async function handleDelete(id) {
    if (!confirm("Xóa dịch vụ này? Hành động không thể hoàn tác.")) return;
    setBusyId(id);
    try {
      const res = await fetch(`/api/services/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      setItems((prev) => prev.filter((x) => x.id !== id));
      setTotal((t) => Math.max(0, t - 1));
    } catch (e) {
      alert("Xóa thất bại. Vui lòng thử lại.");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <FaConciergeBell className="text-2xl text-green-600" />
          <h1 className="text-2xl font-bold">Quản lý dịch vụ</h1>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center gap-3 mb-4">
        <div className="relative flex-1">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 opacity-60" />
          <input
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Tìm theo tên, danh mục, đơn vị…"
            className="w-full pl-10 pr-3 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600"
          />
        </div>

        <select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            setPage(1);
          }}
          className="border rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-600"
        >
          <option value="all">Tất cả trạng thái</option>
          <option value="active">Đang hoạt động</option>
          <option value="inactive">Ngừng hoạt động</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-gray-700">
              <tr>
                <th className="text-left px-4 py-3">Tên dịch vụ</th>
                <th className="text-left px-4 py-3">Danh mục</th>
                <th className="text-left px-4 py-3">Đơn vị</th>
                <th className="text-right px-4 py-3">Giá</th>
                <th className="text-center px-4 py-3">Trạng thái</th>
                <th className="text-right px-4 py-3">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-gray-500">
                    Đang tải danh sách dịch vụ...
                  </td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-gray-500">
                    Không có dữ liệu phù hợp.
                  </td>
                </tr>
              ) : (
                items.map((s) => (
                  <tr key={s.id} className="border-t">
                    <td className="px-4 py-3 font-medium">{s.name}</td>
                    <td className="px-4 py-3">{s.category || "-"}</td>
                    <td className="px-4 py-3">{s.unit || "-"}</td>
                    <td className="px-4 py-3 text-right">
                      {typeof s.price === "number"
                        ? s.price.toLocaleString("vi-VN") + " đ"
                        : "-"}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center">
                        <button
                          onClick={() => handleToggleActive(s)}
                          disabled={busyId === s.id}
                          className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${
                            s.active
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-100 text-gray-600"
                          }`}
                          title={s.active ? "Đang hoạt động" : "Ngừng hoạt động"}
                        >
                          {s.active ? <FaToggleOn /> : <FaToggleOff />}
                          {s.active ? "Hoạt động" : "Ngừng"}
                        </button>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <Link
                          href={`/admin/services/${s.id}/edit`}
                          className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-amber-500 hover:bg-amber-600 text-white"
                        >
                          <FaEdit /> Sửa
                        </Link>
                        <button
                          onClick={() => handleDelete(s.id)}
                          disabled={busyId === s.id}
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
              Trang {page}/{totalPages} • Tổng {total} dịch vụ
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

      {/* Gợi ý schema */}
      <div className="mt-6 text-xs text-gray-500">
        <p>
          <strong>Trường dữ liệu dịch vụ gợi ý:</strong> <code>id</code>,{" "}
          <code>name</code>, <code>category</code>, <code>unit</code> (VD: chai, lon, giờ),{" "}
          <code>price</code> (number), <code>active</code> (boolean),{" "}
          <code>created_at</code>.
        </p>
      </div>
    </div>
  );
}
