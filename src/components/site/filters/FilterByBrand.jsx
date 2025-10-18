import { useEffect, useState } from "react";
import { getBrands } from "@/services/brandService";

export default function FilterByBrand({ brand: brandProp, setBrand: setBrandProp, viewOption }) {
  const [internalBrand, setInternalBrand] = useState("");
  const brand = typeof brandProp !== "undefined" ? brandProp : internalBrand;
  const setBrand = typeof setBrandProp === "function" ? setBrandProp : setInternalBrand;

  const [brands, setBrands] = useState([]);

  useEffect(() => {
    if (typeof brandProp === "undefined") {
      const savedBrand = localStorage.getItem("brand");
      if (savedBrand) {
        setInternalBrand(savedBrand);
      }
    }
  }, []);

  useEffect(() => {
    if (typeof brandProp === "undefined" && brand) {
      localStorage.setItem("brand", brand);
    }
  }, [brand]);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const res = await getBrands();
        let allBrands = res.data || [];

        if (viewOption === "live") {
          allBrands = allBrands.filter(
            (b) => b.attributes?.status === "published"
          );
        }

        setBrands(allBrands);
      } catch (err) {
        console.error("Lỗi khi lấy brand", err);
      }
    };
    fetchBrands();
  }, [viewOption]);

  const selectedBrandName =
    brand !== "all" && brand
      ? brands.find((b) => String(b.id) === String(brand))?.attributes?.brandName
      : null;

  return (
    <div className="flex flex-col items-start min-w-[200px]">
      <select
        className="select select-success select-sm w-full"
        value={brand || "all"}
        onChange={(e) => setBrand(e.target.value)}
      >
        <option value="all">-- Tất cả thương hiệu --</option>
        {brands.map((b) => (
          <option key={b.id} value={b.id}>  
            {b.attributes.brandName}
          </option>
        ))}
      </select>

      {selectedBrandName && (
        <div className="text-sm text-gray-700 mt-1">
          Thương hiệu đã chọn: <strong>{selectedBrandName}</strong>
        </div>
      )}
    </div>
  );
}
