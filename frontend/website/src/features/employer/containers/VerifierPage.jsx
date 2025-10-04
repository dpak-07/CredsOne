import React, { useState, useEffect } from "react";
import VerifierHeader from "../components/VerifierHeader";
import ScanPanel from "../components/ScanPanel";
import UploadModal from "../components/UploadModal";
import VerificationResultCard from "../components/VerificationResultCard";
import VCDetailsSummary from "../components/VCDetailsSummary";
import ManualVerifyForm from "../components/ManualVerifyForm";
import VerificationHistoryList from "../components/VerificationHistoryList";
import SearchBar from "../components/SearchBar";
import BadgeLegend from "../components/BadgeLegend";
import NotificationToast from "../../../components-ui/NotificationToast";
import { useVerifierAuth } from "../hooks/useVerifierAuth";
import { useVerification } from "../hooks/useVerification";

export default function VerifierPage({ onLogout }) {
  const [activeTab, setActiveTab] = useState("scan");
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showBadgeLegend, setShowBadgeLegend] = useState(false);
  const [selectedVerification, setSelectedVerification] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [toast, setToast] = useState(null);

  const { verifier } = useVerifierAuth();
  const {
    verificationResult,
    verificationHistory,
    loading,
    error,
    verifyScan,
    verifyUpload,
    verifyManual,
    searchVerifications
  } = useVerification();

  useEffect(() => {
    if (verificationResult) {
      setToast({
        message: verificationResult.status === "valid" 
          ? "✅ Credential verified successfully!" 
          : verificationResult.status === "pending"
          ? "⏳ Verification pending..."
          : "⚠️ Verification completed",
        type: verificationResult.status === "valid" ? "success" : 
              verificationResult.status === "pending" ? "info" : "warning"
      });
    }
  }, [verificationResult]);

  useEffect(() => {
    if (error) {
      setToast({
        message: "⚠️ " + error,
        type: "warning"
      });
    }
  }, [error]);

  const handleScan = async (scannedData) => {
    await verifyScan(scannedData);
  };

  const handleUpload = async (file) => {
    console.log("Uploading file:", file.name);
    await verifyUpload(file);
    console.log("History after upload:", verificationHistory);
    setShowUploadModal(false);
  };

  const handleManualSubmit = async (formData) => {
    console.log("Manual verification:", formData);
    await verifyManual(formData);
    console.log("History after manual:", verificationHistory);
  };

  const handleSearch = async (query) => {
    setSearchQuery(query);
    if (query.trim()) {
      await searchVerifications(query);
    }
  };

  const tabs = [
    { id: "scan", label: "Scan & Upload" },
    { id: "manual", label: "Manual Verify" },
    { id: "history", label: "History" }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <VerifierHeader
        organization={verifier?.organization || "Employer"}
        verifierDid={verifier?.did || "did:example:verifier-001"}
        onLogout={onLogout}
      />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Backend Status Warning */}
        {error && error.includes("Backend offline") && (
          <div className="mb-6 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  <strong>Backend Offline:</strong> Using mock data for demonstration. 
                  Start the backend server to use real API.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="flex border-b">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 px-6 py-4 font-medium transition ${
                  activeTab === tab.id
                    ? "border-b-2 border-purple-600 text-purple-600"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {activeTab === "scan" && (
              <>
                <ScanPanel onScan={handleScan} loading={loading} />
                
                <div className="flex justify-center">
                  <button
                    onClick={() => setShowUploadModal(true)}
                    className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                  >
                    📄 Upload Certificate File
                  </button>
                </div>

                {verificationResult && (
                  <VerificationResultCard result={verificationResult} />
                )}
              </>
            )}

            {activeTab === "manual" && (
              <ManualVerifyForm onSubmit={handleManualSubmit} loading={loading} />
            )}

            {activeTab === "history" && (
              <>
                <SearchBar
                  value={searchQuery}
                  onChange={handleSearch}
                  onClear={() => { setSearchQuery(""); searchVerifications(""); }}
                  placeholder="Search by learner, issuer, certificate ID..."
                />
                <VerificationHistoryList
                  verifications={verificationHistory}
                  onSelect={setSelectedVerification}
                />
              </>
            )}
          </div>

          <div className="space-y-6">
            {selectedVerification ? (
              <VCDetailsSummary credential={selectedVerification.credential} />
            ) : (
              <BadgeLegend />
            )}

            <button
              onClick={() => setShowBadgeLegend(!showBadgeLegend)}
              className="w-full px-4 py-2 text-sm text-purple-600 border border-purple-600 rounded-lg hover:bg-purple-50 transition"
            >
              {showBadgeLegend ? "Hide" : "Show"} Badge Legend
            </button>
          </div>
        </div>
      </div>

      <UploadModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onUpload={handleUpload}
        loading={loading}
      />

      {toast && (
        <NotificationToast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
