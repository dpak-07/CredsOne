import { useState, useEffect, useRef } from "react";
import { Html5Qrcode } from "html5-qrcode";

export function useScanner() {
  const [scanning, setScanning] = useState(false);
  const [cameras, setCameras] = useState([]);
  const [selectedCamera, setSelectedCamera] = useState(null);
  const [error, setError] = useState(null);
  const html5QrCodeRef = useRef(null);

  useEffect(() => {
    Html5Qrcode.getCameras()
      .then((devices) => {
        if (devices && devices.length > 0) {
          setCameras(devices);
          setSelectedCamera(devices[0].id);
        } else {
          setError("No cameras found on this device");
        }
      })
      .catch((err) => {
        console.error("Error detecting cameras:", err);
        setError("Failed to access cameras. Please grant camera permission.");
      });
  }, []);

  const startScan = (onDetect) => {
    if (!selectedCamera) {
      setError("No camera selected");
      return;
    }

    setScanning(true);
    setError(null);

    setTimeout(() => {
      try {
        const scanner = new Html5Qrcode("qr-reader");
        html5QrCodeRef.current = scanner;

        scanner
          .start(
            selectedCamera,
            {
              fps: 10,
              qrbox: { width: 250, height: 250 }
            },
            (decodedText) => {
              console.log("QR Code detected:", decodedText);
              onDetect(decodedText);
              stopScan();
            },
            (errorMessage) => {
              // Ignore scanning errors
            }
          )
          .catch((err) => {
            console.error("Error starting scanner:", err);
            if (err.name === "NotAllowedError") {
              setError("Camera access denied. Please allow camera access in browser settings.");
            } else if (err.name === "NotFoundError") {
              setError("No camera found. Please connect a camera and try again.");
            } else if (err.name === "NotReadableError") {
              setError("Camera is in use by another application.");
            } else {
              setError("Failed to start scanner: " + err.message);
            }
            setScanning(false);
          });
      } catch (err) {
        console.error("Error initializing scanner:", err);
        setError("Failed to initialize scanner");
        setScanning(false);
      }
    }, 100);
  };

  const stopScan = () => {
    if (html5QrCodeRef.current) {
      try {
        const scanner = html5QrCodeRef.current;
        if (scanner.getState() === 2) {
          scanner
            .stop()
            .then(() => {
              console.log("Scanner stopped successfully");
              setScanning(false);
              html5QrCodeRef.current = null;
            })
            .catch((err) => {
              console.error("Error stopping scanner:", err);
              setScanning(false);
              html5QrCodeRef.current = null;
            });
        } else {
          setScanning(false);
          html5QrCodeRef.current = null;
        }
      } catch (err) {
        console.error("Error stopping scanner:", err);
        setScanning(false);
        html5QrCodeRef.current = null;
      }
    } else {
      setScanning(false);
    }
  };

  return {
    scanning,
    cameras,
    selectedCamera,
    setSelectedCamera,
    error,
    startScan,
    stopScan
  };
}
