// src/features/learner/WalletPage.jsx
import React, { useEffect, useState } from "react";
import CredentialList from "./components/CredentialList";
import VCDetailContainer from "./VCDetailContainer";
import useAuth from "../../hooks/useAuth";
import useCachedVCs from "../../hooks/useCachedVCs";
import { getWallet } from "../../services/api";

/**
 * WalletPage
 * Learner dashboard: shows credentials and lets the learner view details.
 */
export default function WalletPage() {
  const { user } = useAuth(); // { did, name, ... }
  const cache = useCachedVCs();

  const [credentials, setCredentials] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    async function loadWallet() {
      if (!user?.did) return;
      setLoading(true);
      setError(null);
      try {
        const res = await getWallet(user.did); // backend call
        const vcs = res?.vcs || res || [];
        setCredentials(vcs);
        cache.setMany(vcs);
      } catch (err) {
        console.error("loadWallet error", err);
        setError("Failed to load wallet");
      } finally {
        setLoading(false);
      }
    }
    loadWallet();
  }, [user, cache]);

  return (
    <main className="p-6">
      <header className="mb-6">
        <h1 className="text-2xl font-bold">My Wallet</h1>
        <p className="text-sm text-gray-600">
          {user ? `Learner DID: ${user.did}` : "Not signed in"}
        </p>
      </header>

      {loading && <div className="text-sm text-gray-500">Loading credentials…</div>}
      {error && <div className="text-sm text-red-600">{error}</div>}

      {!loading && !error && (
        <CredentialList
          vcs={credentials}
          view="grid"
          onSelect={(vc) => setSelected(vc)}
        />
      )}

      {selected && (
        <VCDetailContainer
          vcId={selected.id || selected.vcId}
          onClose={() => setSelected(null)}
          cache={cache}
        />
      )}
    </main>
  );
}
