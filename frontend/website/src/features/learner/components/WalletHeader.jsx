// src/features/learner/components/WalletHeader.jsx
import React from "react";

export default function WalletHeader({ name, did, stats }) {
  return (
    <header className="mb-6">
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-fuchsia-600 rounded-2xl p-5 text-white shadow">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold">My Wallet</h1>
            <p className="text-sm opacity-90">{name ? name : "Learner"} — {did || "DID unavailable"}</p>
          </div>
          {stats && (
            <div className="grid grid-cols-3 gap-3 text-center">
              <Stat label="Credentials" value={stats.count ?? "—"} />
              <Stat label="Verified" value={stats.verified ?? "—"} />
              <Stat label="Pending" value={stats.pending ?? "—"} />
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

function Stat({ label, value }) {
  return (
    <div className="bg-white/15 rounded-lg px-4 py-2">
      <div className="text-sm opacity-90">{label}</div>
      <div className="text-lg font-semibold">{value}</div>
    </div>
  );
}
