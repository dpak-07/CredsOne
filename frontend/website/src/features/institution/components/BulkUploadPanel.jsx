import React from "react";

export default function BulkUploadPanel() {
  return (
    <section className="p-4 border rounded bg-white shadow-sm">
      <h2 className="font-semibold text-lg mb-2">Bulk Upload</h2>
      <p className="text-sm text-gray-600">Upload CSV + files for batch issuance.</p>
      <input type="file" accept=".csv" className="mt-2 text-sm" />
    </section>
  );
}
