// src/features/learner/components/VCDetailModal.jsx
import React from "react";
import DownloadButton from "./DownloadButton";
import ExportButton from "./ExportButton";
import ShareButton from "./ShareButton";
import HashStatus from "./HashStatus";
import TrustBadge from "./TrustBadge";

export default function VCDetailModal({ vc, onClose, onShare }) {
  if (!vc) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-4xl relative">
        <button onClick={onClose} className="absolute top-3 right-4 text-gray-400 hover:text-gray-700 text-xl">×</button>

        <header className="mb-4 flex items-start justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold text-indigo-700">
              {vc?.credentialSubject?.title || vc?.title}
            </h2>
            <p className="text-sm text-gray-500">Issuer: {vc?.issuer?.name || vc?.issuer}</p>
          </div>
          <TrustBadge level={vc?.trust || vc?.badge || vc?.status} />
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-50 border rounded-lg p-3 max-h-80 overflow-auto text-xs">
            <h4 className="font-medium text-sm mb-2">Signed VC (JSON-LD)</h4>
            <pre className="whitespace-pre-wrap text-gray-700">{JSON.stringify(vc, null, 2)}</pre>
          </div>

          <div className="space-y-3">
            <div className="bg-gray-50 border rounded-lg p-3 text-sm">
              <h4 className="font-medium mb-1">Evidence</h4>
              <pre className="text-xs max-h-32 overflow-auto">{JSON.stringify(vc?.evidence ?? vc?.credentialSubject?.evidence ?? {}, null, 2)}</pre>
            </div>

            <HashStatus clientHash={vc?.clientHash} serverHash={vc?.fileHash} />

            <div className="flex flex-wrap gap-2 pt-1">
              <DownloadButton vcId={vc?.id || vc?.vcId} />
              <ExportButton vcId={vc?.id || vc?.vcId} />
              <ShareButton onShare={() => onShare?.(vc)} />
            </div>

            <div className="text-xs text-gray-500">
              <strong>Tx:</strong>{" "}
              {vc?.txId ? (
                <a
                  href={`https://mumbai.polygonscan.com/tx/${vc.txId}`}
                  className="text-indigo-600 underline"
                  target="_blank"
                  rel="noreferrer"
                >
                  {vc.txId}
                </a>
              ) : "Not anchored"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
