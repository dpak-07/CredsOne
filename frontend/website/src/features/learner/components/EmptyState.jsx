// src/features/learner/components/EmptyState.jsx
import React from "react";

export default function EmptyState({ title = "No credentials found", subtitle = "Once an issuer adds a credential, it will appear here." }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-gray-500">
      <svg className="w-20 h-20 mb-4 opacity-70" viewBox="0 0 24 24" fill="none">
        <path d="M12 2v4M20 12h-4M12 20v-4M4 12h4" stroke="#A0AEC0" strokeWidth="1.5" strokeLinecap="round"/>
        <circle cx="12" cy="12" r="9" stroke="#CBD5E0" strokeWidth="1.5" />
      </svg>
      <p className="text-lg font-medium">{title}</p>
      <p className="text-sm text-gray-500 mt-2">{subtitle}</p>
    </div>
  );
}
