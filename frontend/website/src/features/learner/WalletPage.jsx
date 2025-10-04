// WalletPage.jsx (container)
import React, { useEffect, useState } from "react";
import CredentialList from "./components/CredentialList";
import VCDetailContainer from "./VCDetailContainer";
import useAuth from "../../hooks/useAuth";
import { getWallet } from "../../services/api";
import useCachedVCs from "../../hooks/useCachedVCs";
import NotificationToast from "../../components-ui/NotificationToast";

export default function WalletPage() {
  const { user } = useAuth(); // expects { did, name, ... }
  const [vcs, setVcs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedVCId, setSelectedVCId] = useState(null);
  const [error, setError] = useState(null);

  const cache = useCachedVCs(); // { getVC, setVC, prefetchVCs } - optional

  useEffect(() => {
    if (!user?.did) return;
    setLoading(true);
    setError(null);

    getWallet(user.did)
      .then((data) => {
        // backend returns { vcs: [...] } or array; normalize
        const results = Array.isArray(data) ? data : data?.vcs ?? [];
        setVcs(results);

        // optional: prefill cache for items that include minimal vc metadata
        if (cache?.setMany) {
          const partial = results
            .filter((v) => v?.id)
            .map((v) => ({ id: v.id, meta: v }));
          cache.setMany(partial);
        }
      })
      .catch((err) => {
        console.error("getWallet error", err);
        setError(err?.message || "Failed to load wallet");
      })
      .finally(() => setLoading(false));
  }, [user]);

  function handleOpenVC(vc) {
    if (!vc?.id) return;
    setSelectedVCId(vc.id);
  }

  return (
    <main className="p-6">
      <header className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">My Wallet</h1>
          <p className="text-sm text-gray-600">{user?.name || user?.did}</p>
        </div>
      </header>

      {loading && <div className="text-sm text-gray-500">Loading credentials…</div>}
      {error && <div className="text-sm text-red-600 mb-4">{error}</div>}

      {!loading && !vcs.length && <div className="text-gray-500">No credentials yet.</div>}

      {!loading && vcs.length > 0 && (
        <CredentialList vcs={vcs} view="cards" onSelect={handleOpenVC} />
      )}

      {/* VC detail modal / container */}
      {selectedVCId && (
        <VCDetailContainer
          vcId={selectedVCId}
          onClose={() => setSelectedVCId(null)}
          cache={cache}
        />
      )}

      {/* toast for global notifications (example usage) */}
      <NotificationToast
        message={null}
        onClose={() => {}}
      />
    </main>
  );
}
