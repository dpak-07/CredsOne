// Learner Dashboard
// src/pages/learner/LearnerDashboard.jsx
import React from "react";
import { Link } from "react-router-dom";

export default function LearnerDashboard() {
  return (
    <div className="min-h-[60vh] p-8">
      <div className="max-w-5xl mx-auto">
        <header className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Learner Dashboard</h1>
          <div>
            <Link to="/learner/profile" className="text-sm px-3 py-2 rounded bg-indigo-600 text-white">Profile</Link>
          </div>
        </header>

        <section className="grid gap-4 md:grid-cols-2">
          <div className="p-4 rounded-xl border bg-white/95 shadow">
            <h3 className="font-semibold">My Credentials</h3>
            <p className="text-sm text-slate-500 mt-2">No credentials yet — issue or upload to see them here.</p>
          </div>

          <div className="p-4 rounded-xl border bg-white/95 shadow">
            <h3 className="font-semibold">Wallet</h3>
            <p className="text-sm text-slate-500 mt-2">View balances, tokens, and transaction history.</p>
          </div>
        </section>

        <section className="mt-6 p-4 rounded-xl border bg-white/95 shadow">
          <h3 className="font-semibold">Quick actions</h3>
          <ul className="mt-3 space-y-2 text-sm">
            <li><Link to="/learner/wallet" className="text-indigo-600">Open Wallet</Link></li>
            <li><Link to="/" className="text-indigo-600">Back to Landing</Link></li>
          </ul>
        </section>
      </div>
    </div>
  );
}
