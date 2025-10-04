import React from "react";
import { IconClock } from "../../../components-ui/icons";
import TrustBadge from "../../../components-ui/TrustBadge";

export default function VerificationHistoryList({ verifications, onSelect }) {
  if (!verifications || verifications.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <IconClock size={48} className="mx-auto mb-4 text-gray-300" />
        <p>No verification history yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {verifications.map((verification) => (
        <div
          key={verification.id}
          onClick={() => onSelect && onSelect(verification)}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition cursor-pointer"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <TrustBadge badge={verification.badge || "blue"} size="sm" />
                <span className="font-semibold text-gray-900">
                  {verification.credential?.learnerName || "N/A"}
                </span>
              </div>
              <p className="text-sm text-gray-600">{verification.credential?.courseName || "N/A"}</p>
              <p className="text-xs text-gray-500 mt-1">
                Issuer: {verification.credential?.issuer || "N/A"}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                {new Date(verification.verifiedAt).toLocaleString()}
              </p>
            </div>
            <div className="text-right">
              <span
                className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                  verification.status === "valid"
                    ? "bg-green-100 text-green-800"
                    : verification.status === "invalid"
                    ? "bg-red-100 text-red-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {verification.status}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
