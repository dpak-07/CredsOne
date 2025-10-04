// src/services/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Authentication
export async function login(credentials) {
  const res = await api.post('/auth/login', credentials);
  return res.data;
}

export async function register(userData) {
  const res = await api.post('/auth/register', userData);
  return res.data;
}

// Wallet / VC Management
export async function getWallet() {
  const res = await api.get('/wallet');
  return res.data;
}

export async function getVC(vcId) {
  const res = await api.get(`/wallet/vc/${vcId}`);
  return res.data;
}

export async function downloadVC(vcId) {
  const res = await api.get(`/wallet/vc/${vcId}/download`, {
    responseType: 'blob',
  });
  return res.data;
}

export async function exportToDigilocker(vcId) {
  const res = await api.post(`/wallet/vc/${vcId}/export-digilocker`);
  return res.data;
}

// Verification - Employer APIs
export async function verifyCertificate(certificateData, verificationType = 'qr_scan') {
  const res = await api.post('/verification/verify', {
    certificateData,
    verificationType
  });
  return res.data;
}

export async function verifyByHash(certHash) {
  const res = await api.post('/verification/verify', {
    certificateData: { certHash },
    verificationType: 'hash_lookup'
  });
  return res.data;
}

export async function manualVerification(file, metadata) {
  const formData = new FormData();
  formData.append("file", file);
  if (metadata) {
    Object.keys(metadata).forEach(key => {
      formData.append(key, metadata[key]);
    });
  }

  const res = await api.post("/verification/manual", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
}

export async function getVerificationHistory(params = {}) {
  const res = await api.get('/verification', { params });
  return res.data;
}

export async function getVerificationById(id) {
  const res = await api.get(`/verification/${id}`);
  return res.data;
}

// Institution - Issue Credential
export async function issueCredential(file, fields) {
  const formData = new FormData();
  formData.append("file", file);
  Object.keys(fields).forEach((k) => formData.append(k, fields[k]));

  const res = await api.post("/manual/issue", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
}

export default api;

