// src/features/learner/components/DownloadButton.jsx
import React, { useState } from "react";
import { downloadVC } from "../../../services/api";

export default function DownloadButton({ vcId, label = "Download", className = "" }) {
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    if (!vcId) return;
    setLoading(true);
    try {
      const res = await downloadVC(vcId); // should return { url } or Blob
      if (res?.url) {
        window.open(res.url, "_blank");
      } else if (res?.data) {
        const blob = new Blob([res.data]);
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url; a.download = `${vcId}.pdf`;
        document.body.appendChild(a); a.click(); a.remove();
        URL.revokeObjectURL(url);
      } else {
        alert("Download response not understood");
      }
    } catch (e) {
      console.error(e);
      alert("Download failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={`px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50 ${className}`}
    >
      {loading ? "Downloading…" : label}
    </button>
  );
}
