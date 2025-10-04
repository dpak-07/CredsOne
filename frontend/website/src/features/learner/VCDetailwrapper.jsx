import React from "react";
import { useParams } from "react-router-dom";
import VCDetailContainer from "./VCDetailContainer";
import useCachedVCs from "../../hooks/useCachedVCs";

export default function VCDetailWrapper() {
  const { id: vcId } = useParams();
  const cache = useCachedVCs();
  return <VCDetailContainer vcId={vcId} cache={cache} />;
}