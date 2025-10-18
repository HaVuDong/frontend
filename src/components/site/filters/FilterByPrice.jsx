"use client";

import React, { useEffect, useState, useRef } from "react";

export default function FilterByPrice({ setPriceFilter, min = 0, max = 100000 }) {
  const [price, setPrice] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("priceFilter");
      return saved ? Number(saved) : max;
    }
    return max;
  });

  const timeoutRef = useRef(null);

  const handleInputChange = (e) => {
    const value = Number(e.target.value);
    setPrice(value);

    // Huỷ debounce trước đó nếu có
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Sau 500ms không thay đổi thì mới lọc
    timeoutRef.current = setTimeout(() => {
      setPriceFilter(value);
      if (typeof window !== "undefined") {
        localStorage.setItem("priceFilter", value.toString());
      }
    }, 500);
  };

  // Khi mount lại: khôi phục giá trị từ localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("priceFilter");
      const numericSaved = saved ? Number(saved) : null;
      if (numericSaved !== null && numericSaved !== price) {
        setPrice(numericSaved);
        setPriceFilter(numericSaved);
      }
    }
  }, []);

  return (
      <div className="flex flex-col justify-center min-w-[260px]">
      <label className="text-sm font-medium mb-1">
        Giá tối đa:{" "}
        <span className="font-bold text-green-700">{price.toLocaleString()} đ</span>
      </label>
      <input
        type="range"
        min={min}
        max={max}
        step={10}
        value={price}
        onChange={handleInputChange}
        className="range range-success w-64"
      />
      <div className="flex justify-between w-full text-xs text-gray-500">
        <span>{min.toLocaleString()} đ</span>
        <span>{max.toLocaleString()} đ</span>
      </div>
    </div>
  );
}
