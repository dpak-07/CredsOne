// src/pages/institution/IssueCertificate.jsx
import React from "react";

export default function IssueCertificate() {
  return (
    <div className="min-h-[60vh] p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-4 text-slate-800">Issue Certificate</h1>
        <p className="text-sm text-slate-500">
          This page will allow an institution to issue verified digital credentials.
        </p>

        <div className="mt-6 p-4 border rounded-lg bg-white/95 shadow">
          <p className="text-sm text-slate-500">Form placeholder — integrate issue form here.</p>
        </div>
      </div>
    </div>
  );
}
