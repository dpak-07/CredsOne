import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// Import from root src/ directory
import LandingPage from "./LandingPage.jsx";
import Login from "./Login.jsx";
import WalletPage from "./WalletPage.jsx";
import VerifierPage from "./VerifierPage.jsx";
import IssuerPage from "./IssuerPage.jsx";

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />

        {/* Learner routes */}
        <Route path="/dashboard/learner" element={<WalletPage />} />

        {/* Employer route */}
        <Route path="/dashboard/employer" element={<VerifierPage />} />

        {/* Institution route */}
        <Route path="/dashboard/institution" element={<IssuerPage />} />

        {/* Catch-all route */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;