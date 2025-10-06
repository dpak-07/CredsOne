import React, { useState, useEffect } from "react";
import VerifierHeader from "../components/VerifierHeader";
import ScanPanel from "../components/ScanPanel";
import VerificationResultCard from "../components/VerificationResultCard";
import VCDetailsSummary from "../components/VCDetailsSummary";
import ManualVerifyForm from "../components/ManualVerifyForm";
import VerificationHistoryList from "../components/VerificationHistoryList";
import SearchBar from "../components/SearchBar";
import BadgeLegend from "../components/BadgeLegend";
import NotificationToast from "../../../components-ui/NotificationToast";
import { useVerifierAuth } from "../../../hooks/employer-hooks/useVerifierAuth";
import { useVerification } from "../../../hooks/employer-hooks/useVerification";
import { useScanner } from "../../../hooks/employer-hooks/useScanner";

export default function VerifierPage({ onLogout }) {
  const [activeTab, setActiveTab] = useState("scan");
  const [showScanPanel, setShowScanPanel] = useState(false);
  const [showManualForm, setShowManualForm] = useState(false);
  const [selectedVerification, setSelectedVerification] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [toast, setToast] = useState(null);

  const { verifier, orgName, orgDid, logout } = useVerifierAuth();
  const {
    verificationResult,
    verificationHistory,
    loading,
    error,
    verifyScan,
    verifyManual,
    searchVerifications
  } = useVerification();

  const { scanning, error: scanError, startScan, stopScan } = useScanner();

  useEffect(() => {
    if (verificationResult) {
      setToast({
        message: verificationResult.status === "valid" 
          ? " Credential verified successfully!" 
          : verificationResult.status === "pending"
          ? " Verification pending review..."
          : " Verification completed",
        type: verificationResult.status === "valid" ? "success" : 
              verificationResult.status === "pending" ? "info" : "warning"
      });
    }
  }, [verificationResult]);

  useEffect(() => {
    if (error) {
      setToast({
        message: " " + error,
        type: "warning"
      });
    }
  }, [error]);

  const handleScanClick = () => {
    setShowScanPanel(true);
  };

  const handleScanDetect = async (scannedData) => {
    console.log("QR detected:", scannedData);
    setShowScanPanel(false);
    stopScan();
    await verifyScan(scannedData);
  };

  const handleManualSubmit = async (formData) => {
    console.log("Manual verification:", formData);
    await verifyManual(formData);
    setShowManualForm(false);
  };

  const handleSearch = async (query) => {
    setSearchQuery(query);
    if (query.trim()) {
      await searchVerifications(query);
    }
  };

  const handleLogout = () => {
    logout();
    onLogout();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <VerifierHeader
        organizationName={orgName}
        verifierDID={orgDid}
        verifiedToday={verificationHistory.filter(v => 
          new Date(v.verifiedAt).toDateString() === new Date().toDateString()
        ).length}
        verifiedMonth={verificationHistory.length}
        onLogout={handleLogout}
      />

      {error && error.includes("Backend offline") && (
        <div className="bg-yellow-50 border-b border-yellow-200 px-4 py-3">
          <div className="max-w-7xl mx-auto flex items-center">
            <span className="text-yellow-800 text-sm font-medium">
               Backend offline - Using mock data for demonstration
            </span>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab("scan")}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition ${
                  activeTab === "scan"
                    ? "border-purple-500 text-purple-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                 Scan QR Code
              </button>
              <button
                onClick={() => setActiveTab("manual")}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition ${
                  activeTab === "manual"
                    ? "border-purple-500 text-purple-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                 Manual Entry
              </button>
              <button
                onClick={() => setActiveTab("history")}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition ${
                  activeTab === "history"
                    ? "border-purple-500 text-purple-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                 History
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === "scan" && (
              <div>
                <div className="text-center py-12">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Scan Credential QR Code</h2>
                  <p className="text-gray-600 mb-8">
                    Ask the learner to show their credential QR code and click the button below to scan it.
                  </p>
                  <button
                    onClick={handleScanClick}
                    className="px-8 py-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition text-lg font-semibold"
                  >
                     Start QR Scanner
                  </button>
                </div>

                {verificationResult && verificationResult.method === "QR Scan" && (
                  <div className="mt-6">
                    <VerificationResultCard result={verificationResult} />
                  </div>
                )}

                <div className="mt-6">
                  <BadgeLegend />
                </div>
              </div>
            )}

            {activeTab === "manual" && (
              <div>
                {!showManualForm ? (
                  <div className="text-center py-12">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Manual Credential Verification</h2>
                    <p className="text-gray-600 mb-8">
                      Enter credential details manually to verify against the blockchain.
                    </p>
                    <button
                      onClick={() => setShowManualForm(true)}
                      className="px-8 py-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition text-lg font-semibold"
                    >
                       Enter Credential Details
                    </button>
                  </div>
                ) : (
                  <ManualVerifyForm
                    onSubmit={handleManualSubmit}
                    onCancel={() => setShowManualForm(false)}
                  />
                )}

                {verificationResult && verificationResult.method === "Manual Entry" && (
                  <div className="mt-6">
                    <VerificationResultCard result={verificationResult} />
                  </div>
                )}
              </div>
            )}

            {activeTab === "history" && (
              <div>
                <div className="mb-4">
                  <SearchBar
                    value={searchQuery}
                    onChange={handleSearch}
                    onClear={() => {
                      setSearchQuery("");
                      handleSearch("");
                    }}
                  />
                </div>

                <VerificationHistoryList
                  verifications={verificationHistory}
                  onSelect={setSelectedVerification}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      <ScanPanel
        isOpen={showScanPanel}
        onClose={() => {
          setShowScanPanel(false);
          stopScan();
        }}
        onDetect={handleScanDetect}
        scanning={scanning}
        error={scanError}
        startScan={startScan}
      />

      <NotificationToast
        message={toast?.message}
        type={toast?.type}
        onClose={() => setToast(null)}
      />
    </div>
  );
}
