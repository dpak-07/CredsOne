import { useState, useRef, useCallback } from "react";

export function useScanner() {
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState(null);
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const scanIntervalRef = useRef(null);

  const startScanning = useCallback(async (onScan) => {
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: "environment" } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsScanning(true);

        // TODO: Integrate html5-qrcode or jsQR library here
        // For now, this is a placeholder
        scanIntervalRef.current = setInterval(() => {
          // QR code detection logic would go here
          // When QR detected: onScan(qrData) and stopScanning()
        }, 100);
      }
    } catch (err) {
      setError("Camera access denied. Please enable camera permissions.");
      console.error("Camera error:", err);
    }
  }, []);

  const stopScanning = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current);
      scanIntervalRef.current = null;
    }
    setIsScanning(false);
  }, []);

  return {
    isScanning,
    error,
    videoRef,
    startScanning,
    stopScanning
  };
}
