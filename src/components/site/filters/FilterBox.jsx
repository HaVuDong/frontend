import React from "react";
import FilterByBrand from "./FilterByBrand";
import FilterByName from "./FilterByName";
import FilterByPrice from "./FilterByPrice";
import FilterView from "@/components/admin/filters/FilterView";

export default function FilterBox({
  setsearchKey,
  viewOption,
  setViewOption,
  setBrand,
  brand,
  selectedBrandName,
  setSelectedBrandName,
  priceFilter,
  setPriceFilter,
}) {
  return (
    <div className="flex flex-wrap md:flex-nowrap items-center gap-4 mx-4 mb-4">
      <div className="flex items-center min-w-[180px]">
        <FilterByBrand
          setBrand={setBrand}
          brand={brand}
          selectedBrandName={selectedBrandName}
          setSelectedBrandName={setSelectedBrandName}
        />
      </div>
      <div className="flex items-center min-w-[200px]">
        <FilterByName setsearchKey={setsearchKey} />
      </div>
      <div className="flex items-center min-w-[260px]">
        <FilterByPrice
          priceFilter={priceFilter}
          setPriceFilter={setPriceFilter}
          min={0}
          max={100000}
        />
      </div>
      <div className="flex items-center min-w-[120px]">
        <FilterView viewOption={viewOption} setViewOption={setViewOption} />
      </div>
    </div>
  );
}