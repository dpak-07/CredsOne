// src/App.jsx
import React from 'react';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-300 via-purple-300 to-indigo-400 flex items-center justify-center p-6">
      <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-10 max-w-lg w-full text-center fade-in glow">
        <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-500 via-red-500 to-yellow-500 mb-4 slide-up">
          🌈 Vite + React + Tailwind
        </h1>
        <p className="text-lg text-gray-700 font-medium mb-6 slide-up">
          Fully animated and styled with vibrant gradients, glowing effects, and custom transitions!
        </p>
        <button className="bg-gradient-to-r from-fuchsia-500 to-purple-600 hover:from-purple-600 hover:to-fuchsia-500 text-white font-bold py-2 px-6 rounded-full shadow-lg transition-all duration-500 slide-up">
          🎉 Get Started
        </button>
      </div>
    </div>
  );
}

export default App;
