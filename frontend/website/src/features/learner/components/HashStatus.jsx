import React from "react";

/**
 * HashStatus (Static Version)
 * ---------------------------
 * Shows comparison between client-side and server-side hashes
 * with clear visual indicators (✔️ / ⚠️).
 *
 * Props (optional for demo):
 * - clientHash: simulated local hash
 * - serverHash: simulated stored hash
 */
export default function HashStatus({
  clientHash = "abcd1234efgh5678ijkl9012mnop3456",
  serverHash = "abcd1234efgh5678ijkl9012mnop3456",
}) {
  const match =
    clientHash && serverHash && clientHash.toLowerCase() === serverHash.toLowerCase();

  const colorClass = match
    ? "bg-green-50 border-green-300 text-green-800"
    : "bg-yellow-50 border-yellow-300 text-yellow-800";

  return (
    <div
      className={`rounded-xl border p-4 mt-4 text-sm transition-all ${colorClass}`}
    >
      <div className="flex items-center gap-2 mb-2">
        <span className="text-lg">{match ? "✅" : "⚠️"}</span>
        <h4 className="font-semibold">
          {match ? "Hashes match (Verified)" : "Hashes differ (Pending Verification)"}
        </h4>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs">
        <div className="bg-white/70 border rounded-md p-2">
          <strong>Client Hash:</strong>
          <p className="break-all text-gray-700 mt-1">{clientHash}</p>
        </div>

        <div className="bg-white/70 border rounded-md p-2">
          <strong>Server Hash:</strong>
          <p className="break-all text-gray-700 mt-1">{serverHash}</p>
        </div>
      </div>

      {!match && (
        <p className="mt-3 text-xs italic text-yellow-700">
          The server will re-hash the file for canonical verification.
        </p>
      )}
    </div>
  );
}
