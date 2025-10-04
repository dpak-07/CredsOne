import React from "react";

export default function IssuanceQueue() {
  return (
    <section className="p-4 border rounded bg-white shadow-sm">
      <h2 className="font-semibold text-lg mb-2">Issuance Queue</h2>
      <ul className="text-sm space-y-1">
        <li>Pending issuance #123</li>
        <li>In progress issuance #124</li>
        <li>Completed issuance #122 ✅</li>
      </ul>
    </section>
  );
}
