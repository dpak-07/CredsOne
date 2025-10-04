// src/features/employer/VerifierPage.jsx
import React, { useState } from "react";
import ScanPanel from "./components/ScanPanel";
import Table from "../../components-ui/Table";
import useAuth from "../../hooks/useAuth";
import { verifyFileHash, manualVerify } from "../../services/api";

export default function VerifierPage() {
  const { user } = useAuth();
  const [result, setResult] = useState(null);
  const [auditLogs, setAuditLogs] = useState([]);
  const [error, setError] = useState(null);
  const [loadingVerify, setLoadingVerify] = useState(false);
  const [loadingManual, setLoadingManual] = useState(false);

  async function handleScan(hashOrId) {
    setError(null);
    setResult(null);
    setLoadingVerify(true);
    try {
      const res = await verifyFileHash(hashOrId);
      // normalize response if needed
      setResult(res);
      pushAudit({ action: "Scan", input: hashOrId, status: res?.status || "Unknown" });
    } catch (err) {
      console.error("verifyFileHash error", err);
      setError(err?.message || "Verification failed");
      pushAudit({ action: "Scan", input: hashOrId, status: "Error" });
    } finally {
      setLoadingVerify(false);
    }
  }

  async function handleManualVerify(file, notes) {
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
  }

  function pushAudit(entry) {
    const row = {
      date: new Date().toISOString(),
      actor: user?.name || user?.did || "verifier",
      action: entry.action,
      input: entry.input,
      status: entry.status,
    };
    setAuditLogs((prev) => [row, ...prev].slice(0, 200)); // keep latest 200
  }

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
}
