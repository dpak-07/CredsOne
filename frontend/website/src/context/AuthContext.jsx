// src/context/AuthContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import apiClient, { setAuthToken } from "../api/apiClient";

/**
 * AuthContext - integrates with backend endpoints:
 *  POST /auth/login   -> { success: true, token, user }
 *  POST /auth/register-> { success: true, token, user }
 *  GET  /auth/me      -> { success: true, user }
 *
 * Persists token in localStorage under key CREDSONE_TOKEN.
 */

const LS_TOKEN_KEY = "CREDSONE_TOKEN";
const LS_USER_KEY = "CREDSONE_USER";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem(LS_USER_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });
  const [isLoading, setIsLoading] = useState(Boolean(localStorage.getItem(LS_TOKEN_KEY)));
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  // On mount if token exists, attach and fetch /me
  useEffect(() => {
    const token = localStorage.getItem(LS_TOKEN_KEY);
    if (token) {
      setAuthToken(token);
      (async () => {
        try {
          const { data } = await apiClient.get("/auth/me");
          if (data?.user) {
            setUser(data.user);
            localStorage.setItem(LS_USER_KEY, JSON.stringify(data.user));
          } else {
            clearAuth();
          }
        } catch (err) {
          clearAuth();
        } finally {
          setIsLoading(false);
        }
      })();
    } else {
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function persistToken(token) {
    if (token) {
      localStorage.setItem(LS_TOKEN_KEY, token);
      setAuthToken(token);
    } else {
      localStorage.removeItem(LS_TOKEN_KEY);
      setAuthToken(null);
    }
  }

  function persistUser(u) {
    if (u) localStorage.setItem(LS_USER_KEY, JSON.stringify(u));
    else localStorage.removeItem(LS_USER_KEY);
  }

  async function login({ usernameOrEmail, password }) {
    setIsAuthenticating(true);
    try {
      const payload = { username: usernameOrEmail, password };
      const res = await apiClient.post("/auth/login", payload);
      if (res.data && res.data.token) {
        persistToken(res.data.token);
        const userObj = res.data.user;
        setUser(userObj);
        persistUser(userObj);
        setIsAuthenticating(false);
        return { success: true, user: userObj };
      }
      setIsAuthenticating(false);
      return { success: false, message: "Unexpected response from server" };
    } catch (err) {
      setIsAuthenticating(false);
      const message = err?.response?.data?.message || err.message || "Login failed";
      return { success: false, message };
    }
  }

  async function register(payload) {
    setIsAuthenticating(true);
    try {
      const res = await apiClient.post("/auth/register", payload);
      if (res.data && res.data.token) {
        persistToken(res.data.token);
        const userObj = res.data.user;
        setUser(userObj);
        persistUser(userObj);
        setIsAuthenticating(false);
        return { success: true, user: userObj };
      }
      setIsAuthenticating(false);
      return { success: false, message: "Unexpected response from server" };
    } catch (err) {
      setIsAuthenticating(false);
      const message = err?.response?.data?.message || err.message || "Registration failed";
      return { success: false, message };
    }
  }

  async function logout() {
    try {
      // optional server logout
    } catch (e) {
      // ignore
    } finally {
      clearAuth();
    }
  }

  function clearAuth() {
    persistToken(null);
    persistUser(null);
    setUser(null);
  }

  async function fetchMe() {
    try {
      const { data } = await apiClient.get("/auth/me");
      if (data?.user) {
        setUser(data.user);
        persistUser(data.user);
        return data.user;
      }
      throw new Error("Failed to fetch profile");
    } catch (err) {
      clearAuth();
      throw err;
    }
  }

  const isAuthenticated = Boolean(user);

  const value = {
    user,
    isAuthenticated,
    isLoading,
    isAuthenticating,
    login,
    register,
    logout,
    fetchMe,
    clearAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
