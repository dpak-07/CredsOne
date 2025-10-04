import React from "react";
import Header from "./Header";

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
