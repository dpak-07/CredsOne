// src/features/employer/VerifierPage.jsx
import React, { useState } from "react";
import ScanPanel from "./components/ScanPanel";
import { verifyFileHash, manualVerify } from "../../services/api";
import Table from "../../components-ui/Table";

export default function VerifierPage() {
  const [result, setResult] = useState(null);
  const [auditLogs, setAuditLogs] = useState([]);
  const [error, setError] = useState(null);

  async function handleScan(hashOrId) {
    setError(null);
    setResult(null);

    try {
      const data = await verifyFileHash(hashOrId);
      setResult(data);
      // optional: append to logs
      setAuditLogs((prev) => [...prev, { date: new Date().toISOString(), action: "QR Scan", status: data?.status ||]()
