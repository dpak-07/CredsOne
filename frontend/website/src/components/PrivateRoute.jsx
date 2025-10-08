// src/components/PrivateRoute.jsx
import React, { useEffect, useState } from "react";
import { Outlet, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // adjust path if needed

// Simple modal (Tailwind)
function AuthPromptModal({ open, onClose, onLogin, onRegister }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative z-10 w-full max-w-md mx-4 bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-xl font-semibold mb-2">Hold on — you need to sign in</h3>
        <p className="text-sm text-gray-600 mb-4">
          This area is for registered users. Please log in or create an account to continue.
        </p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200"
          >
            Stay
          </button>
          <button
            onClick={onLogin}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
          >
            Log in
          </button>
          <button
            onClick={onRegister}
            className="px-4 py-2 rounded-lg border border-gray-200"
          >
            Register
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * PrivateRoute:
 * - allowedRoles: array of roles that can access the nested routes
 *
 * Behavior:
 * - If isAuthenticated && role ok => render <Outlet />
 * - If isAuthenticated && role NOT allowed => navigate to home
 * - If NOT authenticated => show a modal after 2s giving options to login/register
 */
export default function PrivateRoute({ allowedRoles = [] }) {
  const { user, isAuthenticated } = useAuth(); // adapt these names to your AuthContext
  const location = useLocation();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // When mounting a protected route and user is NOT authenticated,
    // show the modal after 2 seconds
    if (!isAuthenticated) {
      const t = setTimeout(() => setShowModal(true), 2000);
      return () => clearTimeout(t);
    } else {
      // If user is authenticated, ensure modal is hidden
      setShowModal(false);
    }
  }, [isAuthenticated, location.pathname]);

  // if authenticated, check role
  if (isAuthenticated) {
    // if no allowedRoles specified, allow any authenticated user
    if (!allowedRoles || allowedRoles.length === 0) {
      return <Outlet />;
    }

    // assume user.role exists; adjust if your structure is different
    const role = user?.role || null;
    if (role && allowedRoles.includes(role)) {
      return <Outlet />;
    } else {
      // authenticated but not authorized
      return <Navigate to="/" replace />;
    }
  }

  // not authenticated -> show modal overlay (but do not render outlets)
  return (
    <>
      {/* Optionally you could render a placeholder UI here */}
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-sm text-gray-500">You must be signed in to view this page.</p>
      </div>

      <AuthPromptModal
        open={showModal}
        onClose={() => setShowModal(false)}
        onLogin={() => {
          setShowModal(false);
          navigate("/login", { state: { from: location } });
        }}
        onRegister={() => {
          setShowModal(false);
          navigate("/register", { state: { from: location } });
        }}
      />
    </>
  );
}
