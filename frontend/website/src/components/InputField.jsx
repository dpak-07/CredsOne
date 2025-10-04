import React from "react";

const InputField = ({ icon: Icon, type, placeholder, value, onChange }) => (
  <div className="relative mb-4">
    <Icon size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition duration-150"
      required
    />
  </div>
);

export default InputField;
