// src/features/institution/IssuerPage.jsx
import React, { useState } from "react";
import OCRPreview from "./components/OCRPreview";
import { issueCredential } from "../../services/api";
import Modal from "../../components-ui/Modal";

// Dashboard components
import IssuerHeader from "./components/IssuerHeader";
import UploadModal from "./components/UploadModal";
import FieldEditor from "./components/FieldEditor";
import BulkUploadPanel from "./components/BulkUploadPanel";
import IssuanceQueue from "./components/IssuanceQueue";
import KeyManagementCard from "./components/KeyManagementCard";
import MigrationToolUI from "./components/MigrationToolUI";
import AuditLogs from "./components/AuditLogs";
import SignedVCViewer from "./components/SignedVCViewer";

export default function IssuerPage() {
  const [file, setFile] = useState(null);
  const [fields, setFields] = useState({
    learnerDid: "",
    courseId: "",
    certId: "",
    metadata: "",
  });
  const [status, setStatus] = useState(null);
  const [issuedVC, setIssuedVC] = useState(null);
  const [error, setError] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);

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
    <main className="p-6 space-y-6">
      {/* Header */}
      <IssuerHeader
        orgName="ABC University"
        issuerDid="did:example:issuer123"
        keyStatus="Active"
      />

      {/* Manual Issue */}
      <section className="p-4 border rounded bg-white shadow-sm space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="font-semibold text-lg">Manual Issuance</h2>
          <button
            onClick={() => setShowUploadModal(true)}
            className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Upload Certificate
          </button>
        </div>

        {file && (
          <>
            <OCRPreview fields={fields} onChange={handleFieldsChange} />
            <FieldEditor fields={fields} onChange={handleFieldsChange} />

            <div>
              <button
                onClick={handleIssue}
                disabled={status === "issuing"}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
              >
                {status === "issuing" ? "Issuing…" : "Issue Credential"}
              </button>
            </div>
          </>
        )}
      </section>

      {/* Bulk Upload */}
      <BulkUploadPanel />

      {/* Issuance Queue */}
      <IssuanceQueue />

      {/* Key Management */}
      <KeyManagementCard />

      {/* Migration Tool */}
      <MigrationToolUI />

      {/* Audit Log */}
      <AuditLogs />

      {/* Success Modal */}
      {issuedVC && (
        <Modal
          isOpen={true}
          onClose={() => setIssuedVC(null)}
          title="Issuance Success"
        >
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
          <SignedVCViewer vc={issuedVC} />
        </Modal>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <UploadModal
          onClose={() => setShowUploadModal(false)}
          onFileSelect={handleFileChange}
        />
      )}

      {error && <div className="mt-4 text-red-600">{error}</div>}
    </main>
  );
}
