// src/components-ui/VCCard.jsx
import React from "react";
import TrustBadge from "./TrustBadge";

export default function VCCard({ vc, onOpen }) {
  const { title, issuer, issuedOn, trust } = vc || {};

  return (
    <article
      className="p-4 border rounded-lg shadow hover:shadow-md cursor-pointer bg-white"
      onClick={() => onOpen?.(vc)}
    >
      <header className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold">{title || "Untitled Credential"}</h3>
          <p className="text-sm text-gray-600">Issuer: {issuer || "Unknown"}</p>
        </div>
        <TrustBadge level={trust} />
      </header>

      <p className="mt-2 text-sm text-gray-500">
        Issued: {issuedOn ? new Date(issuedOn).toLocaleDateString() : "—"}
      </p>
    </article>
  );
}
