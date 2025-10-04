import React from "react";

export default function VCDetailsSummary({ credential }) {
  if (!credential) return null;

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
      <h3 className="font-semibold text-gray-900 mb-3">Credential Summary</h3>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">VC ID:</span>
          <span className="font-mono text-gray-900">{credential.vcId}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Learner:</span>
          <span className="font-medium text-gray-900">{credential.learnerName}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Credential:</span>
          <span className="font-medium text-gray-900">{credential.courseName}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Issuer:</span>
          <span className="text-gray-900">{credential.issuer}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Issued:</span>
          <span className="text-gray-900">{credential.issueDate}</span>
        </div>
        {credential.expiryDate && (
          <div className="flex justify-between">
            <span className="text-gray-600">Expires:</span>
            <span className="text-gray-900">{credential.expiryDate}</span>
          </div>
        )}
      </div>
    </div>
  );
}
