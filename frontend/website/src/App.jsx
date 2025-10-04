import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "./features/LandingPage";
import Login from "./features/login";
import LearnerDashboard from "./components/LearnerDashboard";
import EmployerDashboard from "./components/EmployerDashboard";
import InstitutionDashboard from "./components/InstitutionDashboard";

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);

  const handleLoginSuccess = (name, role) => {
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
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={isLoggedIn ? <Navigate to={`/dashboard/${userRole.toLowerCase()}`} /> : <Login onAuthSuccess={handleLoginSuccess} />} />
        <Route path="/dashboard/learner" element={isLoggedIn && userRole === "Learner" ? <LearnerDashboard onLogout={handleLogout} /> : <Navigate to="/login" />} />
        <Route path="/dashboard/employer" element={isLoggedIn && userRole === "Employer" ? <EmployerDashboard onLogout={handleLogout} /> : <Navigate to="/login" />} />
        <Route path="/dashboard/institution" element={isLoggedIn && userRole === "Institution" ? <InstitutionDashboard onLogout={handleLogout} /> : <Navigate to="/login" />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;
