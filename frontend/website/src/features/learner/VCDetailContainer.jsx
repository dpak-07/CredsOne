// VCDetailContainer.jsx (container + modal)
import React, { useEffect, useState } from "react";
import Modal from "../../components-ui/Modal";
import { getVC, downloadVC, exportToDigilocker } from "../../services/api";
import TrustBadge from "../../components-ui/TrustBadge";

/**
 * VCDetailContainer
 * - vcId: string
 * - onClose: fn
 * - cache: optional cache hook object with getVC(id) and setVC(vc)
 */
export default function VCDetailContainer({ vcId, onClose, cache }) {
  const [vc, setVc] = useState(null);
  const [loading, setLoading] = useState(false);
  const [downloadting, setDownloading] = useState(false);
  const [error, setError] = useState(null);
  const [exporting, setExporting] = useState(false);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    let mounted = true;
    async function fetchVC() {
      setLoading(true);
      setError(null);

      try {
        // try cache first
        const cached = cache?.getVC ? await cache.getVC(vcId) : null;
        if (cached) {
          if (mounted) setVc(cached);
          setLoading(false);
          return;
        }

        const data = await getVC(vcId);
        // expected shape: { vc: {...} } or the vc object directly
        const fetched = data?.vc ?? data;
        if (mounted) setVc(fetched);

        // store in cache if available
        if (cache?.setVC) cache.setVC(vcId, fetched);
      } catch (err) {
        console.error("getVC error", err);
        if (mounted) setError(err?.message || "Failed to load credential details");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchVC();
    return () => { mounted = false; };
  }, [vcId]);

  async function handleDownload() {
    if (!vcId) return;
    setDownloading(true);
    try {
      // backend returns a short-lived signed URL or file blob
      const res = await downloadVC(vcId); // adjust service as implemented
      // if API returns { url }, redirect to url. If returns blob, download it.
      if (res?.url) {
        window.open(res.url, "_blank");
      } else if (res?.data) {
        // assuming blob data — create download link
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
    setExporting(true);
    try {
      // simulate interoperability export (Digilocker mock)
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

  if (!vc && loading) {
    return (
      <Modal isOpen={true} onClose={onClose} title="Credential details">
        <div>Loading…</div>
      </Modal>
    );
  }

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
              <h3 className="text-xl font-semibold">{vc?.credentialSubject?.title || vc?.title || "Credential"}</h3>
              <p className="text-sm text-gray-600">Issuer: {vc?.issuer?.name || vc?.issuer || vc?.issuerDid}</p>
              <p className="text-sm text-gray-500">Issued: {vc?.issuanceDate ? new Date(vc.issuanceDate).toLocaleString() : vc?.issuedOn}</p>
            </div>
            <div className="flex items-center gap-2">
              <TrustBadge level={vc?.trust || vc?.badge || vc?.status} />
            </div>
          </div>

          {/* Evidence and attestation */}
          <div className="bg-gray-50 p-3 rounded border">
            <h4 className="text-sm font-medium mb-2">Evidence</h4>
            <pre className="text-xs max-h-40 overflow-auto p-2 bg-white rounded border">{JSON.stringify(vc?.evidence ?? vc?.credentialSubject?.evidence ?? {}, null, 2)}</pre>
          </div>

          {/* Full JSON-LD */}
          <div>
            <h4 className="text-sm font-medium mb-2">Signed VC (JSON-LD)</h4>
            <pre className="text-xs max-h-56 overflow-auto p-3 bg-gray-800 text-white rounded">{JSON.stringify(vc, null, 2)}</pre>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={handleDownload}
              disabled={downloading}
              className="px-3 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
            >
