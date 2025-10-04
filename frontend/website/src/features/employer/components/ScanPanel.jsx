import React, { useEffect } from "react";
import Modal from "../../../components-ui/Modal";
import { IconCamera } from "../../../components-ui/icons";

export default function ScanPanel({ isOpen, onClose, onDetect, scanning, error, startScan }) {
  useEffect(() => {
    if (isOpen && !scanning) {
      startScan(onDetect);
    }
  }, [isOpen]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <span className="flex items-center">
          <IconCamera className="mr-2" size={24} />
          Scan Credential QR Code
        </span>
      }
    >
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}
      
      <div className="bg-gray-100 rounded-lg p-4">
        <div id="qr-reader" className="w-full"></div>
      </div>
      
      <div className="mt-4 text-sm text-gray-600">
        <h3 className="font-semibold mb-2">Instructions:</h3>
        <ul className="list-disc list-inside space-y-1">
          <li>Position the QR code in the center of the camera view</li>
          <li>Ensure good lighting</li>
          <li>Hold the device steady</li>
          <li>The scan will complete automatically when detected</li>
        </ul>
      </div>
      
      <div className="mt-4 flex justify-end space-x-2">
        <button
          onClick={onClose}
          className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
        >
          Cancel
        </button>
      </div>
    </Modal>
  );
}
