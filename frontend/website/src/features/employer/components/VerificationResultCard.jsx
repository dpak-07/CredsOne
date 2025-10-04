import React from "react";
import TrustBadge from "../../../components-ui/TrustBadge";
import { IconCheck, IconX, IconClock } from "../../../components-ui/icons";

export default function VerificationResultCard({ result }) {
  if (!result) return null;

  const getStatusIcon = () => {
    switch (result.status) {
      case "valid":
        return <IconCheck size={32} className="text-green-600" />;
      case "invalid":
        return <IconX size={32} className="text-red-600" />;
      default:
        return <IconClock size={32} className="text-yellow-600" />;
    }
  };

  const getStatusText = () => {
    switch (result.status) {
      case "valid":
        return "Credential Verified";
      case "invalid":
        return "Verification Failed";
      default:
        return "Manual Review Required";
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border-2 border-gray-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          {getStatusIcon()}
          <div>
            <h3 className="text-xl font-bold text-gray-900">{getStatusText()}</h3>
            <p className="text-sm text-gray-500">Certificate ID: {result.credential?.id}</p>
          </div>
        </div>
        <TrustBadge badge={result.badge || "blue"} />
      </div>

      <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t">
        <div>
          <p className="text-xs text-gray-500">Issuer</p>
          <p className="font-medium text-gray-900">{result.credential?.issuer || "N/A"}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Learner</p>
          <p className="font-medium text-gray-900">{result.credential?.learnerName || "N/A"}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Course</p>
          <p className="font-medium text-gray-900">{result.credential?.courseName || "N/A"}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Issue Date</p>
          <p className="font-medium text-gray-900">
            {result.credential?.issueDate ? new Date(result.credential.issueDate).toLocaleDateString() : "N/A"}
          </p>
        </div>
      </div>

      {result.credential?.blockchainStatus && (
        <div className="mt-4 pt-4 border-t">
          <p className="text-xs text-gray-500">Blockchain Status</p>
          <p className="text-sm font-medium text-gray-900">{result.credential.blockchainStatus}</p>
        </div>
      )}

      <div className="mt-4 text-xs text-gray-400">
        Verified at: {new Date(result.verifiedAt).toLocaleString()}
      </div>
    </div>
  );
}
