// src/components-ui/TrustBadge.jsx
import React from "react";

export default function TrustBadge({ level }) {
  const colorMap = {
    green: "bg-green-100 text-green-800",
    amber: "bg-yellow-100 text-yellow-800",
    blue: "bg-blue-100 text-blue-800",
    default: "bg-gray-100 text-gray-700",
  };

  const textMap = {
    green: "Valid",
    amber: "Legacy",
    blue: "Manual",
    default: "Unknown",
  };

  const key = (level || "").toLowerCase();
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${colorMap[key] || colorMap.default}`}>
      {textMap[key] || textMap.default}
    </span>
  );
}
