import React, { useEffect, useState, useRef } from "react";

/**
 * CredsOne - Blockchain Credential System - Complete Landing Page
 */

const SECTIONS = {
  HOME: 'home',
  FEATURES: 'features',
  HOW_IT_WORKS: 'how-it-works',
  USAGE: 'usage',
  ABOUT: 'about',
  CONTACT: 'contact'
};

function LoginModal({ isOpen, onClose, onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignup, setIsSignup] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isSignup && !name.trim()) {
      alert("Please enter your name");
      return;
    }
    if (!email.trim() || !password.trim()) {
      alert("Please fill in all fields");
      return;
    }
    onLogin({ email, name: name || email.split('@')[0], isSignup });
    setEmail("");
    setPassword("");
    setName("");
    setPhone("");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center modal-backdrop z-50" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 relative text-slate-800" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute right-4 top-4 text-slate-500 hover:text-slate-700 text-2xl">×</button>
        
        <div className="text-center mb-6">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-orange-500 to-blue-600 flex items-center justify-center">
            <span className="text-2xl text-white font-bold">C1</span>
          </div>
          <h2 className="text-2xl font-bold">{isSignup ? "Create Account" : "Welcome Back"}</h2>
          <p className="text-sm text-slate-500 mt-2">{isSignup ? "Join the future of skill credentials" : "Sign in to your account"}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignup && (
            <>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-400"
                  placeholder="Enter your name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-400"
                  placeholder="+91 XXXXX XXXXX"
                />
              </div>
            </>
          )}
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-400"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-400"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-lg bg-gradient-to-r from-orange-500 to-blue-600 text-white font-semibold shadow-lg hover:scale-105 transform transition"
          >
            {isSignup ? "Sign Up" : "Sign In"}
          </button>
        </form>

        <div className="mt-4 text-center">
          <button
            onClick={() => setIsSignup(!isSignup)}
            className="text-sm text-orange-600 hover:underline"
          >
            {isSignup ? "Already have an account? Sign in" : "Don't have an account? Sign up"}
          </button>
        </div>

        <div className="mt-6 pt-6 border-t">
          <button className="w-full py-3 rounded-lg border-2 border-slate-200 text-slate-700 font-medium hover:bg-slate-50 flex items-center justify-center gap-2">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
            </svg>
            Connect Wallet
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Landing() {
  const [activeSection, setActiveSection] = useState(SECTIONS.HOME);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [notification, setNotification] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const revealWrapperRef = useRef(null);

  useEffect(() => {
    const css = `
      .landing-blob { position: absolute; filter: blur(60px); opacity: 0.6; mix-blend-mode: screen; z-index: 0; border-radius: 9999px; }
      .float-anim { animation: floaty 12s ease-in-out infinite; transform-origin: center; }
      @keyframes floaty { 0% { transform: translateY(0) translateX(0) scale(1); } 50% { transform: translateY(-20px) translateX(10px) scale(1.08); } 100% { transform: translateY(0) translateX(0) scale(1); } }
      .tilt { transition: transform .35s cubic-bezier(.2,.9,.3,1), box-shadow .35s; transform-origin: center; }
      .tilt:hover { transform: perspective(1000px) rotateX(4deg) rotateY(-4deg) translateY(-8px); box-shadow: 0 35px 70px rgba(0,0,0,.15); }
      .reveal { opacity: 0; transform: translateY(30px) scale(.98); transition: all 800ms cubic-bezier(.2,.9,.3,1); }
      .reveal.show { opacity: 1; transform: translateY(0) scale(1); }
      .modal-backdrop { backdrop-filter: blur(8px); background: rgba(0,0,0,0.5); }
      .notification { position: fixed; top: 20px; right: 20px; z-index: 100; animation: slideIn 0.3s ease-out; }
      @keyframes slideIn { from { transform: translateX(400px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
      .gradient-text { background: linear-gradient(135deg, #FF6B35 0%, #F7931E 25%, #2E86DE 75%, #5F27CD 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
      .card-hover { transition: all 0.3s ease; }
      .card-hover:hover { transform: translateY(-8px); box-shadow: 0 20px 40px rgba(0,0,0,0.1); }
    `;
    const style = document.createElement("style");
    style.id = "landing-styles";
    style.appendChild(document.createTextNode(css));
    document.head.appendChild(style);
    return () => {
      const s = document.getElementById("landing-styles");
      if (s) s.remove();
    };
  }, []);

  useEffect(() => {
    const wrapper = revealWrapperRef.current;
    if (!wrapper) return;
    const items = wrapper.querySelectorAll(".reveal");
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("show");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    items.forEach((it) => io.observe(it));
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  function showNotification(msg) {
    setNotification(msg);
  }

  function handleLogin(data) {
    setUser({ name: data.name, email: data.email });
    setLoginModalOpen(false);
    showNotification(`Welcome ${data.isSignup ? 'to CredsOne' : 'back,'} ${data.name}!`);
  }

  function handleLogout() {
    setUser(null);
    showNotification("Logged out successfully");
  }

  function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveSection(sectionId);
      setMobileMenuOpen(false);
    }
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 text-slate-900 overflow-x-hidden">
      {notification && (
        <div className="notification bg-white text-slate-800 px-6 py-3 rounded-lg shadow-2xl border-l-4 border-green-500">
          <div className="flex items-center gap-2">
            <span className="text-green-600 text-xl">✓</span>
            <span className="font-medium">{notification}</span>
          </div>
        </div>
      )}

      <div aria-hidden className="pointer-events-none fixed inset-0">
        <div className="landing-blob float-anim" style={{ left: "-10%", top: "-5%", width: 500, height: 500, background: "radial-gradient(circle, rgba(255,107,53,0.3), transparent 60%)" }} />
        <div className="landing-blob float-anim" style={{ right: "-8%", top: "10%", width: 400, height: 400, background: "radial-gradient(circle, rgba(46,134,222,0.3), transparent 60%)", animationDelay: "-3s" }} />
        <div className="landing-blob float-anim" style={{ left: "15%", bottom: "-10%", width: 550, height: 550, background: "radial-gradient(circle, rgba(95,39,205,0.25), transparent 60%)", animationDelay: "-6s" }} />
      </div>

      <div className="relative z-10" ref={revealWrapperRef}>
        <header className="sticky top-0 bg-white/80 backdrop-blur-lg border-b border-slate-200 z-40 shadow-sm">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 cursor-pointer" onClick={() => scrollToSection(SECTIONS.HOME)}>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-blue-600 flex items-center justify-center shadow-lg">
                  <span className="text-xl font-bold text-white">C1</span>
                </div>
                <div>
                  <div className="font-bold text-lg text-slate-900">CredsOne</div>
                  <div className="text-xs text-slate-600">Blockchain-Powered Verification</div>
                </div>
              </div>

              <nav className="hidden md:flex items-center gap-1">
                {[
                  { id: SECTIONS.HOME, label: 'Home' },
                  { id: SECTIONS.FEATURES, label: 'Features' },
                  { id: SECTIONS.HOW_IT_WORKS, label: 'How It Works' },
                  { id: SECTIONS.USAGE, label: 'Usage' },
                  { id: SECTIONS.ABOUT, label: 'About' },
                  { id: SECTIONS.CONTACT, label: 'Contact' }
                ].map(item => (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      activeSection === item.id 
                        ? 'bg-orange-100 text-orange-700' 
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </nav>

              <div className="hidden md:flex items-center gap-3">
                {user ? (
                  <>
                    <span className="text-sm text-slate-700">Hi, {user.name}</span>
                    <button onClick={handleLogout} className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 text-sm hover:bg-slate-50">
                      Logout
                    </button>
                  </>
                ) : (
                  <button 
                    onClick={() => setLoginModalOpen(true)} 
                    className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-orange-500 to-blue-600 text-white text-sm font-semibold shadow-lg hover:scale-105 transform transition"
                  >
                    Login / Sign Up
                  </button>
                )}
              </div>

              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-lg hover:bg-slate-100"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>

            {mobileMenuOpen && (
              <div className="md:hidden mt-4 pb-4 space-y-2">
                {[
                  { id: SECTIONS.HOME, label: 'Home' },
                  { id: SECTIONS.FEATURES, label: 'Features' },
                  { id: SECTIONS.HOW_IT_WORKS, label: 'How It Works' },
                  { id: SECTIONS.USAGE, label: 'Usage' },
                  { id: SECTIONS.ABOUT, label: 'About' },
                  { id: SECTIONS.CONTACT, label: 'Contact' }
                ].map(item => (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className="block w-full text-left px-4 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100"
                  >
                    {item.label}
                  </button>
                ))}
                {!user && (
                  <button 
                    onClick={() => { setLoginModalOpen(true); setMobileMenuOpen(false); }} 
                    className="w-full px-4 py-2.5 rounded-lg bg-gradient-to-r from-orange-500 to-blue-600 text-white text-sm font-semibold"
                  >
                    Login / Sign Up
                  </button>
                )}
              </div>
            )}
          </div>
        </header>

        <section id={SECTIONS.HOME} className="relative py-20 md:py-32">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="reveal space-y-8">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-100 text-orange-700 text-sm font-medium">
                  <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></span>
                  Powered by Blockchain Technology
                </div>

                <h1 className="text-5xl md:text-6xl font-bold leading-tight">
                  <span className="gradient-text">Secure. Verified.</span>
                  <br />
                  <span className="text-slate-900">Skill Credentials</span>
                </h1>

                <p className="text-xl text-slate-600 max-w-xl leading-relaxed">
                  India's first blockchain-based vocational credentialing system. Issue tamper-proof certificates, verify instantly, and empower learners with portable digital credentials.
                </p>

                <div className="flex flex-wrap gap-4">
                  <button 
                    onClick={() => user ? showNotification('Redirecting to dashboard...') : setLoginModalOpen(true)}
                    className="px-8 py-4 rounded-xl bg-gradient-to-r from-orange-500 to-blue-600 text-white font-semibold text-lg shadow-xl hover:scale-105 transform transition"
                  >
                    Get Started Free
                  </button>
                  <button 
                    onClick={() => scrollToSection(SECTIONS.HOW_IT_WORKS)}
                    className="px-8 py-4 rounded-xl border-2 border-slate-300 text-slate-700 font-semibold text-lg hover:bg-slate-50 transition"
                  >
                    Watch Demo
                  </button>
                </div>

                <div className="pt-8">
                  <p className="text-sm text-slate-500 mb-4">Integrated with:</p>
                  <div className="flex flex-wrap gap-4">
                    {['Skill India Digital', 'DigiLocker', 'NCVET', 'Polygon'].map(name => (
                      <div key={name} className="px-4 py-2 rounded-lg bg-white border border-slate-200 text-sm font-medium text-slate-700 shadow-sm">
                        {name}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="reveal">
                <div className="relative">
                  <div className="tilt bg-white rounded-3xl shadow-2xl p-8 border border-slate-200">
                    <div className="space-y-6">
                      <div className="bg-gradient-to-br from-orange-50 to-blue-50 rounded-2xl p-6 border border-orange-100">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <div className="text-sm text-slate-600 mb-1">Digital Credential</div>
                            <div className="text-lg font-bold text-slate-900">Web Development Certification</div>
                          </div>
                          <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-blue-600 rounded-xl flex items-center justify-center">
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                        </div>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-slate-600">Issued by:</span>
                            <span className="font-medium text-slate-900">CredsOne Institute</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-600">Credential ID:</span>
                            <span className="font-mono text-xs text-slate-700">NC-2025-001234</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-slate-600">Status:</span>
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold">
                              <span className="w-1.5 h-1.5 bg-green-600 rounded-full"></span>
                              Verified on Blockchain
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        <div className="text-center p-4 rounded-xl bg-slate-50">
                          <div className="text-2xl font-bold text-orange-600">5M+</div>
                          <div className="text-xs text-slate-600 mt-1">Credentials Issued</div>
                        </div>
                        <div className="text-center p-4 rounded-xl bg-slate-50">
                          <div className="text-2xl font-bold text-blue-600">100%</div>
                          <div className="text-xs text-slate-600 mt-1">Tamper-Proof</div>
                        </div>
                        <div className="text-center p-4 rounded-xl bg-slate-50">
                          <div className="text-2xl font-bold text-purple-600">Instant</div>
                          <div className="text-xs text-slate-600 mt-1">Verification</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl rotate-12 opacity-20 blur-xl"></div>
                  <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full opacity-20 blur-xl"></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id={SECTIONS.FEATURES} className="py-20 bg-slate-50">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16 reveal">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Why Choose <span className="gradient-text">CredsOne</span>?
              </h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                Transform vocational education with blockchain-powered credentials that are secure, portable, and instantly verifiable.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: "🔒",
                  title: "Tamper-Proof Security",
                  description: "Credentials stored on immutable blockchain ledger. Impossible to forge or manipulate.",
                  color: "orange"
                },
                {
                  icon: "⚡",
                  title: "Instant Verification",
                  description: "Employers verify credentials in seconds via QR code or credential ID. No manual checks needed.",
                  color: "blue"
                },
                {
                  icon: "🌐",
                  title: "Global Portability",
                  description: "Learners own their credentials forever. Access and share anywhere, anytime, from any device.",
                  color: "purple"
                },
                {
                  icon: "🔗",
                  title: "DigiLocker Integration",
                  description: "Seamlessly sync credentials with India's official DigiLocker platform for government recognition.",
                  color: "green"
                },
                {
                  icon: "📊",
                  title: "Real-Time Analytics",
                  description: "Institutions get insights on issuance, verification trends, and skill gap analysis.",
                  color: "pink"
                },
                {
                  icon: "🎯",
                  title: "NCVET Compliant",
                  description: "Fully aligned with NCVET standards and NSQF framework for national and international acceptance.",
                  color: "indigo"
                }
              ].map((feature, idx) => (
                <div key={idx} className="reveal card-hover bg-white rounded-2xl p-8 shadow-lg border border-slate-200">
                  <div className="text-5xl mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-bold mb-3 text-slate-900">{feature.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{feature.description}</p>
                  <button 
                    onClick={() => showNotification(`Learn more about ${feature.title}`)}
                    className="mt-6 text-orange-600 font-semibold text-sm hover:underline flex items-center gap-1"
                  >
                    Learn more
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id={SECTIONS.HOW_IT_WORKS} className="py-20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16 reveal">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                <span className="gradient-text">How It Works</span>
              </h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                Simple, transparent, and efficient - from issuance to verification
              </p>
            </div>

            <div className="grid md:grid-cols-4 gap-8">
              {[
                {
                  step: "01",
                  title: "Training Completion",
                  description: "Learner completes NCVET-recognized vocational training program",
                  icon: "📚"
                },
                {
                  step: "02",
                  title: "Credential Issuance",
                  description: "Institution issues digital certificate anchored on blockchain",
                  icon: "📜"
                },
                {
                  step: "03",
                  title: "Secure Storage",
                  description: "Credential stored in learner's digital wallet with QR code",
                  icon: "💾"
                },
                {
                  step: "04",
                  title: "Instant Verification",
                  description: "Employers scan QR or enter ID for real-time blockchain verification",
                  icon: "✅"
                }
              ].map((item, idx) => (
                <div key={idx} className="reveal text-center">
                  <div className="relative mb-6">
                    <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-orange-500 to-blue-600 flex items-center justify-center text-4xl shadow-xl">
                      {item.icon}
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full border-4 border-orange-500 flex items-center justify-center text-xs font-bold text-orange-600">
                      {item.step}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-slate-900">{item.title}</h3>
                  <p className="text-slate-600 text-sm">{item.description}</p>
                </div>
              ))}
            </div>

            <div className="mt-16 text-center reveal">
              <button 
                onClick={() => scrollToSection(SECTIONS.USAGE)}
                className="px-8 py-4 rounded-xl bg-gradient-to-r from-orange-500 to-blue-600 text-white font-semibold text-lg shadow-xl hover:scale-105 transform transition"
              >
                Explore Use Cases
              </button>
            </div>
          </div>
        </section>

        <section id={SECTIONS.USAGE} className="py-20 bg-slate-50">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16 reveal">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Who Can <span className="gradient-text">Benefit</span>?
              </h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                Designed for all stakeholders in the vocational education ecosystem
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  role: "🎓 Learners",
                  title: "Own Your Skills",
                  features: [
                    "Lifetime access to credentials",
                    "Share via QR code or link",
                    "Export to DigiLocker",
                    "Track skill growth timeline",
                    "No risk of certificate loss"
                  ],
                  cta: "Create Learner Account"
                },
                {
                  role: "🏫 Institutions",
                  title: "Issue with Confidence",
                  features: [
                    "Bulk credential issuance",
                    "Revoke or reissue anytime",
                    "Real-time analytics dashboard",
                    "NCVET template integration",
                    "Reduce forgery by 100%"
                  ],
                  cta: "Register Institution"
                },
                {
                  role: "💼 Employers",
                  title: "Verify Instantly",
                  features: [
                    "Scan QR for instant check",
                    "View complete credential data",
                    "Save verified candidates",
                    "AI-powered skill matching",
                    "Zero manual verification"
                  ],
                  cta: "Start Verifying"
                }
              ].map((usage, idx) => (
                <div key={idx} className="reveal card-hover bg-white rounded-2xl p-8 shadow-lg border border-slate-200">
                  <div className="text-4xl mb-4">{usage.role}</div>
                  <h3 className="text-2xl font-bold mb-4 text-slate-900">{usage.title}</h3>
                  <ul className="space-y-3 mb-8">
                    {usage.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2 text-slate-600">
                        <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <button 
                    onClick={() => user ? showNotification(`Redirecting to ${usage.role} dashboard...`) : setLoginModalOpen(true)}
                    className="w-full py-3 rounded-lg bg-gradient-to-r from-orange-500 to-blue-600 text-white font-semibold hover:scale-105 transform transition"
                  >
                    {usage.cta}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id={SECTIONS.ABOUT} className="py-20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div className="reveal">
                <h2 className="text-4xl md:text-5xl font-bold mb-6">
                  About <span className="gradient-text">CredsOne</span>
                </h2>
                <div className="space-y-4 text-lg text-slate-600 leading-relaxed">
                  <p>
                    CredsOne, powered by the National Council for Vocational Education and Training (NCVET), is revolutionizing India's vocational education landscape with blockchain technology.
                  </p>
                  <p>
                    Our mission is to eliminate certificate fraud, enable instant verification, and give learners true ownership of their credentials. With millions of vocational learners graduating annually, we're building the infrastructure for trust.
                  </p>
                  <p>
                    Integrated with Skill India Digital, DigiLocker, and aligned with the National Skills Qualifications Framework (NSQF), our platform ensures seamless interoperability and national recognition.
                  </p>
                </div>

                <div className="mt-8 grid grid-cols-2 gap-6">
                  <div className="p-6 rounded-xl bg-orange-50 border border-orange-100">
                    <div className="text-3xl font-bold text-orange-600 mb-2">5M+</div>
                    <div className="text-sm text-slate-600">Credentials Secured</div>
                  </div>
                  <div className="p-6 rounded-xl bg-blue-50 border border-blue-100">
                    <div className="text-3xl font-bold text-blue-600 mb-2">500+</div>
                    <div className="text-sm text-slate-600">Institutions Onboarded</div>
                  </div>
                  <div className="p-6 rounded-xl bg-purple-50 border border-purple-100">
                    <div className="text-3xl font-bold text-purple-600 mb-2">100%</div>
                    <div className="text-sm text-slate-600">Fraud Prevention</div>
                  </div>
                  <div className="p-6 rounded-xl bg-green-50 border border-green-100">
                    <div className="text-3xl font-bold text-green-600 mb-2">24/7</div>
                    <div className="text-sm text-slate-600">Global Verification</div>
                  </div>
                </div>
              </div>

              <div className="reveal">
                <div className="bg-gradient-to-br from-orange-500 to-blue-600 rounded-3xl p-8 text-white shadow-2xl">
                  <h3 className="text-2xl font-bold mb-6">Our Vision</h3>
                  <div className="space-y-4">
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                        <span className="text-2xl">🎯</span>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1">Transparency</h4>
                        <p className="text-white/90 text-sm">Every credential verifiable by anyone, anywhere</p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                        <span className="text-2xl">🚀</span>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1">Innovation</h4>
                        <p className="text-white/90 text-sm">Leveraging blockchain for next-gen education</p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                        <span className="text-2xl">🤝</span>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1">Inclusion</h4>
                        <p className="text-white/90 text-sm">Accessible to every learner across India</p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                        <span className="text-2xl">🌍</span>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1">Global Recognition</h4>
                        <p className="text-white/90 text-sm">Skills validated worldwide with blockchain proof</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id={SECTIONS.CONTACT} className="py-20 bg-slate-50">
          <div className="max-w-4xl mx-auto px-6">
            <div className="text-center mb-12 reveal">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Get in <span className="gradient-text">Touch</span>
              </h2>
              <p className="text-xl text-slate-600">
                Have questions? We're here to help you get started
              </p>
            </div>

            <div className="reveal bg-white rounded-3xl shadow-2xl p-8 md:p-12 border border-slate-200">
              <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); showNotification('Message sent successfully!'); }}>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Full Name</label>
                    <input 
                      type="text" 
                      className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-400"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
                    <input 
                      type="email" 
                      className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-400"
                      placeholder="you@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Subject</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-400"
                    placeholder="How can we help?"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Message</label>
                  <textarea 
                    rows="6" 
                    className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-400"
                    placeholder="Tell us more about your needs..."
                  ></textarea>
                </div>

                <button 
                  type="submit"
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-orange-500 to-blue-600 text-white font-semibold text-lg shadow-xl hover:scale-105 transform transition"
                >
                  Send Message
                </button>
              </form>

              <div className="mt-12 pt-8 border-t grid md:grid-cols-3 gap-8 text-center">
                <div>
                  <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-orange-100 flex items-center justify-center">
                    <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="font-semibold text-slate-900">Email</div>
                  <div className="text-sm text-slate-600 mt-1">support@credsone.in</div>
                </div>
                <div>
                  <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-blue-100 flex items-center justify-center">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div className="font-semibold text-slate-900">Phone</div>
                  <div className="text-sm text-slate-600 mt-1">1800-123-4567</div>
                </div>
                <div>
                  <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-purple-100 flex items-center justify-center">
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div className="font-semibold text-slate-900">Office</div>
                  <div className="text-sm text-slate-600 mt-1">New Delhi, India</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <footer className="bg-slate-900 text-white py-12">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid md:grid-cols-4 gap-8 mb-8">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-blue-600 flex items-center justify-center">
                    <span className="text-lg font-bold">C1</span>
                  </div>
                  <div className="font-bold text-lg">CredsOne</div>
                </div>
                <p className="text-slate-400 text-sm">
                  Securing India's vocational education with blockchain technology.
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-4">Platform</h4>
                <ul className="space-y-2 text-sm text-slate-400">
                  <li><button onClick={() => scrollToSection(SECTIONS.FEATURES)} className="hover:text-white">Features</button></li>
                  <li><button onClick={() => scrollToSection(SECTIONS.HOW_IT_WORKS)} className="hover:text-white">How It Works</button></li>
                  <li><button onClick={() => scrollToSection(SECTIONS.USAGE)} className="hover:text-white">Usage</button></li>
                  <li><button onClick={() => showNotification('Opening pricing...')} className="hover:text-white">Pricing</button></li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-4">Resources</h4>
                <ul className="space-y-2 text-sm text-slate-400">
                  <li><button onClick={() => showNotification('Opening documentation...')} className="hover:text-white">Documentation</button></li>
                  <li><button onClick={() => showNotification('Opening API docs...')} className="hover:text-white">API Reference</button></li>
                  <li><button onClick={() => showNotification('Opening guides...')} className="hover:text-white">Integration Guides</button></li>
                  <li><button onClick={() => showNotification('Opening support...')} className="hover:text-white">Support Center</button></li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-4">Legal</h4>
                <ul className="space-y-2 text-sm text-slate-400">
                  <li><button onClick={() => showNotification('Opening privacy policy...')} className="hover:text-white">Privacy Policy</button></li>
                  <li><button onClick={() => showNotification('Opening terms...')} className="hover:text-white">Terms of Service</button></li>
                  <li><button onClick={() => showNotification('Opening compliance...')} className="hover:text-white">Compliance</button></li>
                  <li><button onClick={() => showNotification('Opening security...')} className="hover:text-white">Security</button></li>
                </ul>
              </div>
            </div>

            <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-sm text-slate-400">
                © 2025 CredsOne. All rights reserved. Powered by Blockchain Technology.
              </p>
              <div className="flex gap-4">
                {['Twitter', 'LinkedIn', 'GitHub'].map(social => (
                  <button
                    key={social}
                    onClick={() => showNotification(`Opening ${social}...`)}
                    className="w-10 h-10 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center transition"
                  >
                    <span className="text-xs">{social[0]}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </footer>
      </div>

      <LoginModal 
        isOpen={loginModalOpen} 
        onClose={() => setLoginModalOpen(false)} 
        onLogin={handleLogin}
      />
    </div>
  );
}