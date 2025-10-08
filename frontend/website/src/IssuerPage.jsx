import React, { useState } from "react";

// Modal component moved inline
const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
      <div className="bg-white rounded-lg shadow-lg w-11/12 max-w-lg p-6">
        <header className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </header>
        <div>{children}</div>
      </div>
    </div>
  );
};

// IssuerHeader component moved inline
const IssuerHeader = ({ orgName, issuerDid, keyStatus }) => {
  return (
    <header className="flex items-center justify-between border-b pb-2">
      <div>
        <h1 className="text-2xl font-bold">{orgName}</h1>
        <p className="text-sm text-gray-600">Issuer DID: {issuerDid}</p>
      </div>
      <div>
        <span
          className={`px-2 py-1 text-sm rounded ${
            keyStatus === "Active"
              ? "bg-green-200 text-green-800"
              : "bg-red-200 text-red-800"
          }`}
        >
          Key Status: {keyStatus}
        </span>
      </div>
    </header>
  );
};

// UploadModal component moved inline
const UploadModal = ({ onClose, onFileSelect }) => {
  return (
    <Modal isOpen={true} onClose={onClose} title="Upload Certificate">
      <input type="file" onChange={onFileSelect} className="text-sm" />
    </Modal>
  );
};

// OCRPreview component moved inline
const OCRPreview = ({ fields, onChange }) => {
  const InputField = ({ label, value, onChange: onFieldChange }) => (
    <div className="mb-3">
      <label className="block text-sm font-medium mb-1">{label}</label>
      <input
        type="text"
        value={value}
        onChange={onFieldChange}
        className="w-full border rounded p-2 text-sm"
      />
    </div>
  );

  return (
    <div className="p-3 border rounded bg-gray-50 space-y-3">
      <h2 className="text-md font-semibold">Certificate Details (OCR Extracted)</h2>
      <InputField
        label="Learner DID / Email"
        value={fields.learnerDid}
        onChange={(e) => onChange({ learnerDid: e.target.value })}
      />
      <InputField
        label="Course ID"
        value={fields.courseId}
        onChange={(e) => onChange({ courseId: e.target.value })}
      />
      <InputField
        label="Certificate ID"
        value={fields.certId}
        onChange={(e) => onChange({ certId: e.target.value })}
      />
      <InputField
        label="Metadata"
        value={fields.metadata}
        onChange={(e) => onChange({ metadata: e.target.value })}
      />
    </div>
  );
};

// FieldEditor component moved inline
const FieldEditor = ({ fields, onChange }) => {
  const InputField = ({ label, value, onChange: onFieldChange }) => (
    <div className="mb-3">
      <label className="block text-sm font-medium mb-1">{label}</label>
      <input
        type="text"
        value={value}
        onChange={onFieldChange}
        className="w-full border rounded p-2 text-sm"
      />
    </div>
  );

  return (
    <div className="p-3 border rounded bg-gray-50 space-y-3">
      <h2 className="text-md font-semibold">Field Editor</h2>
      {Object.keys(fields).map((key) => (
        <InputField
          key={key}
          label={key}
          value={fields[key]}
          onChange={(e) => onChange({ [key]: e.target.value })}
        />
      ))}
    </div>
  );
};

// BulkUploadPanel component moved inline
const BulkUploadPanel = () => {
  return (
    <section className="p-4 border rounded bg-white shadow-sm">
      <h2 className="font-semibold text-lg mb-2">Bulk Upload</h2>
      <p className="text-sm text-gray-600">Upload CSV + files for batch issuance.</p>
      <input type="file" accept=".csv" className="mt-2 text-sm" />
    </section>
  );
};

// IssuanceQueue component moved inline
const IssuanceQueue = () => {
  return (
    <section className="p-4 border rounded bg-white shadow-sm">
      <h2 className="font-semibold text-lg mb-2">Issuance Queue</h2>
      <ul className="text-sm space-y-1">
        <li>Pending issuance #123</li>
        <li>In progress issuance #124</li>
        <li>Completed issuance #122 ✅</li>
      </ul>
    </section>
  );
};

// KeyManagementCard component moved inline
const KeyManagementCard = () => {
  return (
    <section className="p-4 border rounded bg-white shadow-sm">
      <h2 className="font-semibold text-lg mb-2">Key Management</h2>
      <p className="text-sm">Current Key Status: Active</p>
      <button className="mt-2 px-3 py-1 bg-gray-200 rounded hover:bg-gray-300">
        Rotate Keys
      </button>
    </section>
  );
};

// MigrationToolUI component moved inline
const MigrationToolUI = () => {
  return (
    <section className="p-4 border rounded bg-white shadow-sm">
      <h2 className="font-semibold text-lg mb-2">Migration Tool</h2>
      <p className="text-sm text-gray-600">
        Ingest legacy credentials and mark as Amber.
      </p>
      <button className="mt-2 px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600">
        Migrate Legacy
      </button>
    </section>
  );
};

// AuditLogs component moved inline
const AuditLogs = ({ logs = [] }) => {
  const defaultLogs = [
    { ts: "2025-10-04", msg: "Issued VC #123 → Learner DID: abc123" },
    { ts: "2025-10-03", msg: "Key Rotated" },
  ];

  const entries = logs.length ? logs : defaultLogs;

  return (
    <section className="p-4 border rounded bg-white shadow-sm">
      <h2 className="font-semibold text-lg mb-2">Audit Log</h2>
      <ul className="text-sm space-y-2">
        {entries.map((l, i) => (
          <li key={i} className="flex items-start gap-3">
            <span className="text-xs text-slate-500 w-28">{l.ts}</span>
            <span className="break-words">{l.msg}</span>
          </li>
        ))}
      </ul>
    </section>
  );
};

// SignedVCViewer component moved inline
const SignedVCViewer = ({ vc }) => {
  return (
    <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto max-h-64">
      {JSON.stringify(vc, null, 2)}
    </pre>
  );
};

// Mock API function
const issueCredential = async (file, fields) => {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        txId: "0x" + Math.random().toString(16).substr(2, 64),
        id: "vc-" + Date.now(),
        ...fields,
        issued: new Date().toISOString(),
      });
    }, 2000);
  });
};

// Main IssuerPage component
const IssuerPage = () => {
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

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setError(null);
    setIssuedVC(null);
  };

  const handleFieldsChange = (updates) => {
    setFields((prev) => ({ ...prev, ...updates }));
  };

  const handleIssue = async () => {
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
  };

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
};

export default IssuerPage;