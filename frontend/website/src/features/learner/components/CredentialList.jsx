// src/features/learner/components/CredentialList.jsx
import React from "react";
import VCCard from "../../../components-ui/VCCard";

/**
 * CredentialList
 *
 * Props:
 *  - vcs: array of credential objects
 *  - onSelect(vc): callback when a credential is clicked
 *  - view: "grid" | "table" (optional, default "grid")
 */
export default function CredentialList({ vcs = [], onSelect, view = "grid" }) {
  if (!vcs || vcs.length === 0) {
    return (
      <div className="p-6 text-center text-gray-500">
        No credentials found.
      </div>
    );
  }

  if (view === "table") {
    return (
      <div className="overflow-x-auto border rounded">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left">Title</th>
              <th className="px-4 py-2 text-left">Issuer</th>
              <th className="px-4 py-2 text-left">Issued</th>
              <th className="px-4 py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {vcs.map((vc) => (
              <tr
                key={vc.id || vc.vcId}
                className="border-t hover:bg-gray-50 cursor-pointer"
                onClick={() => onSelect?.(vc)}
              >
                <td className="px-4 py-2">
                  {vc.credentialSubject?.title || vc.title || "Untitled"}
                </td>
                <td className="px-4 py-2">
                  {vc.issuer?.name || vc.issuer || "Unknown"}
                </td>
                <td className="px-4 py-2">
                  {vc.issuanceDate
                    ? new Date(vc.issuanceDate).toLocaleDateString()
                    : vc.issuedOn || "—"}
                </td>
                <td className="px-4 py-2 text-center">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      vc.trust === "Green"
                        ? "bg-green-100 text-green-700"
                        : vc.trust === "Amber"
                        ? "bg-yellow-100 text-yellow-700"
                        : vc.trust === "Blue"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {vc.trust || "—"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  // Default = grid of cards
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {vcs.map((vc) => (
        <VCCard
          key={vc.id || vc.vcId}
          title={vc.credentialSubject?.title || vc.title}
          issuer={vc.issuer?.name || vc.issuer}
          date={
            vc.issuanceDate
              ? new Date(vc.issuanceDate).toLocaleDateString()
              : vc.issuedOn
          }
          trust={vc.trust}
          onClick={() => onSelect?.(vc)}
        />
      ))}
    </div>
  );
}
