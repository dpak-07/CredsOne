import React, { useState } from "react";

// Table component moved inline
const Table = ({ columns = [], data = [] }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border border-gray-200 divide-y divide-gray-200 rounded-lg shadow-sm">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className="px-4 py-2 text-left text-sm font-semibold text-gray-700"
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 bg-white">
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="px-4 py-4 text-center text-gray-500 text-sm"
              >
                No records found
              </td>
            </tr>
          ) : (
            data.map((row, rowIndex) => (
              <tr key={rowIndex} className="hover:bg-gray-50">
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className="px-4 py-2 text-sm text-gray-700"
                  >
                    {typeof col.render === "function"
                      ? col.render(row[col.key], row)
                      : row[col.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

// ScanPanel component moved inline
const ScanPanel = ({ onScan, onManualVerify }) => {
  const [manualFile, setManualFile] = useState(null);
  const [notes, setNotes] = useState("");
  const [useClientHash, setUseClientHash] = useState(true);
  const [hash, setHash] = useState("");
  const [progress, setProgress] = useState(0);
  const [hashError, setHashError] = useState(null);

  // Mock file hashing
  const hashFile = async (file) => {
    return new Promise((resolve) => {
      setProgress(0);
      setHashError(null);
      
      // Simulate hashing progress
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            const mockHash = "mock-hash-" + Math.random().toString(36).substr(2, 16);
            setHash(mockHash);
            resolve(mockHash);
            return 100;
          }
          return prev + 10;
        });
      }, 100);
    });
  };

  const handleSimulateScan = () => {
    const dummy = "simulated-fileHash-abc123";
    onScan?.(dummy);
  };

  const handleFileChange = (e) => {
    const f = e.target.files?.[0] ?? null;
    setManualFile(f);
    if (f && useClientHash) {
      // compute client-side hash
      hashFile(f).catch((err) => {
        console.error("hashFile error", err);
      });
    }
  };

  const handleSubmitManual = async (e) => {
    e?.preventDefault();
    if (!manualFile) return;

    // If parent provided only onScan and we have a client hash, use quick verify
    if (!onManualVerify && hash) {
      onScan?.(hash);
      // reset UI
      setManualFile(null);
      setNotes("");
      return;
    }

    // Otherwise call parent's manual verify handler with file + notes
    await onManualVerify?.(manualFile, notes);
    setManualFile(null);
    setNotes("");
  };

  return (
    <div className="p-4 border rounded-lg bg-white shadow-sm">
      <h2 className="text-lg font-semibold mb-3">Verification</h2>

      {/* Simulated QR */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">Scan QR (simulated)</label>
        <div className="border rounded p-3 flex flex-col gap-2">
          <p className="text-sm text-gray-600">
            QR scanning is not enabled. Install a QR library later to enable camera scanning.
          </p>
          <div className="flex gap-2">
            <button
              onClick={handleSimulateScan}
              className="px-3 py-2 bg-blue-600 text-white rounded"
            >
              Simulate QR Scan
            </button>
            <button
              onClick={() =>
                navigator.clipboard?.writeText?.("simulated-fileHash-abc123")
              }
              className="px-3 py-2 border rounded"
            >
              Copy Dummy Hash
            </button>
          </div>
        </div>
      </div>

      {/* Manual Upload */}
      <form onSubmit={handleSubmitManual} className="space-y-3">
        <label className="block text-sm font-medium">Upload certificate (manual verify)</label>
        <input type="file" onChange={handleFileChange} className="block w-full text-sm" />

        <div className="flex items-center gap-3">
          <label className="inline-flex items-center text-sm">
            <input
              type="checkbox"
              checked={useClientHash}
              onChange={(e) => setUseClientHash(e.target.checked)}
              className="mr-2"
            />
            Compute client hash (SHA-256)
          </label>

          {useClientHash && (
            <div className="text-sm text-gray-600 ml-4">
              {hash ? (
                <div>
                  <div>
                    Hash: <code className="break-all">{hash}</code>
                  </div>
                  <div className="text-xs text-gray-500">Progress: {progress}%</div>
                </div>
              ) : hashError ? (
                <div className="text-red-600 text-xs">Hash error</div>
              ) : (
                <div className="text-xs text-gray-400">No file hashed yet</div>
              )}
            </div>
          )}
        </div>

        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Verifier notes (optional)"
          className="w-full border rounded p-2 text-sm"
          rows={3}
        />

        <div className="flex items-center gap-3">
          <button
            type="submit"
            className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-900 disabled:opacity-50"
            disabled={!!(useClientHash && manualFile && !hash)}
          >
            {onManualVerify ? "Submit Manual Verify" : "Use Hash for Verify"}
          </button>

          {/* If a hash exists allow quick verify via onScan */}
          {hash && (
            <button
              type="button"
              onClick={() => onScan?.(hash)}
              className="px-3 py-2 border rounded"
            >
              Verify using hash
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

// Mock API functions
const verifyFileHash = async (hashOrId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        status: "Valid",
        credential: {
          title: "Sample Credential",
          issuer: "Test University",
          issuedOn: new Date().toISOString(),
        },
        hash: hashOrId,
      });
    }, 1500);
  });
};

const manualVerify = async (file, notes) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        status: "Manual Review",
        file: file.name,
        notes,
        timestamp: new Date().toISOString(),
      });
    }, 2000);
  });
};

// Mock auth hook
const useAuth = () => {
  return {
    user: {
      name: "Verifier User",
      did: "did:example:verifier123",
    },
  };
};

// Main VerifierPage component
const VerifierPage = () => {
  const { user } = useAuth();
  const [result, setResult] = useState(null);
  const [auditLogs, setAuditLogs] = useState([]);
  const [error, setError] = useState(null);
  const [loadingVerify, setLoadingVerify] = useState(false);
  const [loadingManual, setLoadingManual] = useState(false);

  const handleScan = async (hashOrId) => {
    setError(null);
    setResult(null);
    setLoadingVerify(true);
    try {
      const res = await verifyFileHash(hashOrId);
      setResult(res);
      pushAudit({ action: "Scan", input: hashOrId, status: res?.status || "Unknown" });
    } catch (err) {
      console.error("verifyFileHash error", err);
      setError(err?.message || "Verification failed");
      pushAudit({ action: "Scan", input: hashOrId, status: "Error" });
    } finally {
      setLoadingVerify(false);
    }
  };

  const handleManualVerify = async (file, notes) => {
    setError(null);
    setResult(null);
    setLoadingManual(true);
    try {
      const res = await manualVerify(file, notes);
      setResult(res);
      pushAudit({ action: "ManualVerify", input: file?.name || "file", status: res?.status || "Recorded" });
    } catch (err) {
      console.error("manualVerify error", err);
      setError(err?.message || "Manual verification failed");
      pushAudit({ action: "ManualVerify", input: file?.name || "file", status: "Error" });
    } finally {
      setLoadingManual(false);
    }
  };

  const pushAudit = (entry) => {
    const row = {
      date: new Date().toISOString(),
      actor: user?.name || user?.did || "verifier",
      action: entry.action,
      input: entry.input,
      status: entry.status,
    };
    setAuditLogs((prev) => [row, ...prev].slice(0, 200));
  };

  const columns = [
    { key: "date", header: "Date" , render: (val) => new Date(val).toLocaleString() },
    { key: "actor", header: "Verifier" },
    { key: "action", header: "Action" },
    { key: "input", header: "Input" },
    {
      key: "status",
      header: "Status",
      render: (value) => (
        <span className={`px-2 py-1 rounded-full text-xs ${
          (value || "").toLowerCase().includes("valid") ? "bg-green-100 text-green-700"
          : (value || "").toLowerCase().includes("amber") ? "bg-yellow-100 text-yellow-700"
          : (value || "").toLowerCase().includes("manual") ? "bg-blue-100 text-blue-700"
          : "bg-gray-100 text-gray-700"
        }`}>
          {value}
        </span>
      ),
    },
  ];

  return (
    <main className="p-6">
      <header className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Verifier Dashboard</h1>
          <p className="text-sm text-gray-600">{user ? `Signed in as ${user.name || user.did}` : "Not signed in"}</p>
        </div>
      </header>

      <section>
        <ScanPanel onScan={handleScan} onManualVerify={handleManualVerify} />
      </section>

      {loadingVerify && <div className="mt-4 text-sm text-gray-500">Verifying…</div>}
      {loadingManual && <div className="mt-4 text-sm text-gray-500">Submitting manual verification…</div>}
      {error && <div className="mt-4 text-sm text-red-600">{error}</div>}

      {result && (
        <section className="mt-6 p-4 border rounded bg-gray-50">
          <h2 className="text-lg font-semibold mb-2">Verification Result</h2>
          <pre className="text-sm bg-white p-3 rounded border max-h-64 overflow-auto">
            {JSON.stringify(result, null, 2)}
          </pre>
        </section>
      )}

      <section className="mt-8">
        <h2 className="text-lg font-semibold mb-2">Audit Logs</h2>
        <Table columns={columns} data={auditLogs} />
      </section>
    </main>
  );
};

export default VerifierPage;