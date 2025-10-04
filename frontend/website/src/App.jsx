import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

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
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);

  console.log('App rendered:', { isLoggedIn, userRole });

  const handleLoginSuccess = (name, role) => {
    console.log('Login success:', { name, role });
    setIsLoggedIn(true);
    setUserRole(role);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserRole(null);
  };

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
          element={
            isLoggedIn && userRole === "Learner"
              ? <WalletPage onLogout={handleLogout} />
              : <Navigate to="/login" />
          }
        />
        <Route
          path="/learner/vc/:id"
          element={
            isLoggedIn && userRole === "Learner"
              ? <VCDetailContainer />
              : <Navigate to="/login" />
          }
        />

        {/* Employer routes */}
        <Route
          path="/dashboard/employer"
          element={
            isLoggedIn && userRole === "Employer"
              ? <VerifierPage onLogout={handleLogout} />
              : <Navigate to="/login" />
          }
        />

        {/* Institution routes */}
        <Route
          path="/dashboard/institution"
          element={
            isLoggedIn && userRole === "Institution"
              ? <IssuerPage onLogout={handleLogout} />
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