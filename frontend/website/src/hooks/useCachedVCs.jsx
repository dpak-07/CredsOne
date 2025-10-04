// src/hooks/useCachedVCs.jsx
import { useRef } from "react";

export default function useCachedVCs() {
  const storeRef = useRef(new Map());

  function getVC(id) {
    return Promise.resolve(storeRef.current.get(id) || null);
  }

  function setVC(id, vc) {
    if (id) storeRef.current.set(id, vc);
  }

  function setMany(items) {
    if (Array.isArray(items)) {
      items.forEach((item) => {
        if (item?.id) storeRef.current.set(item.id, item);
      });
    }
  }

  function clear() {
    storeRef.current.clear();
  }

  return { getVC, setVC, setMany, clear };
}
