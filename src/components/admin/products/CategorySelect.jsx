"use client";
import React, { useEffect, useState } from "react";
import { getCategories } from "@/services/categoryService";
import Loading from "@/components/ui/Loading";

export default function CategorySelect({ value, handleInputChange }) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await getCategories({ populate: "*" });
        setCategories(res.data);
      } catch (error) {
        console.error("Lỗi khi tải danh mục:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  if (loading) return <Loading />;

  return (
    <select
      name="category"
      value={value}
      onChange={handleInputChange}
      className="select select-bordered w-full"
    >
      <option value="">-- Chọn danh mục --</option>
      {categories.map((cat) => (
        <option key={cat.id} value={cat.id}>
          {cat.attributes.categoryName}
        </option>
      ))}
    </select>
  );
}
