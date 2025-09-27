import React from "react";

export default function FilterView({ viewOption, setViewOption }) {
  return (
    <div className="mb-4">
      <select
        value={viewOption}
        onChange={(e) => setViewOption(e.target.value)}
        className="border px-4 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="preview">Tất cả</option>
        <option value="live">Published</option>
      </select>
    </div>
  );
}
