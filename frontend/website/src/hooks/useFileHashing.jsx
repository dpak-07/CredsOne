// src/hooks/useFileHashing.jsx
import { useState } from "react";

export default function useFileHashing() {
  const [hash, setHash] = useState(null);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);

  async function hashFile(file) {
    setHash(null);
    setError(null);
    setProgress(0);

    try {
      const buffer = await file.arrayBuffer();
      setProgress(50);

      const digest = await crypto.subtle.digest("SHA-256", buffer);
      const hashArray = Array.from(new Uint8Array(digest));
      const hex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
      setProgress(100);
      setHash(hex);
      return hex;
    } catch (err) {
      console.error("Hash error:", err);
      setError("Failed to hash file");
      throw err;
    }
  }

  return { hash, progress, error, hashFile };
}
