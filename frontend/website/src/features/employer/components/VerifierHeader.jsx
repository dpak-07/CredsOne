import React from "react";
import { IconShield, IconLogout } from "../../../components-ui/icons";

export default function VerifierHeader({ organization, verifierDid, onLogout }) {
  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center">
              <IconShield size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">{organization}</h1>
              <p className="text-sm text-gray-500 font-mono">{verifierDid}</p>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition"
          >
            <IconLogout size={20} />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
}
