// src/features/employer/components/ScanPanel.jsx
import React, { useState } from "react";

export default function ScanPanel({ onScan, onManualVerify }) {
  const [manualFile, setManualFile] = useState(null);
  const [notes, setNotes] = useState("");

  function handleFileChange(e) {
    setManualFile(e.target.files[0]);
  }

  function handleManualSubmit(e) {
    e.preventDefault();
    if (!manualFile) return;
    onManualVerify(manualFile, notes);
    setManualFile(null);
    setNotes("");
  }

  return (
    <div className="p-4 border rounded-lg bg-white shadow-sm">
      <h2 className="text-lg font-semibold mb-4">Verification Options</h2>

      {/* QR Scan (mocked for now) */}
      <div className="mb-6">
        <button
          onClick={() => onScan("dummyFileHash123")}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Simulate QR Scan
        </button>
        <p className="text-sm text-gray-500 mt-1">
          (Integration with react-qr-reader or webcam can be added later)
        </p>
      </div>

      {/* Manual upload */}
      <form onSubmit={handleManualSubmit} className="space-y-3">
        <input
          type="file"
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-600"
        />
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Verification notes"
          className="w-full border rounded
