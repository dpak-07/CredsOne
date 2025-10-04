import React, { useState, useRef, useEffect } from "react";
import { IconCamera, IconX } from "../../../components-ui/icons";

export default function ScanPanel({ onScan, loading }) {
  const [isScanning, setIsScanning] = useState(false);
  const [scanError, setScanError] = useState(null);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const startScanning = async () => {
    try {
      setScanError(null);
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsScanning(true);
      }
    } catch (error) {
      setScanError("Camera access denied");
    }
  };

  const stopScanning = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsScanning(false);
  };

  return (
    <div className="bg-gradient-to-br from-purple-50 to-blue-50 border-2 border-dashed border-purple-300 rounded-lg p-8">
      {!isScanning ? (
        <div className="text-center space-y-4">
          <IconCamera size={48} className="text-purple-600 mx-auto" />
          <h3 className="text-lg font-semibold">QR Code Scanner</h3>
          <button onClick={startScanning} disabled={loading} className="px-6 py-3 bg-purple-600 text-white rounded-lg">Start Scanner</button>
          {scanError && <p className="text-red-600 text-sm">{scanError}</p>}
        </div>
      ) : (
        <div className="space-y-4">
          <video ref={videoRef} autoPlay playsInline className="w-full rounded-lg" />
          <button onClick={stopScanning} className="px-4 py-2 bg-red-600 text-white rounded-lg">Stop</button>
        </div>
      )}
    </div>
  );
}