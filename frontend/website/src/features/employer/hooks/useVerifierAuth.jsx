import { useState, useEffect } from "react";

export function useVerifierAuth() {
  const [verifier, setVerifier] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in and has verifier/employer role
    const token = sessionStorage.getItem("auth_token");
    const userRole = sessionStorage.getItem("user_role");
    
    if (token && userRole === "employer") {
      setIsAuthenticated(true);
      setVerifier({
        organization: "Test Company",
        did: "did:example:employer-001",
        name: "Test Employer",
        role: "employer"
      });
    } else {
      setIsAuthenticated(false);
    }
    
    setLoading(false);
  }, []);

  const logout = () => {
    sessionStorage.removeItem("auth_token");
    sessionStorage.removeItem("user_role");
    setIsAuthenticated(false);
    setVerifier(null);
  };

  return {
    verifier,
    isAuthenticated,
    loading,
    logout
  };
}
