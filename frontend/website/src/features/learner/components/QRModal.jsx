// src/features/learner/components/QRModal.jsx
import React from "react";

export default function QRModal({ value, onClose }) {
  function buildQrImageUrl(payload, size = 300) {
    if (!payload) return "";
    const encoded = encodeURIComponent(payload);
    return `https://chart.googleapis.com/chart?cht=qr&chs=${size}x${size}&chl=${encoded}&choe=UTF-8`;
    // If you prefer offline QR generation, install 'qrcode' and I can switch this to a dataURL.
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-2xl shadow-xl text-center w-full max-w-sm">
        <h3 className="text-lg font-semibold text-indigo-700 mb-3">Share Credential</h3>
        {value ? (
          <img src={buildQrImageUrl(value, 300)} alt="QR code" className="mx-auto" />
        ) : (
          <div className="text-sm text-gray-500">No data to encode</div>
        )}
        <div className="mt-3 text-xs text-gray-500 break-all">{value}</div>
        <div className="mt-4 flex justify-center gap-3">
          <button onClick={onClose} className="px-4 py-2 bg-indigo-600 text-white rounded">Close</button>
          {value && (
            <a href={value} target="_blank" rel="noreferrer" className="px-4 py-2 border rounded text-sm">
              Open Link
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
