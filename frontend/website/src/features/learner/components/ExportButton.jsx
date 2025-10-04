// src/features/learner/components/ExportButton.jsx
import React, { useState } from "react";
import { exportToDigilocker } from "../../../services/api";

export default function ExportButton({ vcId, label = "Export", className = "" }) {
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    if (!vcId) return;
    setLoading(true);
    try {
      const res = await exportToDigilocker(vcId);
      alert(res?.message || "Export requested");
    } catch (e) {
      console.error(e);
      alert("Export failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={`px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50 ${className}`}
    >
      {loading ? "Exporting…" : label}
    </button>
  );
}
