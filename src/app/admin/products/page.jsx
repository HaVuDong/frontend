"use client";
import { useEffect, useState } from "react";
import ProductItem from "@/components/admin/products/ProductItem";
import Loading from "@/components/ui/Loading";
import Pagination from "@/components/ui/pagination";
import { getProducts } from "@/services/productService";
import generatePagination from "@/lib/pagin";
import FilterBox from "@/components/site/filters/FilterBox";

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(1);
  const pageSize = 10;
  const [searchKey, setSearchKey] = useState("");
  const [reload, setReload] = useState(0);
  const [brand, setBrand] = useState("");
  const [selectedBrandName, setSelectedBrandName] = useState("");
  const [priceFilter, setPriceFilter] = useState(100000);
  const [sortOption, setSortOption] = useState("name_asc");

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
    const sorted = [...products].sort((a, b) => {
      const nameA = a.attributes?.productName || "";
      const nameB = b.attributes?.productName || "";
      if (sortOption === "name_asc") {
        return nameA.localeCompare(nameB);
      }
      if (sortOption === "name_desc") {
        return nameB.localeCompare(nameA);
      }
      return 0;
    });
    setProducts(sorted);
  }, [sortOption]);

  useEffect(() => {
    const fetchProducts = async () => {
      const params = {
        populate: "*",
        "pagination[page]": page,
        "pagination[pageSize]": pageSize,
      };

      if (searchKey?.trim()) {
        params["filters[productName][$contains]"] = searchKey.trim();
      }

      if (viewOption) {
        params["publicationState"] = viewOption;
      }

      if (brand !== "" && brand !== "all") {
        params["filters[brand][id][$eq]"] = brand;
      }

      if (priceFilter) {
        params["filters[price][$lte]"] = priceFilter;
      }

      try {
        setLoading(true);
        const data = await getProducts(params);
        setProducts(data.data || []);
        setPageCount(data.meta?.pagination?.pageCount || 1);
      } catch (err) {
        console.error("❌ Lỗi khi tải sản phẩm:", err);
        setError("Đã có lỗi xảy ra khi tải sản phẩm.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [page, searchKey, viewOption, reload, brand, priceFilter]);

  const pages = generatePagination(page, pageCount);

  if (loading) return <Loading />;
  if (error) return <p className="text-red-400">{error}</p>;

  return (
    <div className="overflow-x-auto p-4">
      <FilterBox
        setsearchKey={setSearchKey}
        viewOption={viewOption}
        setViewOption={setViewOption}
        setBrand={setBrand}
        brand={brand}
        selectedBrandName={selectedBrandName}
        setSelectedBrandName={setSelectedBrandName}
        priceFilter={priceFilter}
        setPriceFilter={setPriceFilter}
      />

      <h1 className="text-xl font-semibold mb-4">Danh sách sản phẩm</h1>
      <div className="mb-4">
        <label className="mr-2 font-medium">Sắp xếp:</label>
        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          className="border px-2 py-1 rounded"
        >
          <option value="name_asc">Tên A-Z</option>
          <option value="name_desc">Tên Z-A</option>
        </select>
      </div>
      <table className="table table-xs table-pin-rows table-pin-cols w-full">
        <thead>
          <tr>
            <th>STT</th>
            <th>Name</th>
            <th>Image</th>
            <th>Price</th>
            <th>Published</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {products.length > 0 ? (
            products.map((p, i) => (
              <ProductItem
                key={p.id}
                reload={reload}
                setReload={setReload}
                product={p}
                stt={(page - 1) * pageSize + i + 1}
              />
            ))
          ) : (
            <tr>
              <td colSpan="6" className="text-center text-gray-500">
                Không có sản phẩm nào.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <Pagination pages={pages} pageCount={pageCount} setPage={setPage} />
    </div>
  );
}
