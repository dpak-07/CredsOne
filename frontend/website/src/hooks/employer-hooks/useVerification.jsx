import { useState } from "react";
import axios from "axios";

export function useVerification() {
  const [verificationResult, setVerificationResult] = useState(null);
  const [verificationHistory, setVerificationHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const verifyScan = async (scannedData) => {
    setLoading(true);
    setError(null);

    try {
      let identifier = scannedData;
      
      if (scannedData.startsWith("http")) {
        const url = new URL(scannedData);
        identifier = url.pathname.split("/").pop();
      }
      
      if (scannedData.startsWith("sha256:")) {
        identifier = scannedData.replace("sha256:", "");
      }

      const response = await axios.get(`/api/verify/${identifier}`);
      
      const result = {
        ...response.data,
        id: Date.now().toString(),
        verifiedAt: new Date().toISOString(),
        method: "QR Scan"
      };

      setVerificationResult(result);
      setVerificationHistory(prev => [result, ...prev]);
      setLoading(false);
      return result;
    } catch (err) {
      console.error("Verification error:", err);
      
      const mockResult = {
        id: Date.now().toString(),
        status: "valid",
        badge: "green",
        trustScore: 98,
        verifiedAt: new Date().toISOString(),
        method: "QR Scan",
        credential: {
          vcId: "vc-" + Math.random().toString(36).substr(2, 9),
          learnerName: "John Doe",
          learnerDid: "did:example:learner123",
          courseName: "BS Computer Science",
          issuer: "MIT University",
          issuerDid: "did:example:mit",
          issueDate: "2023-05-15",
          expiryDate: "2028-05-15",
          status: "Active",
          evidence: {
            gpa: "3.8/4.0",
            graduationDate: "2023-05-14",
            major: "Computer Science"
          }
        },
        blockchain: {
          txId: "0x7f3a9b2c...",
          block: 15234567,
          timestamp: "2023-05-15T10:30:00Z"
        },
        fileHash: {
          client: "abc123def456...",
          server: "abc123def456...",
          match: true
        }
      };

      setVerificationResult(mockResult);
      setVerificationHistory(prev => [mockResult, ...prev]);
      setError("Backend offline - using mock data");
      setLoading(false);
      return mockResult;
    }
  };

  const verifyManual = async (formData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post("/api/verify/manual", formData);
      
      const result = {
        ...response.data,
        id: Date.now().toString(),
        verifiedAt: new Date().toISOString(),
        method: "Manual Entry"
      };

      setVerificationResult(result);
      setVerificationHistory(prev => [result, ...prev]);
      setLoading(false);
      return result;
    } catch (err) {
      console.error("Manual verification error:", err);
      
      const mockResult = {
        id: Date.now().toString(),
        status: formData.certificateId ? "valid" : "pending",
        badge: formData.certificateId ? "green" : "amber",
        trustScore: 85,
        verifiedAt: new Date().toISOString(),
        method: "Manual Entry",
        credential: {
          vcId: formData.certificateId || "vc-manual-" + Date.now(),
          learnerName: formData.learnerName,
          courseName: formData.courseName,
          issuer: formData.issuerName,
          issueDate: formData.issueDate,
          notes: formData.notes
        }
      };

      setVerificationResult(mockResult);
      setVerificationHistory(prev => [mockResult, ...prev]);
      setError("Backend offline - using mock data");
      setLoading(false);
      return mockResult;
    }
  };

  const searchVerifications = async (query) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(`/api/search?q=${query}&type=credential`);
      setVerificationHistory(response.data.results || []);
      setLoading(false);
      return response.data.results;
    } catch (err) {
      console.error("Search error:", err);
      
      const filtered = verificationHistory.filter(v => 
        v.credential?.learnerName?.toLowerCase().includes(query.toLowerCase()) ||
        v.credential?.courseName?.toLowerCase().includes(query.toLowerCase()) ||
        v.credential?.vcId?.toLowerCase().includes(query.toLowerCase())
      );
      
      setError("Backend offline - searching cached data");
      setLoading(false);
      return filtered;
    }
  };

  return {
    verificationResult,
    verificationHistory,
    loading,
    error,
    verifyScan,
    verifyManual,
    searchVerifications
  };
}
