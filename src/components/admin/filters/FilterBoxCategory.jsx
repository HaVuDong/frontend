"use client";
import FilterByName from "@/components/site/filters/FilterByName";
import FilterView from "@/components/admin/filters/FilterView";

export default function FilterBoxCategory({ setsearchKey, viewOption, setViewOption }) {
  return (
    <div className="flex flex-col md:flex-row mx-4 gap-4 mb-4">
      <FilterByName setsearchKey={setsearchKey} />
      <FilterView viewOption={viewOption} setViewOption={setViewOption} />
    </div>
  );
}
