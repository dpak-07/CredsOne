import React from "react";
import { IconUser, IconBriefcase, IconSchool } from "./icons";

const RoleSelector = ({ selectedRole, setSelectedRole }) => (
  <div className="flex space-x-4 mb-6">
    {['Learner', 'Employer', 'Institution'].map((role) => (
      <button
        key={role}
        onClick={() => setSelectedRole(role)}
        className={`flex-1 p-3 text-center rounded-xl transition-all duration-200 font-semibold shadow-md
          ${selectedRole === role
            ? 'bg-purple-600 text-white ring-4 ring-purple-300 shadow-lg transform scale-105'
            : 'bg-white text-gray-700 hover:bg-gray-50 hover:shadow-sm'
          }`}
      >
        {role === 'Learner' && <IconUser size={20} className="inline mr-2" />}
        {role === 'Employer' && <IconBriefcase size={20} className="inline mr-2" />}
        {role === 'Institution' && <IconSchool size={20} className="inline mr-2" />}
        {role}
      </button>
    ))}
  </div>
);

export default RoleSelector;
