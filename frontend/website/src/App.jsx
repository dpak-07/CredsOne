import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import useAuth from "./hooks/useAuth";

// Core
import LandingPage from "./features/LandingPage";
import Login from "./features/login";

// Learner
import WalletPage from "./features/learner/WalletPage";
import VCDetailWrapper from "./features/learner/VCDetailwrapper";

// Employer
import VerifierPage from "./features/employer/VerifierPage";

// Institution
import IssuerPage from "./features/institution/IssuerPage";

const App = () => {
  const { user, logout } = useAuth();
  const isLoggedIn = !!user;
  const userRole = user?.role;

  const handleLoginSuccess = () => {}; // handled via context now

  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LandingPage />} />
        <Route
          path="/login"
          element={
            isLoggedIn
              ? <Navigate to={`/dashboard/${userRole?.toLowerCase()}`} />
              : <Login onAuthSuccess={handleLoginSuccess} />
          }
        />

        {/* Learner routes */}
        <Route
          path="/dashboard/learner"
          // element={
          //   isLoggedIn && userRole === "Learner"
          //     ? <WalletPage onLogout={logout} />
          //     : <Navigate to="/login" />
          // }
        />
        <Route
          path="/learner/vc/:id"
          element={
            isLoggedIn && userRole === "Learner"
              ? <VCDetailWrapper />
              : <Navigate to="/login" />
          }
        />

        {/* Employer routes */}
        <Route
          path="/dashboard/employer"
          element={
            isLoggedIn && userRole === "Employer"
              ? <VerifierPage onLogout={logout} />
              : <Navigate to="/login" />
          }
        />

        {/* Institution routes */}
        <Route
          path="/dashboard/institution"
          element={
            isLoggedIn && userRole === "Institution"
              ? <IssuerPage onLogout={logout} />
              : <Navigate to="/login" />
          }
        />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;