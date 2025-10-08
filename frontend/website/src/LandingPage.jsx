import React from "react";

// Icons component moved inline
const IconLogIn = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" 
       viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" 
       strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
    <polyline points="10 17 15 12 10 7"/>
    <line x1="15" x2="3" y1="12" y2="12"/>
  </svg>
);

const IconUserPlus = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" 
       viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" 
       strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <line x1="19" x2="19" y1="8" y2="14"/>
    <line x1="22" x2="16" y1="11" y2="11"/>
  </svg>
);

// Header component moved inline
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

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col font-sans">
      {/* Header */}
      <Header 
        onNavigateToLogin={() => window.location.href="/login"} 
        onNavigateToRegister={() => window.location.href="/login"} 
      />

      {/* Main Hero Section */}
      <main className="flex-grow flex items-center p-8">
        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Text Content */}
          <div className="space-y-6">
            <h2 className="text-7xl font-extrabold text-gray-900 leading-tight">
              Start, switch, or advance your career
            </h2>
            <p className="text-2xl text-gray-600 mt-4">
              Grow with certified skills from the organizations you trust.
            </p>

            {/* Buttons below text */}
            <div className="flex space-x-4 pt-6">
              <button
                onClick={() => window.location.href="/login"}
                className="px-8 py-3 bg-purple-600 text-white font-bold text-lg rounded-xl shadow-lg hover:bg-purple-700 transition transform hover:scale-[1.02]"
              >
                Join for Free
              </button>
              <button
                onClick={() => window.location.href="/login"}
                className="px-8 py-3 border-2 border-purple-600 text-purple-600 font-bold text-lg rounded-xl hover:bg-purple-50 transition transform hover:scale-[1.02]"
              >
                I'm an Employer/Institution
              </button>
            </div>
          </div>

          {/* Right Image / Graphic */}
          <div className="hidden lg:flex justify-end">
            <div className="w-96 h-96 bg-blue-200 rounded-full flex items-center justify-center text-gray-600 text-xl font-semibold">
              [Image Placeholder]
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LandingPage;