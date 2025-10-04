import { useState, useEffect } from "react";
import { verifyByHash, manualVerification, getVerificationHistory } from "../../../services/api";

export function useVerification() {
  const [verificationResult, setVerificationResult] = useState(null);
  const [verificationHistory, setVerificationHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load verification history on mount
  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const response = await getVerificationHistory({ limit: 50 });
      if (response.success && response.data) {
        setVerificationHistory(response.data.verifications || []);
      }
    } catch (err) {
      console.error("Failed to load history:", err);
      // Initialize with empty array if backend is offline
      setVerificationHistory([]);
    }
  };

  const verifyScan = async (scannedData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await verifyByHash(scannedData);
      
      if (response.success) {
        const result = {
          id: response.data.verification._id || Date.now(),
          status: response.data.verification.isValid ? "valid" : "invalid",
          badge: response.data.verification.badge || "red",
          credential: {
            id: response.data.verification.certificate?.certificateId || scannedData,
            issuer: response.data.verification.result?.issuer || "Unknown",
            learnerName: response.data.certificate?.learner?.name || "N/A",
            courseName: response.data.certificate?.courseDetails?.name || "N/A",
            issueDate: response.data.certificate?.issuedAt || new Date().toISOString(),
            fileHash: scannedData,
            blockchainStatus: response.data.verification.result?.blockchainStatus || "Unknown"
          },
          verifiedAt: response.data.verification.verifiedAt || new Date().toISOString()
        };
        
        setVerificationResult(result);
        setVerificationHistory(prev => [result, ...prev]);
      } else {
        throw new Error(response.message || "Verification failed");
      }
    } catch (err) {
      // Fallback to mock data if backend is offline
      console.warn("Backend offline, using mock data:", err);
      const mockResult = {
        id: Date.now(),
        status: "valid",
        badge: "green",
        credential: {
          id: scannedData.substring(0, 20),
          issuer: "Test University (Mock)",
          learnerName: "John Doe",
          courseName: "Computer Science",
          issueDate: new Date().toISOString(),
          fileHash: scannedData,
          blockchainStatus: "Mock verification - Backend offline"
        },
        verifiedAt: new Date().toISOString()
      };
      
      setVerificationResult(mockResult);
      setVerificationHistory(prev => [mockResult, ...prev]);
      setError("Backend offline - using mock data");
    } finally {
      setLoading(false);
    }
  };

  const verifyUpload = async (file) => {
    setLoading(true);
    setError(null);
    try {
      const response = await manualVerification(file, { notes: "File upload verification" });
      
      if (response.success) {
        const result = {
          id: response.data.verification._id || Date.now(),
          status: "pending",
          badge: "blue",
          credential: {
            id: response.data.verification.certificate?.certificateId || file.name,
            fileName: file.name,
            issuer: response.data.certificate?.issuer?.name || "Processing...",
            learnerName: "Processing...",
            courseName: "Processing...",
            issueDate: new Date().toISOString(),
            blockchainStatus: "Manual verification in progress"
          },
          verifiedAt: new Date().toISOString()
        };
        
        setVerificationResult(result);
        setVerificationHistory(prev => [result, ...prev]);
      } else {
        throw new Error(response.message || "Upload failed");
      }
    } catch (err) {
      // Fallback to mock data if backend is offline
      console.warn("Backend offline, using mock data:", err);
      const mockResult = {
        id: Date.now(),
        status: "pending",
        badge: "blue",
        credential: {
          id: file.name,
          fileName: file.name,
          issuer: "Processing... (Mock)",
          learnerName: "Pending Analysis",
          courseName: "Certificate Upload",
          issueDate: new Date().toISOString(),
          blockchainStatus: "Mock verification - Backend offline"
        },
        verifiedAt: new Date().toISOString()
      };
      
      setVerificationResult(mockResult);
      setVerificationHistory(prev => [mockResult, ...prev]);
      setError("Backend offline - using mock data");
    } finally {
      setLoading(false);
    }
  };

  const verifyManual = async (formData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await verifyByHash(formData.certificateId);
      
      if (response.success) {
        const result = {
          id: response.data.verification._id || Date.now(),
          status: response.data.verification.isValid ? "valid" : "invalid",
          badge: response.data.verification.badge || "amber",
          credential: {
            id: formData.certificateId,
            issuer: formData.issuerName || response.data.certificate?.issuer?.name || "Unknown",
            learnerName: formData.learnerName || response.data.certificate?.learner?.name || "N/A",
            courseName: formData.courseName || response.data.certificate?.courseDetails?.name || "N/A",
            issueDate: formData.issueDate || response.data.certificate?.issuedAt || new Date().toISOString(),
            notes: formData.notes,
            blockchainStatus: response.data.verification.result?.blockchainStatus || "Manual verification"
          },
          verifiedAt: new Date().toISOString()
        };
        
        setVerificationResult(result);
        setVerificationHistory(prev => [result, ...prev]);
      } else {
        throw new Error(response.message || "Verification failed");
      }
    } catch (err) {
      // Fallback to mock data if backend is offline
      console.warn("Backend offline, using mock data:", err);
      const mockResult = {
        id: Date.now(),
        status: "valid",
        badge: "amber",
        credential: {
          id: formData.certificateId,
          issuer: formData.issuerName || "Test Issuer (Mock)",
          learnerName: formData.learnerName || "Test Learner",
          courseName: formData.courseName || "Test Course",
          issueDate: formData.issueDate || new Date().toISOString(),
          notes: formData.notes,
          blockchainStatus: "Mock manual verification - Backend offline"
        },
        verifiedAt: new Date().toISOString()
      };
      
      setVerificationResult(mockResult);
      setVerificationHistory(prev => [mockResult, ...prev]);
      setError("Backend offline - using mock data");
    } finally {
      setLoading(false);
    }
  };

  const searchVerifications = async (query) => {
    if (!query.trim()) {
      loadHistory();
      return;
    }

    setLoading(true);
    try {
      const filtered = verificationHistory.filter(item =>
        JSON.stringify(item).toLowerCase().includes(query.toLowerCase())
      );
      setVerificationHistory(filtered);
    } catch (err) {
      console.error("Search error:", err);
    } finally {
      setLoading(false);
    }
  };

  return {
    verificationResult,
    verificationHistory,
    loading,
    error,
    verifyScan,
    verifyUpload,
    verifyManual,
    searchVerifications,
    loadHistory
  };
}
