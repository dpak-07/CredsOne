// src/features/institution/IssuerPage.jsx
import React, { useState } from "react";
import OCRPreview from "./components/OCRPreview";
import { issueCredential } from "../../services/api";
import Modal from "../../components-ui/Modal";

export default function IssuerPage() {
  const [file, setFile] = useState(null);
  const [fields, setFields] = useState({ learnerDid: "", courseId: "", certId: "", metadata: "" });
  const [status, setStatus] = useState(null);
  const [issuedVC, setIssuedVC] = useState(null);
  const [error, setError] = useState(null);

  function handleFileChange(e) {
    setFile(e.target.files[0]);
    setError(null);
    setIssuedVC(null);
  }

  function handleFieldsChange(updates) {
    setFields((prev) => ({ ...prev, ...updates }));
  }

  async function handleIssue() {
    if (!file) {
      setError("Please upload a certificate file.");
      return;
    }
    setStatus("issuing");
    setError(null);
    try {
      const res = await issueCredential(file, fields);
      setIssuedVC(res);
      setStatus("success");
    } catch (err) {
      console.error("issueCredential error", err);
      setError(err?.message || "Issuance failed");
      setStatus("error");
    }
  }

  return (
    <main className="p-6">
      <header className="mb-6">
        <h1 className="text-2xl font-bold">Institution / Issuer Dashboard</h1>
      </header>

      <section className="p-4 border rounded bg-white shadow-sm space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Upload Certificate File</label>
          <input type="file" onChange={handleFileChange} className="text-sm" />
        </div>

        {file && (
          <OCRPreview fields={fields} onChange={handleFieldsChange} />
        )}

        <div>
          <button
            onClick={handleIssue}
            disabled={status === "issuing"}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {status === "issuing" ? "Issuing…" : "Issue Credential"}
          </button>
        </div>
      </section>

      {error && <div className="mt-4 text-red-600">{error}</div>}

      {issuedVC && (
        <Modal isOpen={true} onClose={() => setIssuedVC(null)} title="Issuance Success">
          <p className="mb-2">Credential issued successfully!</p>
          {issuedVC?.txId && (
            <p className="text-sm mb-2">
              Blockchain Tx:{" "}
              <a
                href={`https://mumbai.polygonscan.com/tx/${issuedVC.txId}`}
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 underline"
              >
                {issuedVC.txId}
              </a>
            </p>
          )}
          <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto max-h-64">
            {JSON.stringify(issuedVC, null, 2)}
          </pre>
        </Modal>
      )}
    </main>
  );
}
