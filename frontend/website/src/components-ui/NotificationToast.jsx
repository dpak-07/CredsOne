// src/components-ui/NotificationToast.jsx
import React, { useEffect } from "react";

export default function NotificationToast({ message, type = "info", onClose, duration = 3000 }) {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      onClose?.();
    }, duration);
    return () => clearTimeout(timer);
  }, [message, duration, onClose]);

  if (!message) return null;

  const colorMap = {
    success: "bg-green-500",
    error: "bg-red-500",
    warning: "bg-yellow-500",
    info: "bg-blue-500",
  };

  return (
    <div className="fixed bottom-5 right-5 z-50">
      <div
        className={`text-white px-4 py-2 rounded shadow ${colorMap[type] || colorMap.info}`}
      >
        {message}
      </div>
    </div>
  );
}
