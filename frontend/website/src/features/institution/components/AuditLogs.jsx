// src/features/institution/components/AuditLogs.jsx
import React from "react";

/**
 * AuditLogs
 * - "logs" prop: array of { ts, msg } entries
 * - If logs is empty, shows a small default example list.
 */
export default function AuditLogs({ logs = [] }) {
  const defaultLogs = [
    { ts: "2025-10-04", msg: "Issued VC #123 → Learner DID: abc123" },
    { ts: "2025-10-03", msg: "Key Rotated" },
  ];

  const entries = logs.length ? logs : defaultLogs;

  return (
    <section className="p-4 border rounded bg-white shadow-sm">
      <h2 className="font-semibold text-lg mb-2">Audit Log</h2>
      <ul className="text-sm space-y-2">
        {entries.map((l, i) => (
          <li key={i} className="flex items-start gap-3">
            <span className="text-xs text-slate-500 w-28">{l.ts}</span>
            <span className="break-words">{l.msg}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
