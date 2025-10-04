import React, { useState } from "react";

// --- Mock Data -----------------------------------------------------
const MOCK_VCS = [
  {
    id: "vc1",
    title: "Full Stack Web Development",
    issuer: "Skill India Digital",
    issueDate: "2025-03-20",
    trust: "Green",
    fileHash: "abcd1234efgh5678",
    txId: "0x0aa7ef9823d...",
  },
  {
    id: "vc2",
    title: "AI & Machine Learning Foundation",
    issuer: "NASSCOM FutureSkills",
    issueDate: "2025-01-18",
    trust: "Amber",
    fileHash: "hijk9999mnop0000",
    txId: "0x81ca77cce000...",
  },
  {
    id: "vc3",
    title: "Cybersecurity Awareness",
    issuer: "NCVET",
    issueDate: "2024-11-12",
    trust: "Blue",
    fileHash: "zzz999y888x777",
  },
];

export default function WalletPage() {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const [showQR, setShowQR] = useState(false);
  const [qrData, setQrData] = useState("");

  const filtered = MOCK_VCS.filter(
    (v) =>
      v.title.toLowerCase().includes(search.toLowerCase()) ||
      v.issuer.toLowerCase().includes(search.toLowerCase()) ||
      v.fileHash.toLowerCase().includes(search.toLowerCase())
  );

  function handleShare(vc) {
    setQrData(`https://credsone.app/verify?hash=${vc.fileHash}`);
    setShowQR(true);
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-6">
      {/* Header */}
      <header className="mb-6 bg-gradient-to-r from-indigo-600 via-purple-600 to-fuchsia-600 text-white p-5 rounded-2xl shadow">
        <h1 className="text-2xl font-semibold">My Wallet</h1>
        <p className="text-sm opacity-90">DID: learner12345xyz</p>
      </header>

      {/* Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between mb-5 gap-3">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search credentials..."
          className="border rounded-lg px-3 py-2 text-sm w-full sm:w-80 focus:ring-2 focus:ring-indigo-300 outline-none"
        />
        <button
          onClick={() => setSearch("")}
          className="text-sm text-indigo-600 hover:underline"
        >
          Clear
        </button>
      </div>

      {/* Credential Cards */}
      {filtered.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((vc) => (
            <div
              key={vc.id}
              onClick={() => setSelected(vc)}
              className="bg-white/90 backdrop-blur-sm rounded-2xl border border-indigo-100 p-4 shadow hover:shadow-lg hover:border-indigo-200 transition cursor-pointer"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-indigo-700 font-semibold line-clamp-2">
                    {vc.title}
                  </h3>
                  <p className="text-sm text-gray-500">Issuer: {vc.issuer}</p>
                </div>
                <TrustBadge trust={vc.trust} />
              </div>
              <div className="mt-3 flex justify-between items-center text-xs text-gray-400">
                <span>{new Date(vc.issueDate).toLocaleDateString()}</span>
                <div className="flex gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleShare(vc);
                    }}
                    className="px-2 py-1 border rounded hover:bg-indigo-50"
                  >
                    Share
                  </button>
                  <button
                    onClick={(e) => e.stopPropagation()}
                    className="px-2 py-1 border rounded hover:bg-indigo-50"
                  >
                    Download
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Detail Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-3xl relative">
            <button
              onClick={() => setSelected(null)}
              className="absolute top-3 right-4 text-gray-400 hover:text-gray-700 text-xl"
            >
              ×
            </button>
            <h2 className="text-xl font-semibold text-indigo-700 mb-2">
              {selected.title}
            </h2>
            <p className="text-sm text-gray-500 mb-4">
              Issued by: {selected.issuer}
            </p>

            <div className="bg-gray-50 border rounded-lg p-3 mb-4 text-xs max-h-60 overflow-auto">
              <pre className="whitespace-pre-wrap text-gray-700">
                {JSON.stringify(selected, null, 2)}
              </pre>
            </div>

            <div className="flex flex-wrap gap-3">
              <button className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">
                Download
              </button>
              <button className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700">
                Export
              </button>
              <button
                onClick={() => handleShare(selected)}
                className="px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700"
              >
                Share QR
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-3">
              <strong>Tx ID:</strong>{" "}
              {selected.txId ? (
                <a
                  href="#"
                  className="text-indigo-600 underline"
                  target="_blank"
                >
                  {selected.txId}
                </a>
              ) : (
                "Not anchored"
              )}
            </p>
          </div>
        </div>
      )}

      {/* QR Modal */}
      {showQR && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl shadow-xl text-center">
            <h2 className="text-lg font-semibold text-indigo-700 mb-2">
              Share this Credential
            </h2>
            {qrData && (
              <img
                src={`https://chart.googleapis.com/chart?cht=qr&chs=300x300&chl=${encodeURIComponent(
                  qrData
                )}`}
                alt="QR code"
                className="mx-auto"
              />
            )}
            <p className="text-xs mt-2 text-gray-500 break-all">{qrData}</p>
            <button
              onClick={() => setShowQR(false)}
              className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </main>
  );
}

// --- Components -----------------------------------------------------

function TrustBadge({ trust }) {
  const colors = {
    Green: "bg-green-100 text-green-700 border-green-300",
    Amber: "bg-yellow-100 text-yellow-700 border-yellow-300",
    Blue: "bg-blue-100 text-blue-700 border-blue-300",
  };
  const css = colors[trust] || colors.Blue;
  return (
    <span
      className={`px-2 py-1 text-xs rounded-full border font-medium ${css}`}
    >
      {trust} Verified
    </span>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-gray-500">
      <svg
        className="w-20 h-20 mb-4 opacity-70"
        viewBox="0 0 24 24"
        fill="none"
      >
        <path
          d="M12 2v4M20 12h-4M12 20v-4M4 12h4"
          stroke="#A0AEC0"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <circle
          cx="12"
          cy="12"
          r="9"
          stroke="#CBD5E0"
          strokeWidth="1.5"
        />
      </svg>
      <p className="text-lg font-medium">No credentials found</p>
      <p className="text-sm text-gray-500 mt-2">
        Once an issuer adds a credential, it will appear here.
      </p>
    </div>
  );
}
