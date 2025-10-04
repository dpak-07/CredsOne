import React from "react";

export default function MigrationToolUI() {
  return (
    <section className="p-4 border rounded bg-white shadow-sm">
      <h2 className="font-semibold text-lg mb-2">Migration Tool</h2>
      <p className="text-sm text-gray-600">
        Ingest legacy credentials and mark as Amber.
      </p>
      <button className="mt-2 px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600">
        Migrate Legacy
      </button>
    </section>
  );
}
