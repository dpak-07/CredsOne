// src/features/employer/components/ScanPanel.jsx
import React, { useState } from "react";
import useFileHashing from "../../../hooks/useFileHashing";

/**
 * ScanPanel (safe version, no external QR dependency)
 *
 * Props:
 *  - onScan(hashOrId: string)           // called when QR scan or manual hash is ready
 *  - onManualVerify(file: File, notes)  // called when user submits manual verify form
 *
 * Notes:
 *  - This version intentionally avoids importing any QR library to keep the dev server stable.
 *  - To enable real camera QR scanning later, install a QR package and I can add it back safely.
 */
export default function ScanPanel({ onScan, onManualVerify }) {
  const [manualFile, setManualFile] = useState(null);
  const [notes, setNotes] = useState("");
  const [useClientHash, setUseClientHash] = useState(true);
  const { hash, progress, error: hashError, hashFile } = useFileHashing();

  function handleSimulateScan() {
    const dummy = "simulated-fileHash-abc123";
    onScan?.(dummy);
  }

  function handleFileChange(e) {
    const f = e.target.files?.[0] ?? null;
    setManualFile(f);
    if (f && useClientHash) {
      // compute client-side hash (hook updates `hash`)
      hashFile(f).catch((err) => {
        // hashFile already sets error state in the hook; log for debugging
        console.error("hashFile error", err);
      });
    }
  }

  async function handleSubmitManual(e) {
    e?.preventDefault();
    if (!manualFile) return;

    // If parent provided only onScan and we have a client hash, use quick verify
    if (!onManualVerify && hash) {
      onScan?.(hash);
      // reset UI
      setManualFile(null);
      setNotes("");
      return;
    }

    // Otherwise call parent's manual verify handler with file + notes
    await onManualVerify?.(manualFile, notes);
    setManualFile(null);
    setNotes("");
  }

  return (
    <div className="p-4 border rounded-lg bg-white shadow-sm">
      <h2 className="text-lg font-semibold mb-3">Verification</h2>

      {/* Simulated QR */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">Scan QR (simulated)</label>
        <div className="border rounded p-3 flex flex-col gap-2">
          <p className="text-sm text-gray-600">
            QR scanning is not enabled. Install a QR library later to enable camera scanning.
          </p>
          <div className="flex gap-2">
            <button
              onClick={handleSimulateScan}
              className="px-3 py-2 bg-blue-600 text-white rounded"
            >
              Simulate QR Scan
            </button>
            <button
              onClick={() =>
                navigator.clipboard?.writeText?.("simulated-fileHash-abc123")
              }
              className="px-3 py-2 border rounded"
            >
              Copy Dummy Hash
            </button>
          </div>
        </div>
      </div>

      {/* Manual Upload */}
      <form onSubmit={handleSubmitManual} className="space-y-3">
        <label className="block text-sm font-medium">Upload certificate (manual verify)</label>
        <input type="file" onChange={handleFileChange} className="block w-full text-sm" />

        <div className="flex items-center gap-3">
          <label className="inline-flex items-center text-sm">
            <input
              type="checkbox"
              checked={useClientHash}
              onChange={(e) => setUseClientHash(e.target.checked)}
              className="mr-2"
            />
            Compute client hash (SHA-256)
          </label>

          {useClientHash && (
            <div className="text-sm text-gray-600 ml-4">
              {hash ? (
                <div>
                  <div>
                    Hash: <code className="break-all">{hash}</code>
                  </div>
                  <div className="text-xs text-gray-500">Progress: {progress}%</div>
                </div>
              ) : hashError ? (
                <div className="text-red-600 text-xs">Hash error</div>
              ) : (
                <div className="text-xs text-gray-400">No file hashed yet</div>
              )}
            </div>
          )}
        </div>

        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Verifier notes (optional)"
          className="w-full border rounded p-2 text-sm"
          rows={3}
        />

        <div className="flex items-center gap-3">
          <button
            type="submit"
            className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-900 disabled:opacity-50"
            disabled={!!(useClientHash && manualFile && !hash)}
          >
            {onManualVerify ? "Submit Manual Verify" : "Use Hash for Verify"}
          </button>

          {/* If a hash exists allow quick verify via onScan */}
          {hash && (
            <button
              type="button"
              onClick={() => onScan?.(hash)}
              className="px-3 py-2 border rounded"
            >
              Verify using hash
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
