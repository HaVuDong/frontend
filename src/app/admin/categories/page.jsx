"use client";
import { useEffect, useState } from "react";
import CategoryItem from "@/components/admin/categories/CategoryItem";
import { getCategories } from "@/services/categoryService";
import Loading from "@/components/ui/Loading";
import FilterBoxCategory from "@/components/admin/filters/FilterBoxCategory";

export default function CategoryList() {
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(false);
  const [reload, setReload] = useState(0);
  const [page] = useState(1);
  const pageSize = 10;
  const [loading, setLoading] = useState(true);
  const [searchKey, setSearchKey] = useState("");
  const [viewOption, setViewOption] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("viewOption") || "preview";
    }
    return "preview";
  });

  useEffect(() => {
    if (viewOption) {
      localStorage.setItem("viewOption", viewOption);
    }
  }, [viewOption]);

  useEffect(() => {
    const fetchCategories = async () => {
      const params = {
        populate: "*",
        "pagination[page]": page,
        "pagination[pageSize]": pageSize,
      };

      if (searchKey?.trim()) {
        params["filters[categoryName][$contains]"] = searchKey.trim();
      }

      if (viewOption) {
        params["publicationState"] = viewOption;
      }

      try {
        setLoading(true);
        const data = await getCategories(params);
        setCategories(data.data || []);
        // Nếu bạn dùng phân trang sau này thì hãy thêm setPageCount
      } catch (err) {
        console.error("❌ Lỗi khi tải danh mục:", err);
        setError("Đã có lỗi xảy ra khi tải danh mục.");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [page, searchKey, viewOption, reload]);

  if (error) return <p className="text-red-500">{error}</p>;
  if (loading) return <Loading />;

  return (
    <div className="overflow-x-auto p-4">
      <FilterBoxCategory
        setsearchKey={setSearchKey}
        viewOption={viewOption}
        setViewOption={setViewOption}
      />

      <h1 className="text-xl font-semibold mb-4">Danh sách các danh mục</h1>
      <table className="table table-xs table-pin-rows table-pin-cols w-full">
        <thead>
          <tr>
            <th>STT</th>
            <th>Tên danh mục</th>
            <th>Trạng thái</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {categories.length > 0 ? (
            categories.map((c, i) => (
              <CategoryItem
                key={c.id}
                category={c}
                stt={(page - 1) * pageSize + i + 1}
                reload={reload}
                setReload={setReload}
              />
            ))
          ) : (
            <tr>
              <td colSpan="4" className="text-center text-gray-500 py-2">
                Không có danh mục nào.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
