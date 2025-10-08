// src/components/Header.jsx
import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Header() {
  const { user, isAuthenticated, login, logout } = useAuth();
  return (
    <header className="w-full p-4 bg-white/90 border-b">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <Link to="/" className="font-bold text-xl">CredsOne</Link>
        <nav className="flex items-center gap-4">
          <Link to="/">Home</Link>
          <Link to="/verify">Verify</Link>
          {!isAuthenticated ? (
            <>
              <button onClick={() => login("learner")} className="text-sm">Mock login</button>
            </>
          ) : (
            <>
              <span className="text-sm">Hi, {user?.name}</span>
              <button onClick={logout} className="text-sm underline">Logout</button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
