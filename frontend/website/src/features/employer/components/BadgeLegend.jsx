import React from "react";
import TrustBadge from "../../../components-ui/TrustBadge";

export default function BadgeLegend() {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
      <h3 className="text-sm font-bold text-gray-900 mb-3">Trust Badge Guide:</h3>
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <TrustBadge level="green" />
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900">Green - Fully Verified</p>
            <p className="text-xs text-gray-600">Verified on-chain with trusted issuer</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <TrustBadge level="amber" />
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900">Amber - Pending Review</p>
            <p className="text-xs text-gray-600">Pending full verification or manual audit</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <TrustBadge level="blue" />
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900">Blue - Manually Issued</p>
            <p className="text-xs text-gray-600">Manually verified, not yet blockchain-verified</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <TrustBadge level="default" />
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900">Unknown - Unverified</p>
            <p className="text-xs text-gray-600">Verification status unknown or not yet processed</p>
          </div>
        </div>
      </div>
    </div>
  );
}
