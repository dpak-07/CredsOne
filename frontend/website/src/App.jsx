import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import useAuth from "./hooks/useAuth";

// Core
import LandingPage from "./features/LandingPage";
import Login from "./features/login";

// Learner
import WalletPage from "./features/learner/WalletPage";
import VCDetailContainer from "./features/learner/VCDetailContainer";

// Employer
import { VerifierPage } from "./features/employer";

// Institution
import IssuerPage from "./features/institution/IssuerPage";

const App = () => {
  const { user, token, logout } = useAuth();
  const userRole = user?.role;

  console.log('App rendered:', { user, token, userRole });

  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LandingPage />} />
        <Route
          path="/login"
          element={
            token
              ? <Navigate to={`/dashboard/${userRole?.toLowerCase()}`} replace />
              : <Login />
          }
        />

        {/* Learner routes */}
        <Route
          path="/dashboard/learner"
          element={
            token && userRole === "Learner"
              ? <WalletPage onLogout={logout} />
              : <Navigate to="/login" replace />
          }
        />
        <Route
          path="/learner/vc/:id"
          element={
            token && userRole === "Learner"
              ? <VCDetailContainer />
              : <Navigate to="/login" replace />
          }
        />

        {/* Employer routes */}
        <Route
          path="/dashboard/employer"
          element={
            token && userRole === "Employer"
              ? <VerifierPage onLogout={logout} />
              : <Navigate to="/login" replace />
          }
        />

        {/* Institution routes */}
        <Route
          path="/dashboard/institution"
          element={
            token && userRole === "Institution"
              ? <IssuerPage onLogout={logout} />
              : <Navigate to="/login" replace />
          }
        />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;