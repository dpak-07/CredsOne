// src/features/learner/components/ShareButton.jsx
import React from "react";

export default function ShareButton({ onShare, className = "", label = "Share QR" }) {
  return (
    <button
      onClick={onShare}
      className={`px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700 ${className}`}
    >
      {label}
    </button>
  );
}
