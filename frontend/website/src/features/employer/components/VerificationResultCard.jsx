import React from "react";
import TrustBadge from "../../../components-ui/TrustBadge";

export default function VerificationResultCard({ result, onViewDetails }) {
  if (!result) return null;

  const isValid = result.status === "valid";
  const isPending = result.status === "pending";

  return (
    <div className={`bg-white rounded-lg shadow-lg p-6 border-2 ${isValid ? "border-green-500" : isPending ? "border-amber-500" : "border-red-500"}`}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <h2 className={`text-2xl font-bold ${isValid ? "text-green-700" : isPending ? "text-amber-700" : "text-red-700"}`}>
            {isValid ? " VALID CREDENTIAL" : isPending ? " PENDING REVIEW" : " INVALID CREDENTIAL"}
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Verified: {new Date(result.verifiedAt).toLocaleString()} | Method: {result.method}
          </p>
        </div>
        <div className="text-right">
          <TrustBadge level={result.badge || "blue"} />
          <p className="text-sm text-gray-600 mt-1">Trust Score: {result.trustScore}%</p>
        </div>
      </div>

      {result.credential && (
        <div className="bg-gray-50 rounded-lg p-4 mb-4">
          <h3 className="font-semibold text-gray-900 mb-2">Credential Details:</h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div><span className="font-medium">Learner:</span> {result.credential.learnerName}</div>
            <div><span className="font-medium">Credential:</span> {result.credential.courseName}</div>
            <div><span className="font-medium">Issuer:</span> {result.credential.issuer}</div>
            <div><span className="font-medium">Issue Date:</span> {result.credential.issueDate}</div>
            {result.credential.status && (
              <div><span className="font-medium">Status:</span> {result.credential.status}</div>
            )}
          </div>
        </div>
      )}

      {result.blockchain && (
        <div className="bg-blue-50 rounded-lg p-4 mb-4">
          <h3 className="font-semibold text-gray-900 mb-2">Blockchain Verification:</h3>
          <p className="text-sm"><span className="font-medium">Tx ID:</span> {result.blockchain.txId}</p>
          <p className="text-sm"><span className="font-medium">Block:</span> {result.blockchain.block}</p>
        </div>
      )}

      <div className="flex justify-end space-x-2">
        <button
          onClick={() => onViewDetails && onViewDetails(result)}
          className="px-4 py-2 text-purple-600 hover:bg-purple-50 rounded-lg transition border border-purple-600"
        >
          View Full Details
        </button>
        {isValid && (
          <button className="px-4 py-2 text-white bg-green-600 hover:bg-green-700 rounded-lg transition">
            Accept & Record
          </button>
        )}
      </div>
    </div>
  );
}
