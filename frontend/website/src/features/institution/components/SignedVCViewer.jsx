import React from "react";

export default function SignedVCViewer({ vc }) {
  return (
    <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto max-h-64">
      {JSON.stringify(vc, null, 2)}
    </pre>
  );
}
