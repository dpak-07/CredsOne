// src/features/learner/components/SearchBar.jsx
import React from "react";

export default function SearchBar({ value, onChange, filters = {}, onFilterChange }) {
  return (
    <div className="mb-5 flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
      <input
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder="Search by title, issuer, or hash…"
        className="w-full md:w-[380px] border rounded-xl px-3.5 py-2.5 text-sm shadow-sm focus:ring-2 focus:ring-indigo-300 outline-none"
      />

      <div className="flex flex-wrap gap-2">
        <FilterChip
          label="All"
          active={!filters.trust}
          onClick={() => onFilterChange?.({ ...filters, trust: undefined })}
        />
        {["Green", "Amber", "Blue"].map((t) => (
          <FilterChip
            key={t}
            label={t}
            active={filters.trust === t}
            onClick={() => onFilterChange?.({ ...filters, trust: t })}
          />
        ))}
      </div>
    </div>
  );
}

function FilterChip({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-full text-xs border transition ${
        active
          ? "bg-indigo-600 text-white border-indigo-600"
          : "bg-white text-gray-700 border-gray-200 hover:bg-indigo-50"
      }`}
    >
      {label}
    </button>
  );
}
