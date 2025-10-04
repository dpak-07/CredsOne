// src/features/learner/components/ActivityFeed.jsx
import React, { useEffect, useState } from "react";
import { getAudit } from "../../../services/api";

export default function ActivityFeed({ learnerDid, pollMs = 15000 }) {
  const [items, setItems] = useState([]);

  useEffect(() => {
    let timer;
    async function load() {
      if (!learnerDid) return;
      try {
        const res = await getAudit({ learnerDid }); // implement in api.js
        const arr = Array.isArray(res) ? res : res?.items ?? [];
        setItems(arr.slice(0, 10));
      } catch (e) {
        console.error("audit load error", e);
      }
    }
    load();
    if (pollMs) {
      timer = setInterval(load, pollMs);
    }
    return () => timer && clearInterval(timer);
  }, [learnerDid, pollMs]);

  if (!items.length) return null;

  return (
    <aside className="mt-6 bg-white rounded-2xl border p-4 shadow-sm">
      <h4 className="text-sm font-semibold text-indigo-700 mb-3">Recent Activity</h4>
      <ul className="space-y-2">
        {items.map((it, idx) => (
          <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
            <span className="mt-1 inline-block w-2 h-2 rounded-full bg-indigo-500"></span>
            <div>
              <div className="font-medium">{it.action || it.type || "Event"}</div>
              <div className="text-xs text-gray-500">
                {new Date(it.date || it.createdAt || Date.now()).toLocaleString()}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </aside>
  );
}
