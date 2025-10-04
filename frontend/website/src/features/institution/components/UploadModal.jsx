import React from "react";
import Modal from "../../../components-ui/Modal";

export default function UploadModal({ onClose, onFileSelect }) {
  return (
    <Modal isOpen={true} onClose={onClose} title="Upload Certificate">
      <input type="file" onChange={onFileSelect} className="text-sm" />
    </Modal>
  );
}
