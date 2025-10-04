import React from "react";
import InputField from "../../../components-ui/InputField";

export default function OCRPreview({ fields, onChange }) {
  return (
    <div className="p-3 border rounded bg-gray-50 space-y-3">
      <h2 className="text-md font-semibold">Certificate Details (OCR Extracted)</h2>
      <InputField
        label="Learner DID / Email"
        value={fields.learnerDid}
        onChange={(e) => onChange({ learnerDid: e.target.value })}
      />
      <InputField
        label="Course ID"
        value={fields.courseId}
        onChange={(e) => onChange({ courseId: e.target.value })}
      />
      <InputField
        label="Certificate ID"
        value={fields.certId}
        onChange={(e) => onChange({ certId: e.target.value })}
      />
      <InputField
        label="Metadata"
        value={fields.metadata}
        onChange={(e) => onChange({ metadata: e.target.value })}
      />
    </div>
  );
}