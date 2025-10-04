// src/features/learner/components/CredentialList.jsx
import React, { useState } from "react";
import QRCode from "qrcode";

/**
 * CredentialList
 * - props: vcs (array), onView(vcId)
 * - internal small VCCard + TrustBadge + QRModal
 */

function TrustBadge({ value }) {
  const map = {
    Green: "bg-green-100 text-green-800",
    Amber: "bg-amber-100 text-amber-800",
    Blue: "bg-blue-100 text-blue-800",
  };
  const cls = map[value] || "bg-gray-100 text-gray-700";
  return <span className={`px-2 py-1 rounded text-xs font-semibold ${cls}`}>{value || "Unknown"}</span>;
}

function VCCard({ vc, onView }) {
  const [qrOpen, setQrOpen] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState(null);

  async function generateQr() {
    const payload = JSON.stringify({ vcId: vc.vcId, fileHash: vc.fileHash });
    try {
      const dataUrl = await QRCode.toDataURL(payload);
      setQrDataUrl(dataUrl);
      setQrOpen(true);
    } catch (err) {
      console.error("QR gen err", err);
    }
  }

  return (
    <div className="p-4 bg-white rounded shadow flex items-center justify-between">
      <div>
        <div className="flex items-center gap-3">
          <div>
            <h3 className="font-semibold">{vc.title}</h3>
            <p className="text-sm text-slate-500">{vc.issuer?.name} • {new Date(vc.issuedOn).toLocaleDateString()}</p>
          </div>
        </div>
        <p className="text-xs text-slate-400 mt-2">{vc.metadata?.certId}</p>
      </div>

      <div className="flex items-center gap-3">
        <TrustBadge value={vc.badge} />
        <button onClick={() => onView(vc.vcId)} className="px-3 py-1 bg-slate-100 rounded">View</button>
        <button onClick={generateQr} className="px-3 py-1 bg-slate-100 rounded">QR</button>
      </div>

      {qrOpen && (
        <div className="fixed inset-0 z-40 flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-black/40" onClick={() => setQrOpen(false)} />
          <div className="relative bg-white p-6 rounded shadow z-50">
            <h4 className="font-semibold mb-2">{vc.title} — QR</h4>
            {qrDataUrl ? <img src={qrDataUrl} alt="qr" className="w-72 h-72" /> : <div>Generating QR…</div>}
            <div className="mt-4 text-right"><button onClick={() => setQrOpen(false)} className="px-3 py-1 bg-blue-600 text-white rounded">Close</button></div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function CredentialList({ vcs = [], onView }) {
  return (
    <div className="space-y-4">
      {vcs.map((vc) => (
        <VCCard key={vc.vcId} vc={vc} onView={onView} />
      ))}
    </div>
  );
}
