// Employer Dashboard
// src/pages/employer/EmployerDashboard.jsx
import React from "react";
import { Link } from "react-router-dom";

export default function EmployerDashboard() {
  return (
    <div className="min-h-[60vh] p-8">
      <div className="max-w-5xl mx-auto">
        <header className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Employer Dashboard</h1>
          <div>
            <Link to="/employer/search" className="text-sm px-3 py-2 rounded bg-indigo-600 text-white">Search Learners</Link>
          </div>
        </header>

        <section className="grid gap-4 md:grid-cols-2">
          <div className="p-4 rounded-xl border bg-white/95 shadow">
            <h3 className="font-semibold">Recent Verifications</h3>
            <p className="text-sm text-slate-500 mt-2">No verifications yet — try the demo verify on the landing page.</p>
          </div>

          <div className="p-4 rounded-xl border bg-white/95 shadow">
            <h3 className="font-semibold">Saved Searches</h3>
            <p className="text-sm text-slate-500 mt-2">Create saved search queries to find candidates quickly.</p>
          </div>
        </section>

        <section className="mt-6 p-4 rounded-xl border bg-white/95 shadow">
          <h3 className="font-semibold">Quick links</h3>
          <ul className="mt-3 space-y-2 text-sm">
            <li><Link to="/employer/search" className="text-indigo-600">Search learners</Link></li>
            <li><Link to="/" className="text-indigo-600">Run verification demo</Link></li>
          </ul>
        </section>
      </div>
    </div>
  );
}
    