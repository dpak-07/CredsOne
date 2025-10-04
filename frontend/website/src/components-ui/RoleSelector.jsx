import React, { useRef, useEffect, useState } from "react";
import { IconUser, IconBriefcase, IconSchool } from "./icons";

const RoleSelector = ({ selectedRole, setSelectedRole }) => {
  const containerRef = useRef(null);
  const [indicatorStyle, setIndicatorStyle] = useState({});

  useEffect(() => {
    if (!containerRef.current) return;
    const buttons = containerRef.current.querySelectorAll("button");
    const index = ["Learner", "Employer", "Institution"].indexOf(selectedRole);
    if (buttons[index]) {
      const btn = buttons[index];
      setIndicatorStyle({
        width: btn.offsetWidth + "px",
        left: btn.offsetLeft + "px",
      });
    }
  }, [selectedRole]);

  return (
    <div className="relative w-full mb-6">
      {/* Sliding bar */}
      <div
        className="absolute top-0 h-full bg-purple-600 rounded-xl transition-all duration-300 ease-in-out"
        style={indicatorStyle}
      />
      <div
        ref={containerRef}
        className="relative flex space-x-4"
      >
        {["Learner", "Employer", "Institution"].map((role) => (
          <button
            key={role}
            type="button"
            onClick={() => setSelectedRole(role)}
            className={`flex-1 p-3 text-center rounded-xl font-semibold transition-all duration-200 relative z-10
              ${selectedRole === role
                ? "text-white"
                : "text-gray-700"
              }`}
          >
            {role === "Learner" && (
              <IconUser size={20} className="inline mr-2" />
            )}
            {role === "Employer" && (
              <IconBriefcase size={20} className="inline mr-2" />
            )}
            {role === "Institution" && (
              <IconSchool size={20} className="inline mr-2" />
            )}
            {role}
          </button>
        ))}
      </div>
    </div>
  );
};

export default RoleSelector;
