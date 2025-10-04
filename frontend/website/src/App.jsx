import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// Static Pages
import LandingPage from "./features/LandingPage";
import Login from "./features/login";

// Role Dashboards (Static)
import WalletPage from "./features/learner/WalletPage";
import VCDetailWrapper from "./features/learner/VCDetailwrapper";
import VerifierPage from "./features/employer/VerifierPage";
import IssuerPage from "./features/institution/IssuerPage";

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />

        {/* Learner routes */}
        <Route path="/dashboard/learner" element={<WalletPage />} />
        <Route path="/learner/vc/:id" element={<VCDetailWrapper />} />

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
