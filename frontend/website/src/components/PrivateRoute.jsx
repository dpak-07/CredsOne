// src/components/PrivateRoute.jsx
import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function PrivateRoute({ allowedRoles }) {
  const { isAuthenticated, role, isLoading } = useAuth();

  if (isLoading) return null; // replace with spinner if you want

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  if (allowedRoles && !allowedRoles.includes(role)) return <Navigate to="/" replace />;

  return <Outlet />;
}
