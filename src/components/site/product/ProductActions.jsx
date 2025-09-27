"use client";

import React from "react";
import { FaCartArrowDown } from "react-icons/fa";

export default function ProductActions({ onAddToCart }) {
  return (
    <button
      className="btn bg-orange-500 text-white hover:bg-orange-600 transition-all duration-200 flex items-center gap-2 px-3 py-2 rounded-lg shadow-md"
      onClick={onAddToCart}
    >
      <FaCartArrowDown />
      Add To Cart
    </button>
  );
}
