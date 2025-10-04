// src/hooks/useAuth.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { login as apiLogin } from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // { did, name, role }
  const [token, setToken] = useState(null);

  // Load from sessionStorage on mount
  useEffect(() => {
    try {
      const savedUser = sessionStorage.getItem("auth_user");
      const savedToken = sessionStorage.getItem("auth_token");
      if (savedUser) setUser(JSON.parse(savedUser));
      if (savedToken) setToken(savedToken);
    } catch (e) {
      console.error("Auth load error", e);
    }
  }, []);

  async function login(credentials) {
    const data = await apiLogin(credentials); // backend returns { user, token }
    setUser(data.user);
    setToken(data.token);
    sessionStorage.setItem("auth_user", JSON.stringify(data.user));
    sessionStorage.setItem("auth_token", data.token);
    return data;
  }

  function logout() {
    setUser(null);
    setToken(null);
    sessionStorage.removeItem("auth_user");
    sessionStorage.removeItem("auth_token");
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export default function useAuth() {
  return useContext(AuthContext);
}
