// Institution Dashboard
// src/pages/institution/InstitutionDashboard.jsx
import React from "react";
import { Link } from "react-router-dom";

export default function InstitutionDashboard() {
  return (
    <div className="min-h-[60vh] p-8">
      <div className="max-w-5xl mx-auto">
        <header className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-slate-800">Institution Dashboard</h1>
          <div>
            <Link
              to="/institution/issue"
              className="text-sm px-3 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700"
            >
              Issue Certificate
            </Link>
          </div>
        </header>

        <section className="grid gap-4 md:grid-cols-2">
          <div className="p-4 rounded-xl border bg-white/95 shadow">
            <h3 className="font-semibold">Recent Issuances</h3>
            <p className="text-sm text-slate-500 mt-2">
              No credentials issued yet. Click <strong>Issue Certificate</strong> to start.
            </p>
          </div>

          <div className="p-4 rounded-xl border bg-white/95 shadow">
            <h3 className="font-semibold">Pending Verifications</h3>
            <p className="text-sm text-slate-500 mt-2">
              None pending. Issued credentials appear here once created.
            </p>
          </div>
        </section>

        <section className="mt-6 p-4 rounded-xl border bg-white/95 shadow">
          <h3 className="font-semibold">Quick Links</h3>
          <ul className="mt-3 space-y-2 text-sm">
            <li><Link to="/institution/issue" className="text-indigo-600">Issue new certificate</Link></li>
            <li><Link to="/" className="text-indigo-600">Go to Landing page</Link></li>
          </ul>
        </section>
      </div>
    </div>
  );
}
