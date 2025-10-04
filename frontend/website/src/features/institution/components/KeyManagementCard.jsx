import React from "react";

export default function KeyManagementCard() {
  return (
    <section className="p-4 border rounded bg-white shadow-sm">
      <h2 className="font-semibold text-lg mb-2">Key Management</h2>
      <p className="text-sm">Current Key Status: Active</p>
      <button className="mt-2 px-3 py-1 bg-gray-200 rounded hover:bg-gray-300">
        Rotate Keys
      </button>
    </section>
  );
}
