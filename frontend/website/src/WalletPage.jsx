import React, { useState, useEffect } from "react";

// Mock API service functions
const api = {
  get: async (url) => {
    // Mock implementation
    return { data: {} };
  },
  post: async (url, data) => {
    // Mock implementation  
    return { data: { id: "mock-digilocker-id" } };
  }
};

// Mock download function
const downloadVC = async (vcId) => {
  return { url: "#" };
};

// Mock export function  
const exportToDigilocker = async (vcId) => {
  return { message: "Exported to DigiLocker" };
};

// TrustBadge component moved inline
const TrustBadge = ({ level }) => {
  const colorMap = {
    green: "bg-green-100 text-green-800",
    amber: "bg-yellow-100 text-yellow-800", 
    blue: "bg-blue-100 text-blue-800",
    default: "bg-gray-100 text-gray-700",
  };

  const textMap = {
    green: "Valid",
    amber: "Legacy", 
    blue: "Manual",
    default: "Unknown",
  };

  const key = (level || "").toLowerCase();
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${colorMap[key] || colorMap.default}`}>
      {textMap[key] || textMap.default}
    </span>
  );
};

// WalletHeader component moved inline
const WalletHeader = ({ name, did, stats }) => {
  const Stat = ({ label, value }) => (
    <div className="bg-white/15 rounded-lg px-4 py-2">
      <div className="text-sm opacity-90">{label}</div>
      <div className="text-lg font-semibold">{value}</div>
    </div>
  );

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
};

// SearchBar component moved inline
const SearchBar = ({ value, onChange, filters = {}, onFilterChange }) => {
  const FilterChip = ({ label, active, onClick }) => (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-full text-xs border transition ${
        active
          ? "bg-indigo-600 text-white border-indigo-600"
          : "bg-white text-gray-700 border-gray-200 hover:bg-indigo-50"
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="mb-5 flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
      <input
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder="Search by title, issuer, or hash…"
        className="w-full md:w-[380px] border rounded-xl px-3.5 py-2.5 text-sm shadow-sm focus:ring-2 focus:ring-indigo-300 outline-none"
      />

      <div className="flex flex-wrap gap-2">
        <FilterChip
          label="All"
          active={!filters.trust}
          onClick={() => onFilterChange?.({ ...filters, trust: undefined })}
        />
        {["Green", "Amber", "Blue"].map((t) => (
          <FilterChip
            key={t}
            label={t}
            active={filters.trust === t}
            onClick={() => onFilterChange?.({ ...filters, trust: t })}
          />
        ))}
      </div>
    </div>
  );
};

// EmptyState component moved inline
const EmptyState = ({ title = "No credentials found", subtitle = "Once an issuer adds a credential, it will appear here." }) => (
  <div className="flex flex-col items-center justify-center py-16 text-gray-500">
    <svg className="w-20 h-20 mb-4 opacity-70" viewBox="0 0 24 24" fill="none">
      <path d="M12 2v4M20 12h-4M12 20v-4M4 12h4" stroke="#A0AEC0" strokeWidth="1.5" strokeLinecap="round"/>
      <circle cx="12" cy="12" r="9" stroke="#CBD5E0" strokeWidth="1.5" />
    </svg>
    <p className="text-lg font-medium">{title}</p>
    <p className="text-sm text-gray-500 mt-2">{subtitle}</p>
  </div>
);

// VCCard component moved inline
const VCCard = ({ vc, onView, onShare }) => {
  const [qrOpen, setQrOpen] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState(null);

  const generateQr = async () => {
    const payload = JSON.stringify({ vcId: vc.vcId, fileHash: vc.fileHash });
    try {
      // Using Google Charts API for QR generation
      const dataUrl = `https://chart.googleapis.com/chart?cht=qr&chs=300x300&chl=${encodeURIComponent(payload)}`;
      setQrDataUrl(dataUrl);
      setQrOpen(true);
    } catch (err) {
      console.error("QR gen err", err);
    }
  };

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
        <TrustBadge level={vc.badge} />
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
};

// CredentialList component moved inline
const CredentialList = ({ vcs = [], onView, onShare }) => (
  <div className="space-y-4">
    {vcs.map((vc) => (
      <VCCard key={vc.vcId} vc={vc} onView={onView} onShare={onShare} />
    ))}
  </div>
);

// DownloadButton component moved inline
const DownloadButton = ({ vcId, label = "Download", className = "" }) => {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    if (!vcId) return;
    setLoading(true);
    try {
      const res = await downloadVC(vcId);
      if (res?.url) {
        window.open(res.url, "_blank");
      } else {
        alert("Download response not understood");
      }
    } catch (e) {
      console.error(e);
      alert("Download failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={`px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50 ${className}`}
    >
      {loading ? "Downloading…" : label}
    </button>
  );
};

// ExportButton component moved inline
const ExportButton = ({ vcId, label = "Export", className = "" }) => {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    if (!vcId) return;
    setLoading(true);
    try {
      const res = await exportToDigilocker(vcId);
      alert(res?.message || "Export requested");
    } catch (e) {
      console.error(e);
      alert("Export failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={`px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50 ${className}`}
    >
      {loading ? "Exporting…" : label}
    </button>
  );
};

// ShareButton component moved inline
const ShareButton = ({ onShare, className = "", label = "Share QR" }) => (
  <button
    onClick={onShare}
    className={`px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700 ${className}`}
  >
    {label}
  </button>
);

// HashStatus component moved inline
const HashStatus = ({
  clientHash = "abcd1234efgh5678ijkl9012mnop3456",
  serverHash = "abcd1234efgh5678ijkl9012mnop3456",
}) => {
  const match = clientHash && serverHash && clientHash.toLowerCase() === serverHash.toLowerCase();

  const colorClass = match
    ? "bg-green-50 border-green-300 text-green-800"
    : "bg-yellow-50 border-yellow-300 text-yellow-800";

  return (
    <div className={`rounded-xl border p-4 mt-4 text-sm transition-all ${colorClass}`}>
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
};

// VCDetailModal component moved inline
const VCDetailModal = ({ vc, onClose, onShare }) => {
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
};

// ActivityFeed component moved inline
const ActivityFeed = ({ learnerDid, pollMs = 15000 }) => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    let timer;
    async function load() {
      if (!learnerDid) return;
      try {
        // Mock audit data
        const mockAudit = [
          { action: "Credential Viewed", date: new Date().toISOString() },
          { action: "QR Shared", date: new Date(Date.now() - 300000).toISOString() },
        ];
        setItems(mockAudit.slice(0, 10));
      } catch (e) {
        console.error("audit load error", e);
      }
    }
    load();
    if (pollMs) {
      timer = setInterval(load, pollMs);
    }
    return () => timer && clearInterval(timer);
  }, [learnerDid, pollMs]);

  if (!items.length) return null;

  return (
    <aside className="mt-6 bg-white rounded-2xl border p-4 shadow-sm">
      <h4 className="text-sm font-semibold text-indigo-700 mb-3">Recent Activity</h4>
      <ul className="space-y-2">
        {items.map((it, idx) => (
          <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
            <span className="mt-1 inline-block w-2 h-2 rounded-full bg-indigo-500"></span>
            <div>
              <div className="font-medium">{it.action || it.type || "Event"}</div>
              <div className="text-xs text-gray-500">
                {new Date(it.date || it.createdAt || Date.now()).toLocaleString()}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </aside>
  );
};

// Main WalletPage component
const WalletPage = () => {
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({});
  const [selectedVC, setSelectedVC] = useState(null);
  const [showQR, setShowQR] = useState(false);
  const [qrData, setQrData] = useState("");

  // Mock data
  const MOCK_VCS = [
    {
      vcId: "vc1",
      title: "Full Stack Web Development",
      issuer: { name: "Skill India Digital" },
      issuedOn: "2025-03-20",
      badge: "Green",
      fileHash: "abcd1234efgh5678",
      txId: "0x0aa7ef9823d...",
      metadata: { certId: "CERT-001" }
    },
    {
      vcId: "vc2", 
      title: "AI & Machine Learning Foundation",
      issuer: { name: "NASSCOM FutureSkills" },
      issuedOn: "2025-01-18",
      badge: "Amber",
      fileHash: "hijk9999mnop0000",
      txId: "0x81ca77cce000...",
      metadata: { certId: "CERT-002" }
    },
    {
      vcId: "vc3",
      title: "Cybersecurity Awareness", 
      issuer: { name: "NCVET" },
      issuedOn: "2024-11-12",
      badge: "Blue",
      fileHash: "zzz999y888x777",
      metadata: { certId: "CERT-003" }
    },
  ];

  const filteredVCS = MOCK_VCS.filter(vc =>
    vc.title.toLowerCase().includes(search.toLowerCase()) ||
    vc.issuer.name.toLowerCase().includes(search.toLowerCase()) ||
    vc.fileHash.toLowerCase().includes(search.toLowerCase())
  ).filter(vc => !filters.trust || vc.badge === filters.trust);

  const handleShare = (vc) => {
    setQrData(`https://credsone.app/verify?hash=${vc.fileHash}`);
    setShowQR(true);
  };

  const handleViewVC = (vcId) => {
    const vc = MOCK_VCS.find(v => v.vcId === vcId);
    setSelectedVC(vc);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-6">
      <WalletHeader 
        name="John Doe" 
        did="did:example:learner123" 
        stats={{ count: MOCK_VCS.length, verified: 2, pending: 1 }}
      />

      <SearchBar 
        value={search}
        onChange={setSearch}
        filters={filters}
        onFilterChange={setFilters}
      />

      {filteredVCS.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          <CredentialList 
            vcs={filteredVCS} 
            onView={handleViewVC}
            onShare={handleShare}
          />
          <ActivityFeed learnerDid="did:example:learner123" />
        </>
      )}

      {selectedVC && (
        <VCDetailModal 
          vc={selectedVC}
          onClose={() => setSelectedVC(null)}
          onShare={handleShare}
        />
      )}

      {showQR && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl shadow-xl text-center">
            <h2 className="text-lg font-semibold text-indigo-700 mb-2">
              Share this Credential
            </h2>
            {qrData && (
              <img
                src={`https://chart.googleapis.com/chart?cht=qr&chs=300x300&chl=${encodeURIComponent(qrData)}`}
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
};

export default WalletPage;