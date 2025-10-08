// src/context/AuthContext.jsx
import React, { createContext, useContext, useMemo, useState } from "react";

/**
 * Minimal static AuthContext for UI/testing
 * - Named export: AuthProvider (so `import { AuthProvider }` works)
 * - Lightweight: no external deps, no API calls
 */

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // Toggle this to simulate logged-in user on page load, or use login() below.
  const [user, setUser] = useState(null);

  const mockUser = {
    id: 1,
    name: "Priya Sharma",
    email: "priya@example.com",
    role: "learner", // change to 'employer' or 'institution' to test role routing
  };

  function login(role = "learner") {
    setUser({ ...mockUser, role });
  }

  function logout() {
    setUser(null);
  }

  const isAuthenticated = Boolean(user);
  const role = user?.role ?? null;

  const value = useMemo(
    () => ({ user, role, isAuthenticated, isLoading: false, login, logout }),
    [user, role, isAuthenticated]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
