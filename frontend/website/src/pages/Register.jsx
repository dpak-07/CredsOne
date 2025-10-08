// Register page
// src/pages/Register.jsx
import React from "react";
import { Link } from "react-router-dom";

export default function Register() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-slate-200">
        <h1 className="text-2xl font-bold text-center text-slate-800">
          Create Account ✨
        </h1>
        <p className="text-sm text-slate-500 text-center mt-1">
          Join CredsOne and verify credentials instantly
        </p>

        <form className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-600">
              Full Name
            </label>
            <input
              type="text"
              className="mt-1 w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-400 outline-none"
              placeholder="Priya Sharma"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-600">
              Email
            </label>
            <input
              type="email"
              className="mt-1 w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-400 outline-none"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-600">
              Password
            </label>
            <input
              type="password"
              className="mt-1 w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-400 outline-none"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-lg bg-indigo-600 text-white font-semibold shadow hover:bg-indigo-700 transition"
          >
            Register
          </button>
        </form>

        <div className="mt-4 text-sm text-center text-slate-600">
          Already have an account?{" "}
          <Link to="/login" className="text-indigo-600 hover:underline">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}
