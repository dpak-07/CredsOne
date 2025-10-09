// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Pages
import Landing from "./pages/Landing";
import LearnerDashboard from "./pages/learner/LearnerDashboard";
import EmployerDashboard from "./pages/employer/EmployerDashboard";
import InstitutionDashboard from "./pages/institution/InstitutionDashboard";
import NotFound from "./pages/NotFound";
function App() {
  return (
    <Router>
      {/* <Header /> */}
      <main className="min-h-screen bg-gray-50 text-gray-900">
        <Routes>
          {/* Public Route */}
          <Route path="/" element={<Landing />} />

          {/* Learner Route */}
          <Route path="/learner" element={<LearnerDashboard />} />

          {/* Employer Route */}
          <Route path="/employer" element={<EmployerDashboard />} />

          {/* Institution Route */}
          <Route path="/institution" element={<InstitutionDashboard />} />

          {/* 404 Not Found */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      {/* <Footer /> */}
    </Router>
  );
}

export default App;
