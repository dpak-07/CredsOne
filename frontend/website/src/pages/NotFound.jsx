// src/pages/NotFound.jsx
import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";

export default function NotFound() {
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const rafRef = useRef();

  useEffect(() => {
    setMounted(true);
    
    const handleMouseMove = (e) => {
      mouseRef.current = {
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1
      };
    };

    window.addEventListener('mousemove', handleMouseMove);
    
    // Cleanup
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // Floating particles with mouse interaction
  const Particle = ({ style, index }) => {
    const particleRef = useRef(null);
    
    useEffect(() => {
      const updateParticle = () => {
        if (particleRef.current) {
          const moveX = mouseRef.current.x * 20;
          const moveY = mouseRef.current.y * 20;
          
          particleRef.current.style.transform = `translate3d(${moveX}px, ${moveY}px, 0) rotate(${moveX}deg)`;
        }
        rafRef.current = requestAnimationFrame(updateParticle);
      };
      
      updateParticle();
      
      return () => {
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
      };
    }, []);

    return (
      <div
        ref={particleRef}
        className="absolute w-2 h-2 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full opacity-30 transition-transform duration-1000 ease-out"
        style={{
          animation: `floatParticle 8s ease-in-out ${index * 0.5}s infinite`,
          ...style
        }}
      />
    );
  };

  const particles = Array.from({ length: 25 }, (_, i) => ({
    id: i,
    style: {
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
    },
  }));

  // Interactive elements that follow mouse
  const InteractiveOrb = ({ size, color, delay }) => {
    const orbRef = useRef(null);
    
    useEffect(() => {
      const updateOrb = () => {
        if (orbRef.current) {
          const moveX = mouseRef.current.x * 40;
          const moveY = mouseRef.current.y * 40;
          
          orbRef.current.style.transform = `translate3d(${moveX}px, ${moveY}px, 0) scale(${1 + Math.abs(mouseRef.current.x) * 0.1})`;
        }
      };
      
      const interval = setInterval(updateOrb, 100);
      return () => clearInterval(interval);
    }, []);

    return (
      <div
        ref={orbRef}
        className={`absolute rounded-full blur-2xl opacity-20 ${color}`}
        style={{
          width: size,
          height: size,
          animation: `orbFloat 15s ease-in-out ${delay}s infinite`,
          transition: 'transform 0.3s ease-out'
        }}
      />
    );
  };

  return (
    <div 
      ref={containerRef}
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 px-4 overflow-hidden relative cursor-default"
    >
      {/* Interactive Background Orbs */}
      <InteractiveOrb size="400px" color="bg-cyan-500/10" delay="0" />
      <InteractiveOrb size="300px" color="bg-violet-500/15" delay="2" />
      <InteractiveOrb size="500px" color="bg-fuchsia-500/10" delay="4" />

      {/* Mouse-following Particles */}
      {particles.map((particle, index) => (
        <Particle
          key={particle.id}
          index={index}
          style={particle.style}
        />
      ))}

      {/* Mouse Trail Effect */}
      <MouseTrail />

      {/* Grid Pattern with Parallax */}
      <div 
        className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]"
        style={{
          transform: `translate3d(${mouseRef.current.x * 20}px, ${mouseRef.current.y * 20}px, 0)`
        }}
      />

      <div className={`text-center w-full max-w-2xl mx-auto relative z-10 transition-all duration-1000 transform ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
        
        {/* Smooth 404 Numbers */}
        <div className="relative mb-16 flex justify-center">
          {/* Enhanced Glow Effect */}
          <div 
            className="absolute inset-0 bg-gradient-to-r from-violet-600/40 to-fuchsia-600/40 rounded-full blur-3xl mx-auto"
            style={{ 
              animation: 'pulseGlow 6s ease-in-out infinite',
              width: '500px',
              left: '50%',
              transform: 'translateX(-50%)',
              transition: 'transform 0.2s ease-out'
            }}
          />
          
          {/* Smooth 404 Animation */}
          <div className="relative">
            <h1 
              className="text-9xl font-black text-white/5 absolute inset-0 -top-4 left-1/2 transform -translate-x-1/2 whitespace-nowrap"
              style={{ animation: 'pulseSoft 6s ease-in-out infinite' }}
            >
              404
            </h1>
            <div className="relative flex justify-center items-center space-x-8">
              {['4', '0', '4'].map((num, index) => (
                <SmoothNumber key={index} num={num} index={index} mouseRef={mouseRef} />
              ))}
            </div>
          </div>
        </div>

        {/* Content with Mouse Interaction */}
        <InteractiveContent mounted={mounted} mouseRef={mouseRef} />
      </div>

      {/* Inline Styles for Smooth Animations */}
      <style jsx>{`
        @keyframes floatParticle {
          0%, 100% { 
            transform: translate3d(0, 0, 0) rotate(0deg) scale(1);
            opacity: 0.3;
          }
          33% { 
            transform: translate3d(20px, -15px, 0) rotate(120deg) scale(1.1);
            opacity: 0.6;
          }
          66% { 
            transform: translate3d(-10px, 10px, 0) rotate(240deg) scale(0.9);
            opacity: 0.4;
          }
        }

        @keyframes orbFloat {
          0%, 100% { 
            transform: translate3d(0, 0, 0) scale(1) rotate(0deg);
          }
          33% { 
            transform: translate3d(50px, -30px, 0) scale(1.1) rotate(120deg);
          }
          66% { 
            transform: translate3d(-30px, 25px, 0) scale(0.95) rotate(240deg);
          }
        }

        @keyframes smoothReveal {
          0% { 
            opacity: 0;
            transform: translate3d(0, 80px, 0) rotateX(45deg) scale(0.8);
            filter: blur(20px);
          }
          60% {
            opacity: 0.8;
            transform: translate3d(0, -10px, 0) rotateX(0deg) scale(1.05);
            filter: blur(5px);
          }
          100% { 
            opacity: 1;
            transform: translate3d(0, 0, 0) rotateX(0deg) scale(1);
            filter: blur(0px);
          }
        }

        @keyframes smoothFloat {
          0%, 100% { 
            transform: translate3d(0, 0, 0) rotate(0deg);
          }
          33% { 
            transform: translate3d(0, -12px, 0) rotate(3deg);
          }
          66% { 
            transform: translate3d(0, 5px, 0) rotate(-2deg);
          }
        }

        @keyframes sparklePop {
          0%, 100% { 
            opacity: 0;
            transform: scale(0) rotate(0deg);
          }
          50% { 
            opacity: 1;
            transform: scale(1.2) rotate(180deg);
          }
        }

        @keyframes textReveal {
          0% { 
            opacity: 0;
            transform: translate3d(0, 40px, 0);
          }
          100% { 
            opacity: 1;
            transform: translate3d(0, 0, 0);
          }
        }

        @keyframes buttonReveal {
          0% { 
            opacity: 0;
            transform: scale3d(0.8, 0.8, 0.8) rotate(-8deg);
          }
          100% { 
            opacity: 1;
            transform: scale3d(1, 1, 1) rotate(0deg);
          }
        }

        @keyframes bounceSmooth {
          0%, 100% { 
            transform: translate3d(0, 0, 0);
            opacity: 0.7;
          }
          50% { 
            transform: translate3d(0, -10px, 0);
            opacity: 1;
          }
        }

        @keyframes pulseGlow {
          0%, 100% { 
            opacity: 0.2;
            transform: scale(1) translateX(-50%);
          }
          50% { 
            opacity: 0.4;
            transform: scale(1.08) translateX(-50%);
          }
        }

        @keyframes pulseSoft {
          0%, 100% { opacity: 0.03; }
          50% { opacity: 0.08; }
        }

        @keyframes borderFlow {
          0% { 
            background-position: 0% 50%;
          }
          50% { 
            background-position: 100% 50%;
          }
          100% { 
            background-position: 0% 50%;
          }
        }

        .animate-spin-slow {
          animation: spin 12s linear infinite;
        }

        .animate-spin-medium {
          animation: spin 8s linear infinite reverse;
        }

        .animate-spin-fast {
          animation: spin 4s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

// Smooth Number Component with Mouse Interaction
const SmoothNumber = ({ num, index, mouseRef }) => {
  const numRef = useRef(null);
  
  useEffect(() => {
    const updateNumber = () => {
      if (numRef.current) {
        const moveX = mouseRef.current.x * 15 * (index - 1);
        const moveY = mouseRef.current.y * 10;
        
        numRef.current.style.transform = `translate3d(${moveX}px, ${moveY}px, 0) rotate(${moveX * 0.1}deg)`;
      }
      requestAnimationFrame(updateNumber);
    };
    
    updateNumber();
  }, [index, mouseRef]);

  return (
    <div className="relative">
      <span
        ref={numRef}
        className="text-8xl font-bold bg-gradient-to-br from-white via-white to-gray-300 bg-clip-text text-transparent drop-shadow-2xl block transition-transform duration-300 ease-out"
        style={{
          animation: `smoothReveal 1.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${index * 0.3}s both, smoothFloat 4s ease-in-out ${index * 0.5}s infinite`,
          textShadow: '0 0 50px rgba(255,255,255,0.8)',
          willChange: 'transform'
        }}
      >
        {num}
      </span>
      {/* Enhanced Sparkles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(8)].map((_, dotIndex) => (
          <div
            key={dotIndex}
            className="absolute w-1.5 h-1.5 bg-cyan-400 rounded-full opacity-0"
            style={{
              animation: `sparklePop 3s ease-in-out ${dotIndex * 0.4 + index * 0.2}s infinite`,
              left: `${Math.cos((dotIndex * 45) * Math.PI / 180) * 70}px`,
              top: `${Math.sin((dotIndex * 45) * Math.PI / 180) * 70}px`,
            }}
          />
        ))}
      </div>
    </div>
  );
};

// Mouse Trail Component
const MouseTrail = () => {
  const [trails, setTrails] = useState([]);
  const mousePos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
      
      setTrails(prev => [
        ...prev.slice(-8), // Keep only last 8 trails
        {
          id: Date.now(),
          x: e.clientX,
          y: e.clientY,
        }
      ]);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      {trails.map((trail, index) => (
        <div
          key={trail.id}
          className="absolute w-4 h-4 rounded-full bg-gradient-to-r from-cyan-400/20 to-blue-400/20 blur-sm transition-all duration-1000"
          style={{
            left: trail.x - 8,
            top: trail.y - 8,
            opacity: (index / trails.length) * 0.5,
            transform: `scale(${0.5 + (index / trails.length) * 0.5})`,
          }}
        />
      ))}
    </div>
  );
};

// Interactive Content Component
const InteractiveContent = ({ mounted, mouseRef }) => {
  const contentRef = useRef(null);
  
  useEffect(() => {
    const updateContent = () => {
      if (contentRef.current) {
        const moveX = mouseRef.current.x * 10;
        const moveY = mouseRef.current.y * 5;
        
        contentRef.current.style.transform = `translate3d(${moveX}px, ${moveY}px, 0)`;
      }
      requestAnimationFrame(updateContent);
    };
    
    updateContent();
  }, [mouseRef]);

  return (
    <div ref={contentRef} className="space-y-12 flex flex-col items-center justify-center transition-transform duration-100 ease-out">
      {/* Text Content */}
      <div 
        className="space-y-6 max-w-lg mx-auto"
        style={{
          animation: mounted ? 'textReveal 1.2s ease-out 1s forwards' : 'none',
          opacity: 0,
          transform: 'translate3d(0, 40px, 0)'
        }}
      >
        <h2 className="text-5xl font-light text-white tracking-wider bg-gradient-to-r from-gray-200 to-gray-400 bg-clip-text text-transparent">
          Page Not Found
        </h2>
        
        {/* Animated divider */}
        <div className="flex justify-center space-x-3">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="w-2 h-2 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"
              style={{
                animation: `bounceSmooth 2s ease-in-out ${i * 0.3}s infinite`
              }}
            />
          ))}
        </div>
        
        <p className="text-gray-300 text-xl leading-relaxed font-light tracking-wide">
          The page you're looking for seems to have drifted into the digital void. 
          Let us guide you back to safety.
        </p>
      </div>

      {/* Interactive Orbital System */}
      <InteractiveOrbitalSystem mouseRef={mouseRef} />

      {/* Main Action Button */}
      <div
        className="flex justify-center"
        style={{
          animation: mounted ? 'buttonReveal 1s ease-out 1.6s forwards' : 'none',
          opacity: 0,
          transform: 'scale3d(0.8, 0.8, 0.8)'
        }}
      >
        <InteractiveButton />
      </div>
    </div>
  );
};

// Interactive Orbital System
const InteractiveOrbitalSystem = ({ mouseRef }) => {
  const systemRef = useRef(null);
  
  useEffect(() => {
    const updateSystem = () => {
      if (systemRef.current) {
        const moveX = mouseRef.current.x * 5;
        const moveY = mouseRef.current.y * 5;
        
        systemRef.current.style.transform = `translate3d(${moveX}px, ${moveY}px, 0) rotate(${moveX * 2}deg)`;
      }
      requestAnimationFrame(updateSystem);
    };
    
    updateSystem();
  }, [mouseRef]);

  return (
    <div ref={systemRef} className="relative w-44 h-44 my-8 transition-transform duration-200 ease-out">
      {/* Outer orbit */}
      <div className="absolute inset-0 border border-cyan-500/40 rounded-full animate-spin-slow">
        {[...Array(16)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1.5 h-1.5 bg-cyan-400 rounded-full -top-0.75 -left-0.75"
            style={{
              transform: `rotate(${i * 22.5}deg) translateX(82px) rotate(-${i * 22.5}deg)`,
            }}
          />
        ))}
      </div>
      
      {/* Middle orbit */}
      <div className="absolute inset-6 border border-purple-500/40 rounded-full animate-spin-medium">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-purple-400 rounded-full -top-0.5 -left-0.5"
            style={{
              transform: `rotate(${i * 30}deg) translateX(58px) rotate(-${i * 30}deg)`,
            }}
          />
        ))}
      </div>
      
      {/* Inner orbit */}
      <div className="absolute inset-12 border border-fuchsia-500/40 rounded-full animate-spin-fast">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full flex items-center justify-center animate-pulse shadow-lg">
            <div className="w-6 h-6 bg-white rounded-full opacity-20" />
          </div>
        </div>
      </div>
    </div>
  );
};

// Interactive Button with Enhanced Effects
const InteractiveButton = () => {
  const [isHovered, setIsHovered] = useState(false);
  const buttonRef = useRef(null);

  return (
    <Link
      ref={buttonRef}
      to="/"
      className="group relative inline-flex items-center px-16 py-6 text-white font-semibold rounded-2xl shadow-2xl hover:shadow-3xl transform transition-all duration-500 hover:scale-105 border border-white/20 backdrop-blur-sm overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        background: 'linear-gradient(45deg, #7c3aed, #db2777, #06b6d4, #7c3aed)',
        backgroundSize: '300% 300%',
        animation: 'borderFlow 4s ease infinite'
      }}
    >
      {/* Animated Shine */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -skew-x-12 transform translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
      
      {/* Button Content */}
      <div className="relative z-10 flex items-center space-x-4">
        <svg
          className="w-7 h-7 transform transition-all duration-500 group-hover:scale-125 group-hover:rotate-12"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
          />
        </svg>
        <span className="text-xl tracking-wider font-medium">Return to Homepage</span>
      </div>
    </Link>
  );
};