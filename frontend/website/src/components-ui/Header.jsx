import React from "react";
import { IconLogIn, IconUserPlus, IconUser, IconMail, IconLock, IconBriefcase, IconSchool } from "../components-ui/icons.jsx";

const Header = ({ onNavigateToLogin, onNavigateToRegister }) => (
  <header className="bg-white shadow-md">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
      <h1 className="text-2xl font-bold text-purple-600 cursor-pointer">
        CredsOne
      </h1>
      <nav className="flex items-center space-x-4">
        <button
          onClick={onNavigateToLogin}
          className="flex items-center space-x-2 px-3 py-2 text-gray-700 hover:text-purple-600 transition font-medium rounded-lg"
        >
          <IconLogIn size={20} />
          <span>Log In</span>
        </button>
        <button
          onClick={onNavigateToRegister}
          className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white font-bold rounded-lg shadow-md hover:bg-purple-700 transition"
        >
          <IconUserPlus size={20} />
          <span>Join for Free</span>
        </button>
      </nav>
    </div>
  </header>
);

export default Header;
