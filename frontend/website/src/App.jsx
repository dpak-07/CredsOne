// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./components/PrivateRoute";
import { ROUTES } from "./utils/routes";

// 🌐 --- Public Pages ---
import Landing from "./pages/Landing";
import VerifyPublic from "./pages/VerifyPublic";
import Login from "./pages/Login";
import Register from "./pages/Register";
//import FAQ from "./pages/FAQ";
import NotFound from "./pages/NotFound";

// 🎓 --- Learner Pages ---
import LearnerDashboard from "./pages/learner/LearnerDashboard";
import LearnerProfile from "./pages/learner/Profile";
import LearnerWallet from "./pages/learner/Wallet";

// 💼 --- Employer Pages ---
import EmployerDashboard from "./pages/employer/EmployerDashboard";
import EmployerSearch from "./pages/employer/SearchLearner";

// 🏫 --- Institution Pages ---
import InstitutionDashboard from "./pages/institution/InstitutionDashboard";
import IssueCertificate from "./pages/institution/IssueCertificate";

import Header from "./components/Header";
import Footer from "./components/Footer";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Header />
        <main className="min-h-screen bg-gray-50 text-gray-900">
          <Routes>
            {/* 🌍 PUBLIC ROUTES */}
            <Route path={ROUTES.HOME} element={<Landing />} />
            <Route path={ROUTES.VERIFY} element={<VerifyPublic />} />
            <Route path={ROUTES.LOGIN} element={<Login />} />
            <Route path={ROUTES.REGISTER} element={<Register />} />
            <Route path="/faq" element={<FAQ />} />

            {/* 🎓 LEARNER ROUTES */}
            <Route
              path="/learner/*"
              element={<PrivateRoute allowedRoles={["learner"]} />}
            >
              <Route index element={<LearnerDashboard />} />
              <Route path="profile" element={<LearnerProfile />} />
              <Route path="wallet" element={<LearnerWallet />} />
              <Route path="*" element={<Navigate to="/learner" replace />} />
            </Route>

            {/* 💼 EMPLOYER ROUTES */}
            <Route
              path="/employer/*"
              element={<PrivateRoute allowedRoles={["employer"]} />}
            >
              <Route index element={<EmployerDashboard />} />
              <Route path="search" element={<EmployerSearch />} />
              <Route path="*" element={<Navigate to="/employer" replace />} />
            </Route>

            {/* 🏫 INSTITUTION ROUTES */}
            <Route
              path="/institution/*"
              element={<PrivateRoute allowedRoles={["institution"]} />}
            >
              <Route index element={<InstitutionDashboard />} />
              <Route path="issue" element={<IssueCertificate />} />
              <Route path="*" element={<Navigate to="/institution" replace />} />
            </Route>

            {/* ⚠ 404 */}
            <Route path={ROUTES.NOT_FOUND} element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </Router>
    </AuthProvider>
  );
}

export default App;
