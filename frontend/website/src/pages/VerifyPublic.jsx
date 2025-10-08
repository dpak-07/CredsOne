// Public verification page
// src/pages/VerifyPublic.jsx
import React, { useState } from "react";

export default function VerifyPublic() {
  const [input, setInput] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [result, setResult] = useState(null);

  const handleVerify = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    setVerifying(true);
    setResult(null);

    // Simulate API delay and random verification status
    setTimeout(() => {
      const statuses = ["Verified", "On-chain", "Pending", "Revoked"];
      const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
      setResult({
        id: input.trim(),
        status: randomStatus,
        issuer: "CredsOne Institute",
        issued: "2025-01-10",
        validTill: "2028-01-10",
      });
      setVerifying(false);
    }, 1200);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gradient-to-br from-indigo-100 via-pink-100 to-yellow-50">
      <div className="max-w-lg w-full bg-white rounded-2xl shadow-xl p-8 border border-slate-200">
        <h1 className="text-2xl font-bold text-center text-slate-800">
          Public Verification 🔍
        </h1>
        <p className="text-sm text-slate-500 text-center mt-1">
          Enter a credential ID to check its authenticity.
        </p>

        <form onSubmit={handleVerify} className="mt-6 flex gap-2">
          <input
            type="text"
            placeholder="Enter credential ID"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-400 outline-none"
          />
          <button
            type="submit"
            disabled={verifying}
            className="px-4 py-2 rounded-lg bg-indigo-600 text-white font-semibold shadow hover:bg-indigo-700 disabled:opacity-60"
          >
            {verifying ? "Verifying..." : "Verify"}
          </button>
        </form>

        <div className="mt-6">
          {verifying && (
            <div className="text-center text-slate-500 mt-4">
              ⏳ Checking blockchain and registry...
            </div>
          )}

          {result && (
            <div className="mt-6 p-4 border rounded-lg bg-white shadow-sm">
              <h3 className="font-semibold text-slate-700 mb-2">
                Result for <span className="text-indigo-600">{result.id}</span>
              </h3>
              <div className="text-sm text-slate-600 space-y-1">
                <div>
                  <strong>Status:</strong>{" "}
                  <span
                    className={`font-semibold ${
                      result.status === "Verified"
                        ? "text-green-600"
                        : result.status === "On-chain"
                        ? "text-blue-600"
                        : result.status === "Pending"
                        ? "text-amber-600"
                        : "text-red-600"
                    }`}
                  >
                    {result.status}
                  </span>
                </div>
                <div>
                  <strong>Issuer:</strong> {result.issuer}
                </div>
                <div>
                  <strong>Issued on:</strong> {result.issued}
                </div>
                <div>
                  <strong>Valid till:</strong> {result.validTill}
                </div>
              </div>
            </div>
          )}

          {!verifying && !result && (
            <div className="text-center text-slate-400 text-sm mt-4">
              Try entering something like <code>CREDS-0001-2025</code>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
