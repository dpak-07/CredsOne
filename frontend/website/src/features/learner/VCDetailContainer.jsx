// src/features/learner/VCDetailContainer.jsx
import React, { useEffect, useState } from "react";
import Modal from "../../components-ui/Modal";
import TrustBadge from "../../components-ui/TrustBadge";
import { getVC, downloadVC, exportToDigilocker } from "../../services/api";

/**
 * VCDetailContainer
 * Props:
 *  - vcId: string
 *  - onClose: function
 *  - cache: optional cache object with getVC(id) and setVC(id, vc)
 */
export default function VCDetailContainer({ vcId, onClose, cache }) {
  const [vc, setVc] = useState(null);
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    let mounted = true;

    async function fetchVC() {
      setLoading(true);
      setError(null);

      try {
        // try cache first (if available)
        const cached = cache?.getVC ? await cache.getVC(vcId) : null;
        if (cached) {
          if (mounted) setVc(cached);
          setLoading(false);
          return;
        }

        const res = await getVC(vcId);
        const fetched = res?.vc ?? res; // handle either shape
        if (mounted) setVc(fetched);

        if (cache?.setVC) cache.setVC(vcId, fetched);
      } catch (err) {
        console.error("getVC error", err);
        if (mounted) setError(err?.message || "Failed to load credential details");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    if (vcId) fetchVC();
    return () => {
      mounted = false;
    };
  }, [vcId, cache]);

  async function handleDownload() {
    if (!vcId) return;
    setDownloading(true);
    try {
      const res = await downloadVC(vcId);

      // If backend returns { url }
      if (res?.url) {
        window.open(res.url, "_blank");
      } else if (res?.data) {
        // if returns blob data
        const blob = new Blob([res.data]);
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${vcId}.pdf`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
      } else {
        setNotification("Download response not understood");
      }
    } catch (err) {
      console.error("downloadVC error", err);
      setNotification("Download failed");
    } finally {
      setDownloading(false);
      setTimeout(() => setNotification(null), 2500);
    }
  }

  async function handleExport() {
    if (!vcId) return;
    setExporting(true);
    try {
      const res = await exportToDigilocker(vcId);
      setNotification(res?.message || "Export requested");
    } catch (err) {
      console.error("export error", err);
      setNotification("Export failed");
    } finally {
      setExporting(false);
      setTimeout(() => setNotification(null), 2500);
    }
  }

  // Render loading state
  if (loading) {
    return (
      <Modal isOpen={true} onClose={onClose} title="Credential details">
        <div>Loading…</div>
      </Modal>
    );
  }

  // Render error state
  if (error) {
    return (
      <Modal isOpen={true} onClose={onClose} title="Credential details">
        <div className="text-red-600">{error}</div>
      </Modal>
    );
  }

  return (
    <Modal isOpen={true} onClose={onClose} title="Credential details">
      {!vc ? (
        <div>No data</div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-xl font-semibold">
                {vc?.credentialSubject?.title || vc?.title || "Credential"}
              </h3>
              <p className="text-sm text-gray-600">
                Issuer: {vc?.issuer?.name || vc?.issuer || vc?.issuerDid || "Unknown"}
              </p>
              <p className="text-sm text-gray-500">
                Issued:{" "}
                {vc?.issuanceDate
                  ? new Date(vc.issuanceDate).toLocaleString()
                  : vc?.issuedOn || "—"}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <TrustBadge level={vc?.trust || vc?.badge || vc?.status} />
            </div>
          </div>

          <div className="bg-gray-50 p-3 rounded border">
            <h4 className="text-sm font-medium mb-2">Evidence</h4>
            <pre className="text-xs max-h-40 overflow-auto p-2 bg-white rounded border">
              {JSON.stringify(vc?.evidence ?? vc?.credentialSubject?.evidence ?? {}, null, 2)}
            </pre>
          </div>

          <div>
            <h4 className="text-sm font-medium mb-2">Signed VC (JSON-LD)</h4>
            <pre className="text-xs max-h-56 overflow-auto p-3 bg-gray-800 text-white rounded">
              {JSON.stringify(vc, null, 2)}
            </pre>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleDownload}
              disabled={downloading}
              className="px-3 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
            >
              {downloading ? "Downloading…" : "Download"}
            </button>

            <button
              onClick={handleExport}
              disabled={exporting}
              className="px-3 py-2 border rounded"
            >
              {exporting ? "Exporting…" : "Export (Digilocker)"}
            </button>

            <a
              href={`https://credsone.app/verify?vcId=${encodeURIComponent(vcId)}`}
              target="_blank"
              rel="noreferrer"
              className="px-3 py-2 border rounded"
            >
              Open Verify Link
            </a>
          </div>

          {notification && <div className="text-sm text-green-600">{notification}</div>}
        </div>
      )}
    </Modal>
  );
}
