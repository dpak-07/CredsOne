import React, { useState } from "react";
import { IconUpload, IconX, IconFile } from "../../../components-ui/icons";

export default function UploadModal({ isOpen, onClose, onUpload, loading }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) setSelectedFile(file);
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) setSelectedFile(file);
  };

  const handleSubmit = () => {
    if (selectedFile) {
      onUpload(selectedFile);
      setSelectedFile(null);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Upload Certificate</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <IconX size={24} />
          </button>
        </div>

        <div
          onDrop={handleDrop}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          className={`border-2 border-dashed rounded-lg p-8 text-center ${
            isDragging ? 'border-purple-500 bg-purple-50' : 'border-gray-300'
          }`}
        >
          {selectedFile ? (
            <div className="space-y-2">
              <IconFile size={48} className="text-green-600 mx-auto" />
              <p className="font-medium">{selectedFile.name}</p>
              <p className="text-sm text-gray-500">{(selectedFile.size / 1024).toFixed(2)} KB</p>
              <button
                onClick={() => setSelectedFile(null)}
                className="text-red-600 text-sm hover:underline"
              >
                Remove
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              <IconUpload size={48} className="text-gray-400 mx-auto" />
              <p className="text-gray-600">Drag & drop or click to upload</p>
              <input
                type="file"
                onChange={handleFileSelect}
                className="hidden"
                id="file-upload"
                accept=".pdf,.jpg,.jpeg,.png"
              />
              <label
                htmlFor="file-upload"
                className="inline-block px-4 py-2 bg-purple-600 text-white rounded-lg cursor-pointer hover:bg-purple-700"
              >
                Choose File
              </label>
            </div>
          )}
        </div>

        <div className="mt-6 flex space-x-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!selectedFile || loading}
            className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
          >
            {loading ? "Uploading..." : "Upload & Verify"}
          </button>
        </div>
      </div>
    </div>
  );
}
