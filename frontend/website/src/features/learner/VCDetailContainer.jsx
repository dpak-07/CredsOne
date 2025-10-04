// src/features/learner/VCDetailContainer.jsx
import React, { useEffect, useState } from "react";
import api from "../../services/api";

/**
 * VCDetailContainer
 * - props: vcId, onClose
 * - fetches GET /api/vc/:vcId if needed and renders a modal-like panel
 * - provides Download and Export (Digilocker mock) flows
 */

export default function VCDetailContainer({ vcId, onClose }) {
  const [vc, setVc] = useState(null);
  const [loading, setLoading] = useState(true);
  const [downloadProgress, setDownloadProgress] = useState(null);
  const [error, setError] = useState(null);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function fetchVC() {
      setLoading(true);
      try {
        const res = await api.get(`/vc/${encodeURIComponent(vcId)}`);
        if (!isMounted) return;
        setVc(res.data);
      } catch (err) {
        console.error("vc fetch error", err);
        setError("Could not load credential. Try again.");
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    fetchVC();
    return () => { isMounted = false; };
  }, [vcId]);

  async function handleDownload() {
    try {
      setDownloadProgress(0);
      // backend should return a presigned URL for actual file content
      const res = await api.get(`/vc/${encodeURIComponent(vcId)}/download`);
      const url = res.data.url; // assume { url: "https://..." }
      // download with fetch to show progress (optional)
      const resp = await fetch(url);
      const blob = await resp.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = `${vc?.credentialSubject?.name || "credential"}-${vcId}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(blobUrl);
      setDownloadProgress(null);
    } catch (err) {
      console.error("download error", err);
      setDownloadProgress(null);
      alert("Download failed. Try again.");
    }
  }

  async function handleExportToDigiLocker() {
    setExporting(true);
    try {
      const res = await api.post(`/mock/digilocker/export`, { vcId });
      alert("Exported to DigiLocker (mock id: " + res.data.id + ")");
    } catch (err) {
      console.error(err);
      alert("Export failed.");
    } finally {
      setExporting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded shadow-lg w-full max-w-3xl p-6 z-10">
        <div className="flex justify-between items-start">
          <h2 className="text-xl font-semibold">Credential Details</h2>
          <div className="flex gap-2">
            <button onClick={handleDownload} className="px-3 py-1 bg-slate-200 rounded">Download</button>
            <button onClick={handleExportToDigiLocker} disabled={exporting} className="px-3 py-1 bg-blue-600 text-white rounded">
              {exporting ? "Exporting…" : "Export"}
            </button>
            <button onClick={onClose} className="px-3 py-1 bg-red-100 rounded">Close</button>
          </div>
        </div>

        {loading ? (
          <div className="mt-6">Loading credential…</div>
        ) : error ? (
          <div className="mt-6 text-red-600">{error}</div>
        ) : (
          <div className="mt-4 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm text-slate-500">Title</h3>
                <div className="font-medium">{vc?.title || vc?.credentialSubject?.course}</div>
              </div>
              <div>
                <h3 className="text-sm text-slate-500">Issuer</h3>
                <div className="font-medium">{vc?.issuer?.name || vc?.issuer}</div>
              </div>
              <div>
                <h3 className="text-sm text-slate-500">Issued On</h3>
                <div>{new Date(vc?.issuanceDate || vc?.issuedOn).toLocaleString()}</div>
              </div>
              <div>
                <h3 className="text-sm text-slate-500">Badge</h3>
                <div>{vc?.badge || vc?.proof?.badge || "Unknown"}</div>
              </div>
            </div>

            <div>
              <h3 className="text-sm text-slate-500">Evidence</h3>
              <pre className="bg-slate-50 p-3 rounded text-xs overflow-auto">
                {JSON.stringify(vc?.evidence || vc?.evidences || vc?.evidence?.[0] || {}, null, 2)}
              </pre>
            </div>

            <div>
              <h3 className="text-sm text-slate-500">Signed VC (JSON-LD)</h3>
              <pre className="bg-black/5 p-3 rounded text-xs overflow-auto max-h-56">
                {JSON.stringify(vc || {}, null, 2)}
              </pre>
            </div>

            {vc?.txId && (
              <div className="text-sm">
                On-chain tx: <a className="text-blue-600" href={`https://mumbai.polygonscan.com/tx/${vc.txId}`} target="_blank" rel="noreferrer">{vc.txId}</a>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
