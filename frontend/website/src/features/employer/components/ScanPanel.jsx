// src/features/employer/components/ScanPanel.jsx
import React, { useCallback, useEffect, useRef, useState } from "react";
import useFileHashing from "../../../hooks/useFileHashing";

/**
 * ScanPanel
 *
 * Props:
 *  - onScan(hashOrId: string)           // called when QR scan or manual hash is ready
 *  - onManualVerify(file: File, notes)  // called when user submits manual verify form
 *
 * Notes:
 *  - This tries to use `react-qr-reader` if it's installed. If not, a "Simulate QR Scan" button is shown.
 *  - For file uploads it optionally computes a SHA-256 client-side hash via `useFileHashing`.
 *  - Keep the component presentational; heavy API work stays in the parent (VerifierPage).
 */
export default function ScanPanel({ onScan, onManualVerify }) {
  const [qrSupported, setQrSupported] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [scanError, setScanError] = useState(null);
  const [manualFile, setManualFile] = useState(null);
  const [notes, setNotes] = useState("");
  const [computedHash, setComputedHash] = useState(null);
  const [useClientHash, setUseClientHash] = useState(true);

  const { hash, progress, error: hashError, hashFile } = useFileHashing();

  // lazy load react-qr-reader to avoid hard dependency
  const QRReaderRef = useRef(null);
  useEffect(() => {
    let mounted = true;
    async function tryLoad() {
      try {
        // dynamic import; will fail if package not installed
        const mod = await import("react-qr-reader");
        if (mounted) {
          QRReaderRef.current = mod.default || mod.QrReader || mod;
          setQrSupported(true);
        }
      } catch (err) {
        // not installed or unsupported
        setQrSupported(false);
      }
    }
    tryLoad();
    return () => { mounted = false; };
  }, []);

  const handleScanResult = useCallback(
    (data) => {
      if (!data) return;
      // data is typically the scanned text — maybe a deep link or fileHash/vcId
      setScanning(false);
      setScanError(null);
      const trimmed = String(data).trim();
      onScan?.(trimmed);
    },
    [onScan]
  );

  const handleScanError = useCallback((err) => {
    console.error("QR scan error:", err);
    setScanError(err?.message || String(err));
    setScanning(false);
  }, []);

  function handleSimulateScan() {
    const dummy = "simulated-fileHash-abc123";
    onScan?.(dummy);
  }

  function handleFileChange(e) {
    const f = e.target.files?.[0] ?? null;
    setManualFile(f);
    setComputedHash(null);
    if (f && useClientHash) {
      // compute client-side hash
      hashFile(f)
        .then((hex) => {
          setComputedHash(hex);
        })
        .catch((err) => {
          console.error("hash error", err);
        });
    }
  }

  async function handleSubmitManual(e) {
    e?.preventDefault();
    if (!manualFile) return;
    // if computedHash is present and user wants quick verify, call onScan with hash
    if (computedHash && !onManualVerify) {
      // if parent provided only onScan, call it with hash
      onScan?.(computedHash);
      return;
    }

    // otherwise, send the file to manual verify flow in parent
    await onManualVerify?.(manualFile, notes);
    // reset form
    setManualFile(null);
    setNotes("");
    setComputedHash(null);
  }

  return (
    <div className="p-4 border rounded-lg bg-white shadow-sm">
      <h2 className="text-lg font-semibold mb-3">Verification</h2>

      {/* QR Scanner area */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">Scan QR (preferred)</label>

        {qrSupported && QRReaderRef.current ? (
          <div className="border rounded p-2">
            {/* eslint-disable-next-line react/jsx-props-no-spreading */}
            <QRReaderRef.current
              onScan={handleScanResult}
              onError={handleScanError}
              style={{ width: "100%" }}
              delay={500}
            />
            <div className="mt-2 flex items-center gap-2">
              <button
                className="px-3 py-1 bg-red-600 text-white rounded"
                onClick={() => { setScanning(false); }}
              >
                Stop
              </button>
            </div>
            {scanError && <div className="text-sm text-red-600 mt-2">{scanError}</div>}
          </div>
        ) : (
          <div className="border rounded p-3 flex flex-col gap-2">
            <p className="text-sm text-gray-600">
              QR scanning not available (react-qr-reader not installed or camera access blocked).
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => { setScanning(true); handleSimulateScan(); }}
                className="px-3 py-2 bg-blue-600 text-white rounded"
              >
                Simulate QR Scan
              </button>
              <button
                onClick={() => navigator.clipboard && navigator.clipboard.writeText("simulated-fileHash-abc123")}
                className="px-3 py-2 border rounded"
              >
                Copy Dummy Hash
              </button>
            </div>
          </div>
        )}
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
                  <div>Hash: <code className="break-all">{hash}</code></div>
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
            disabled={!!(useClientHash && manualFile && !hash && !computedHash)}
          >
            {onManualVerify ? "Submit Manual Verify" : "Use Hash for Verify"}
          </button>

          {/* If a computed hash exists allow quick verify via onScan */}
          { (hash || computedHash) && (
            <button
              type="button"
              onClick={() => onScan?.(computedHash || hash)}
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
