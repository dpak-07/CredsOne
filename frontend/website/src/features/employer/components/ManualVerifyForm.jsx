import React, { useState } from "react";
import { IconFile } from "../../../components-ui/icons";

export default function ManualVerifyForm({ onSubmit, loading }) {
  const [formData, setFormData] = useState({
    certificateId: "",
    issuerName: "",
    learnerName: "",
    courseName: "",
    issueDate: "",
    notes: ""
  });
  const [attachedFile, setAttachedFile] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileAttach = (e) => {
    setAttachedFile(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ ...formData, file: attachedFile });
    setFormData({ certificateId: "", issuerName: "", learnerName: "", courseName: "", issueDate: "", notes: "" });
    setAttachedFile(null);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 space-y-4">
      <h3 className="text-lg font-bold text-gray-900 mb-4">Manual Verification Form</h3>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Certificate ID *</label>
        <input
          type="text"
          name="certificateId"
          value={formData.certificateId}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
          placeholder="CERT-12345"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Issuer Name *</label>
        <input
          type="text"
          name="issuerName"
          value={formData.issuerName}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
          placeholder="University Name"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Learner Name *</label>
        <input
          type="text"
          name="learnerName"
          value={formData.learnerName}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
          placeholder="John Doe"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Course Name *</label>
        <input
          type="text"
          name="courseName"
          value={formData.courseName}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
          placeholder="Computer Science"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Issue Date *</label>
        <input
          type="date"
          name="issueDate"
          value={formData.issueDate}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
        <textarea
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          rows={3}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
          placeholder="Additional verification notes..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Attach File (Optional)</label>
        <div className="flex items-center space-x-2">
          <input
            type="file"
            onChange={handleFileAttach}
            className="hidden"
            id="manual-file-upload"
            accept=".pdf,.jpg,.jpeg,.png"
          />
          <label
            htmlFor="manual-file-upload"
            className="px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 inline-flex items-center space-x-2"
          >
            <IconFile size={20} />
            <span>{attachedFile ? attachedFile.name : "Choose File"}</span>
          </label>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full px-4 py-3 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition disabled:opacity-50"
      >
        {loading ? "Verifying..." : "Submit Verification"}
      </button>
    </form>
  );
}
