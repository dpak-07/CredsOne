// src/pages/Login.jsx
import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { roleBase } from "../utils/routes";

/* -----------------------
   Inline small components
   (RoleSelector, InputField, Icons)
   ----------------------- */

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
      <div ref={containerRef} className="relative flex space-x-4 z-10">
        {["Learner", "Employer", "Institution"].map((role) => (
          <button
            key={role}
            onClick={() => setSelectedRole(role)}
            className={`flex-1 p-3 text-center rounded-xl font-semibold transition-all duration-200 relative z-10
              ${selectedRole === role ? "text-white" : "text-gray-700"}`}
          >
            {role === "Learner" && <IconUser size={20} className="inline mr-2" />}
            {role === "Employer" && <IconBriefcase size={20} className="inline mr-2" />}
            {role === "Institution" && <IconSchool size={20} className="inline mr-2" />}
            {role}
          </button>
        ))}
      </div>
    </div>
  );
};

const InputField = ({ icon: Icon, type, placeholder, value, onChange, name }) => (
  <div className="relative mb-4">
    <Icon
      size={20}
      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
    />
    <input
      name={name}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition duration-150"
      required
    />
  </div>
);

/* ---------- Icons ---------- */
const IconUser = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const IconMail = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
);

const IconLock = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

const IconBriefcase = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="14" x="2" y="7" rx="2" ry="2" />
    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
  </svg>
);

const IconSchool = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 22V7c0-2.2 1.8-4 4-4h8c2.2 0 4 1.8 4 4v15" />
    <path d="M12 4v18" />
    <path d="M6 10H4" />
    <path d="M20 10h-2" />
  </svg>
);

/* -----------------------
   Main Login component
   ----------------------- */

export default function Login() {
  const location = useLocation();
  const navigate = useNavigate();
  const auth = useAuth();

  // If route is /register, default to register tab
  const initialRegister = location.pathname && location.pathname.toLowerCase().includes("register");

  const [isLogin, setIsLogin] = useState(!initialRegister);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedRole, setSelectedRole] = useState("Learner");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // tab indicator for the top login/register switch
  const tabsRef = useRef(null);
  const [indicatorStyle, setIndicatorStyle] = useState({});

  useEffect(() => {
    if (!tabsRef.current) return;
    const buttons = tabsRef.current.querySelectorAll("button");
    const index = isLogin ? 0 : 1;
    if (buttons[index]) {
      const btn = buttons[index];
      setIndicatorStyle({
        width: btn.offsetWidth + "px",
        left: btn.offsetLeft + "px",
      });
    }
  }, [isLogin]);

  const resetForm = () => {
    setName("");
    setEmail("");
    setPassword("");
    setError("");
  };

  const handleAuthSuccess = (userObj) => {
    // Redirect to role base (routes.js)
    const base = roleBase(userObj?.role || auth.user?.role || "learner");
    // Small guard: if your app uses /dashboard/role instead, change accordingly
    navigate(base, { replace: true });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isLogin) {
        // login flow: backend expects username or email and password
        const usernameOrEmail = email.trim();
        const res = await auth.login({ usernameOrEmail, password });
        if (res.success) {
          handleAuthSuccess(res.user);
        } else {
          setError(res.message || "Login failed");
        }
      } else {
        // register flow: adapt payload to your backend model
        const username = email.includes("@") ? email.split("@")[0] : email;
        const payload = {
          username,
          email: email.trim(),
          password,
          fullName: name.trim() || username,
          role: selectedRole.toLowerCase(),
        };

        const res = await auth.register(payload);
        if (res.success) {
          handleAuthSuccess(res.user);
        } else {
          setError(res.message || "Registration failed");
        }
      }
    } catch (err) {
      setError(err?.message || "Something went wrong");
    } finally {
      setLoading(false);
      // optionally reset only on success
      // resetForm();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-md">
        {/* Tabs */}
        <div className="relative mb-8 bg-gray-200 rounded-xl p-1">
          <div
            className="absolute top-1 left-0 h-[calc(100%-0.5rem)] bg-purple-600 rounded-xl transition-all duration-300 ease-in-out"
            style={indicatorStyle}
          />
          <div ref={tabsRef} className="relative flex z-10">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-3 text-lg font-bold rounded-xl transition-all duration-300 ${isLogin ? "text-white" : "text-gray-600"}`}
            >
              Log In
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-3 text-lg font-bold rounded-xl transition-all duration-300 ${!isLogin ? "text-white" : "text-gray-600"}`}
            >
              Register
            </button>
          </div>
        </div>

        <h2 className="text-3xl font-extrabold text-gray-900 mb-6 text-center">
          {isLogin ? "Welcome Back" : "Create Your Account"}
        </h2>

        <form onSubmit={handleSubmit}>
          <RoleSelector selectedRole={selectedRole} setSelectedRole={setSelectedRole} />

          {!isLogin && (
            <InputField
              icon={IconUser}
              type="text"
              name="fullname"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          )}

          <InputField
            icon={IconMail}
            type="email"
            name="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <InputField
            icon={IconLock}
            type="password"
            name="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && <div className="mb-3 text-sm text-red-600">{error}</div>}

          <button
            type="submit"
            disabled={loading || auth.isAuthenticating}
            className="w-full py-3 mt-6 bg-purple-600 text-white font-bold text-lg rounded-xl shadow-xl hover:bg-purple-700 transition transform hover:scale-[1.01] focus:outline-none focus:ring-4 focus:ring-purple-300 disabled:opacity-60"
          >
            {loading || auth.isAuthenticating ? (isLogin ? "Logging in..." : "Creating...") : isLogin ? "Log In" : "Sign Up"}
          </button>

          {isLogin && (
            <p className="mt-4 text-center text-sm text-gray-600">
              <a href="#" className="font-medium text-purple-600 hover:text-purple-500">Forgot password?</a>
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
