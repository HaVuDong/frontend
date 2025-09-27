"use client";
import React, { useEffect, useState } from "react";
import { getBrands } from "@/services/brandService";
import Loading from "@/components/ui/Loading";

export default function BrandSelect({ value, handleInputChange }) {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const res = await getBrands({ populate: "*" });
        setBrands(res.data);
      } catch (error) {
        console.error("Lỗi khi tải thương hiệu:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBrands();
  }, []);

  if (loading) return <Loading />;

  return (
    <select
      name="brand"
      value={value}
      onChange={handleInputChange}
      className="select select-bordered w-full"
    >
      <option value="">-- Chọn thương hiệu --</option>
      {brands.map((brand) => (
        <option key={brand.id} value={brand.id}>
          {brand.attributes.brandName}
        </option>
      ))}
    </select>
  );
}
