import React from "react";
import { IconLogout } from "../../../components-ui/icons";

export default function VerifierHeader({ organizationName, verifierDID, verifiedToday, verifiedMonth, onLogout, onSettings }) {
  return (
    <div className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
               {organizationName}
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Verifier DID: <span className="font-mono">{verifierDID}</span>
            </p>
            <div className="flex items-center space-x-4 mt-2">
              <span className="text-sm text-gray-600">
                Verified Today: <span className="font-semibold text-green-600">{verifiedToday || 0}</span>
              </span>
              <span className="text-sm text-gray-600">
                This Month: <span className="font-semibold text-blue-600">{verifiedMonth || 0}</span>
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={onLogout}
              className="flex items-center space-x-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition"
              title="Logout"
            >
              <IconLogout size={20} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
