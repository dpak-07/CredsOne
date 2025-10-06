import React, { useState } from "react";
import InputField from "../../../components-ui/InputField";

export default function ManualVerifyForm({ onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    certificateId: "",
    issuerName: "",
    learnerName: "",
    courseName: "",
    issueDate: "",
    notes: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 space-y-4">
      <h3 className="text-lg font-bold text-gray-900 mb-4">Manual Verification Entry</h3>
      <p className="text-sm text-gray-600 mb-4">
        Enter credential details to verify against the blockchain. All fields marked with * are required.
      </p>
      <InputField
        label="Certificate ID *"
        type="text"
        name="certificateId"
        value={formData.certificateId}
        onChange={handleChange}
        placeholder="CERT-12345 or vc-abc123..."
        required
      />
      <InputField
        label="Issuer Name *"
        type="text"
        name="issuerName"
        value={formData.issuerName}
        onChange={handleChange}
        placeholder="University Name or Institution"
        required
      />
      <InputField
        label="Learner Name *"
        type="text"
        name="learnerName"
        value={formData.learnerName}
        onChange={handleChange}
        placeholder="John Doe"
        required
      />
      <InputField
        label="Course/Credential Name *"
        type="text"
        name="courseName"
        value={formData.courseName}
        onChange={handleChange}
        placeholder="BS Computer Science"
        required
      />
      <InputField
        label="Issue Date *"
        type="date"
        name="issueDate"
        value={formData.issueDate}
        onChange={handleChange}
        required
      />
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Verification Notes
        </label>
        <textarea
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          rows={3}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
          placeholder="Optional: Add any notes about this verification..."
        />
      </div>
      <div className="flex justify-end space-x-2 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-white bg-purple-600 hover:bg-purple-700 rounded-lg transition"
        >
          Verify Credential
        </button>
      </div>
    </form>
  );
}
