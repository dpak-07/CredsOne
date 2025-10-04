import React from "react";
import InputField from "../../../components-ui/InputField";

export default function FieldEditor({ fields, onChange }) {
  return (
    <div className="p-3 border rounded bg-gray-50 space-y-3">
      <h2 className="text-md font-semibold">Field Editor</h2>
      {Object.keys(fields).map((key) => (
        <InputField
          key={key}
          label={key}
          value={fields[key]}
          onChange={(e) => onChange({ [key]: e.target.value })}
        />
      ))}
    </div>
  );
}
