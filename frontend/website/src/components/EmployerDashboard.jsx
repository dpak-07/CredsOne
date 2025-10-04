import React from "react";

const EmployerDashboard = ({ onLogout }) => (
  <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
    <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-lg text-center">
      <h2 className="text-4xl font-extrabold text-green-600 mb-4">Employer Portal</h2>
      <p className="text-xl text-gray-700 mb-8">
        Welcome! Manage your hiring process and discover great talent.
      </p>
      <button
        onClick={onLogout}
        className="px-6 py-2 bg-red-500 text-white font-bold rounded-lg hover:bg-red-600 transition duration-200"
      >
        Logout
      </button>
    </div>
  </div>
);

export default EmployerDashboard;
