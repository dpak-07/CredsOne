import React from "react";
import TrustBadge from "../../../components-ui/TrustBadge";

export default function BadgeLegend() {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-bold text-gray-900 mb-4">Trust Badge Legend</h3>
      <div className="space-y-4">
        <div className="flex items-start space-x-3">
          <TrustBadge badge="green" size="sm" />
          <div>
            <p className="font-semibold text-gray-900">Green - Blockchain Verified</p>
            <p className="text-sm text-gray-600">
              Certificate is verified on blockchain and tamper-proof. Highest level of trust.
            </p>
          </div>
        </div>

        <div className="flex items-start space-x-3">
          <TrustBadge badge="amber" size="sm" />
          <div>
            <p className="font-semibold text-gray-900">Amber - Legacy Certificate</p>
            <p className="text-sm text-gray-600">
              Certificate exists in database but not on blockchain. Issued before blockchain integration.
            </p>
          </div>
        </div>

        <div className="flex items-start space-x-3">
          <TrustBadge badge="blue" size="sm" />
          <div>
            <p className="font-semibold text-gray-900">Blue - Database Record</p>
            <p className="text-sm text-gray-600">
              Certificate found in database. Awaiting blockchain confirmation.
            </p>
          </div>
        </div>

        <div className="flex items-start space-x-3">
          <TrustBadge badge="red" size="sm" />
          <div>
            <p className="font-semibold text-gray-900">Red - Invalid/Not Found</p>
            <p className="text-sm text-gray-600">
              Certificate not found, revoked, or failed verification. Do not accept.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
