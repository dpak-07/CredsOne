// src/api/apiClient.js
import axios from "axios";

/**
 * Axios instance used across the frontend.
 * - Uses VITE_API_BASE from import.meta.env (Vite)
 * - Exports: default apiClient, and helper setAuthToken(token)
 */

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || "http://localhost:5000/api",
  withCredentials: false, // set true if you rely on cookies
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * setAuthToken
 * - If token provided, sets Authorization header on axios default instance
 * - If falsy, removes Authorization header
 */
export function setAuthToken(token) {
  if (token) {
    apiClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete apiClient.defaults.headers.common["Authorization"];
  }
}

/**
 * Optional: simple response interceptor to handle 401 globally.
 * If you want automatic refresh logic, extend this interceptor to call refresh endpoint.
 */
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

apiClient.interceptors.response.use(
  (res) => res,
  (err) => {
    const originalReq = err.config;

    // If 401 and not retrying, you can attempt token refresh here.
    // For now we simply reject — AuthContext will clear tokens on error.
    if (err.response && err.response.status === 401 && !originalReq._retry) {
      // Example placeholder: mark request as retried, then let AuthContext handle logout.
      originalReq._retry = true;
      return Promise.reject(err);
    }

    return Promise.reject(err);
  }
);

export default apiClient;
