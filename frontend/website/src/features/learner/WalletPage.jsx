// src/features/learner/WalletPage.jsx
import React, { useEffect, useState, useMemo } from "react";
import api from "../../services/api"; // your axios wrapper
import CredentialList from "./components/CredentialList";
import VCDetailContainer from "./VCDetailContainer";

/**
 * WalletPage
 * - fetches wallet via GET /api/wallet/:learnerDid
 * - orchestrates search/filter, cache and open-detail
 *
 * Props (if any): none — uses auth from localStorage or global auth provider
 * Assumes: learnerDid is available (simplest: from auth token or localStorage)
 */

function WalletHeader({ name, did, credit }) {
  return (
    <div className="flex items-center justify-between p-4 bg-white rounded shadow">
      <div>
        <h1 className="text-2xl font-semibold">Hello, {name}</h1>
        <p className="text-sm text-slate-500">DID: <span className="font-mono">{did}</span></p>
      </div>
      <div className="text-right">
        <p className="text-sm text-slate-500">Credits</p>
        <p className="text-xl font-bold">{credit ?? 0}</p>
      </div>
    </div>
  );
}

function SearchBar({ onSearch, filters, setFilters }) {
  return (
    <div className="flex gap-3 items-center my-4">
      <input
        type="search"
        placeholder="Search by course, issuer, certId..."
        onChange={(e) => onSearch(e.target.value)}
        className="flex-1 p-2 border rounded"
      />
      <select
        value={filters.badge || ""}
        onChange={(e) => setFilters((f) => ({ ...f, badge: e.target.value }))}
        className="p-2 border rounded"
      >
        <option value="">All badges</option>
        <option value="Green">Green</option>
        <option value="Amber">Amber</option>
        <option value="Blue">Blue</option>
      </select>
      <input
        type="date"
        onChange={(e) => setFilters((f) => ({ ...f, dateFrom: e.target.value }))}
        className="p-2 border rounded"
      />
    </div>
  );
}

export default function WalletPage() {
  const [vcs, setVcs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({});
  const [selectedVcId, setSelectedVcId] = useState(null);
  const [learner, setLearner] = useState({ name: "Learner", did: "did:example:learner123", credit: 0 });
  const [error, setError] = useState(null);

  // Basic in-memory cache invalidation key (could be replaced by context)
  useEffect(() => {
    let isMounted = true;
    async function fetchWallet() {
      setLoading(true);
      setError(null);
      try {
        // derive learnerDid from auth provider / localStorage
        const learnerDid = learner.did;
        const res = await api.get(`/wallet/${encodeURIComponent(learnerDid)}`);
        if (!isMounted) return;
        setVcs(res.data || []);
      } catch (err) {
        console.error("wallet fetch error", err);
        setError("Could not load wallet. Check network or auth.");
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    fetchWallet();
    return () => { isMounted = false; };
  }, []); // run once

  // client-side filtering & search
  const filtered = useMemo(() => {
    return vcs.filter((vc) => {
      if (filters.badge && vc.badge !== filters.badge) return false;
      if (filters.dateFrom) {
        const dt = new Date(vc.issuedOn);
        const from = new Date(filters.dateFrom);
        if (dt < from) return false;
      }
      if (!search) return true;
      const q = search.toLowerCase();
      return (
        (vc.title && vc.title.toLowerCase().includes(q)) ||
        (vc.issuer?.name && vc.issuer.name.toLowerCase().includes(q)) ||
        (vc.metadata?.certId && vc.metadata.certId.toLowerCase().includes(q))
      );
    });
  }, [vcs, search, filters]);

  // helper to compute local hash preview (optional)
  async function hashFilePreview(file) {
    // using SubtleCrypto
    const buffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
  }

  return (
    <div className="p-6 space-y-6">
      <WalletHeader name={learner.name} did={learner.did} credit={learner.credit} />
      <SearchBar onSearch={setSearch} filters={filters} setFilters={setFilters} />
      {error && <div className="text-red-600">{error}</div>}
      {loading ? (
        <div className="p-6 bg-white rounded shadow text-center">Loading credentials…</div>
      ) : (
        <>
          {filtered.length === 0 ? (
            <div className="p-8 bg-white rounded shadow text-center">
              <h3 className="text-lg font-semibold">No credentials yet</h3>
              <p className="text-sm text-slate-500 mt-2">Upload or request issuance from your institution.</p>
            </div>
          ) : (
            <CredentialList vcs={filtered} onView={(vcId) => setSelectedVcId(vcId)} />
          )}
        </>
      )}

      {/* Detail modal container */}
      {selectedVcId && (
        <VCDetailContainer
          vcId={selectedVcId}
          onClose={() => setSelectedVcId(null)}
        />
      )}
    </div>
  );
}
