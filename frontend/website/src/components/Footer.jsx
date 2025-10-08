// src/components/Footer.jsx
import React from "react";

export default function Footer() {
  return (
    <footer className="w-full p-6 bg-slate-100 text-center text-sm">
      © {new Date().getFullYear()} CredsOne — demo
    </footer>
  );
}
