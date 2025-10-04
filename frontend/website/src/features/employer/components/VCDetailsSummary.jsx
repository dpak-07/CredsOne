import React from "react";
import { IconBuilding, IconCalendar, IconHash } from "../../../components-ui/icons";

export default function VCDetailsSummary({ credential }) {
  if (!credential) return null;

  return (
    <div className="bg-gray-50 rounded-lg p-4 space-y-3">
      <h4 className="font-semibold text-gray-900">Credential Details</h4>
      
      <div className="flex items-start space-x-2">
        <IconBuilding size={16} className="text-gray-500 mt-1" />
        <div className="flex-1">
          <p className="text-xs text-gray-500">Issuer</p>
          <p className="text-sm font-medium">{credential.issuer || "N/A"}</p>
        </div>
      </div>

      <div className="flex items-start space-x-2">
        <IconCalendar size={16} className="text-gray-500 mt-1" />
        <div className="flex-1">
          <p className="text-xs text-gray-500">Issue Date</p>
          <p className="text-sm font-medium">
            {credential.issueDate ? new Date(credential.issueDate).toLocaleDateString() : "N/A"}
          </p>
        </div>
      </div>

      {credential.fileHash && (
        <div className="flex items-start space-x-2">
          <IconHash size={16} className="text-gray-500 mt-1" />
          <div className="flex-1">
            <p className="text-xs text-gray-500">File Hash</p>
            <p className="text-xs font-mono text-gray-700 break-all">{credential.fileHash}</p>
          </div>
        </div>
      )}
    </div>
  );
}
