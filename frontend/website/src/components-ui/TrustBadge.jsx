// src/components-ui/TrustBadge.jsx
import React from "react";

export default function TrustBadge({ level, badge, size }) {
  // Support both 'level' and 'badge' props for flexibility
  const badgeLevel = level || badge;
  
  const colorMap = {
    green: "bg-green-100 text-green-800 border-green-200",
    amber: "bg-yellow-100 text-yellow-800 border-yellow-200",
    blue: "bg-blue-100 text-blue-800 border-blue-200",
    red: "bg-red-100 text-red-800 border-red-200",
    default: "bg-gray-100 text-gray-700 border-gray-200",
  };

  const textMap = {
    green: "Valid",
    amber: "Pending",
    blue: "Manual",
    red: "Invalid",
    default: "Unknown",
  };

  const key = (badgeLevel || "").toLowerCase();
  
  // Size variations
  const sizeClasses = {
    sm: "px-2 py-1 text-xs",
    md: "px-3 py-1.5 text-sm",
    lg: "px-4 py-2 text-base",
  };
  
  const sizeClass = sizeClasses[size] || sizeClasses.md;
  
  return (
    <span className={`${sizeClass} rounded-full font-medium border ${colorMap[key] || colorMap.default}`}>
      {textMap[key] || textMap.default}
    </span>
  );
}
