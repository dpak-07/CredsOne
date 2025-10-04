import React from "react";

export default function IssuerHeader({ orgName, issuerDid, keyStatus }) {
  return (
    <header className="flex items-center justify-between border-b pb-2">
      <div>
        <h1 className="text-2xl font-bold">{orgName}</h1>
        <p className="text-sm text-gray-600">Issuer DID: {issuerDid}</p>
      </div>
      <div>
        <span
          className={`px-2 py-1 text-sm rounded ${
            keyStatus === "Active"
              ? "bg-green-200 text-green-800"
              : "bg-red-200 text-red-800"
          }`}
        >
          Key Status: {keyStatus}
        </span>
      </div>
    </header>
  );
}
