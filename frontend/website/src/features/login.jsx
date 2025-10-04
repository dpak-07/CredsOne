import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import RoleSelector from "../components-ui/RoleSelector";
import { IconUser, IconMail, IconLock } from "../components-ui/icons";

const InputField = ({ icon: Icon, type, placeholder, value, onChange }) => (
  <div className="relative mb-4">
    <Icon
      size={20}
      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
    />
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition duration-150"
      required
    />
  </div>
);

const Login = () => {
  console.log('Login component rendered');
  
  const { login: authLogin } = useAuth();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedRole, setSelectedRole] = useState("Learner");

  // sliding bar logic for tabs
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Hidden test credentials (not shown in UI)
    const testCredentials = {
      '1@gmail.com': { password: '123123123', role: 'Employer', name: 'Test Employer', did: 'did:example:employer1' },
      'learner@test.com': { password: 'test123', role: 'Learner', name: 'Test Learner', did: 'did:example:learner1' },
      'employer@test.com': { password: 'test123', role: 'Employer', name: 'Test Employer 2', did: 'did:example:employer2' },
      'institution@test.com': { password: 'test123', role: 'Institution', name: 'Test Institution', did: 'did:example:institution1' }
    };

    try {
      let userData;
      
      if (isLogin) {
        // Check test credentials first
        const testAccount = testCredentials[email];
        if (testAccount && testAccount.password === password) {
          // Valid test credential
          userData = {
            user: {
              did: testAccount.did,
              name: testAccount.name,
              role: testAccount.role,
              email: email
            },
            token: 'mock-jwt-token-' + Date.now()
          };
        } else {
          // Mock login for any other email/password
          userData = {
            user: {
              did: 'did:example:user' + Date.now(),
              name: name || "Test User",
              role: selectedRole,
              email: email
            },
            token: 'mock-jwt-token-' + Date.now()
          };
        }
      } else {
        // Register flow
        userData = {
          user: {
            did: 'did:example:user' + Date.now(),
            name: name,
            role: selectedRole,
            email: email
          },
          token: 'mock-jwt-token-' + Date.now()
        };
      }

      // Call the auth context login
      await authLogin(userData);
      
      // Navigate to appropriate dashboard
      navigate(`/dashboard/${userData.user.role.toLowerCase()}`, { replace: true });
      
      // Clear form
      setName("");
      setEmail("");
      setPassword("");
    } catch (error) {
      console.error('Login error:', error);
      alert('Login failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-md">
        {/* Toggle Tabs with sliding bar */}
        <div className="relative mb-8 bg-gray-200 rounded-xl p-1">
          {/* sliding bar */}
          <div
            className="absolute top-1 left-0 h-[calc(100%-0.5rem)] bg-purple-600 rounded-xl transition-all duration-300 ease-in-out"
            style={indicatorStyle}
          />
          <div ref={tabsRef} className="relative flex z-10">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-3 text-lg font-bold rounded-xl transition-all duration-300 ${
                isLogin ? "text-white" : "text-gray-600"
              }`}
            >
              Log In
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-3 text-lg font-bold rounded-xl transition-all duration-300 ${
                !isLogin ? "text-white" : "text-gray-600"
              }`}
            >
              Register
            </button>
          </div>
        </div>

        <h2 className="text-3xl font-extrabold text-gray-900 mb-6 text-center">
          {isLogin ? "Welcome Back" : "Create Your Account"}
        </h2>

        <form onSubmit={handleSubmit}>
          {/* Role selector shown in BOTH flows now */}
          <RoleSelector
            selectedRole={selectedRole}
            setSelectedRole={setSelectedRole}
          />

          {/* Name field only when registering */}
          {!isLogin && (
            <InputField
              icon={IconUser}
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          )}

          <InputField
            icon={IconMail}
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <InputField
            icon={IconLock}
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            type="submit"
            className="w-full py-3 mt-6 bg-purple-600 text-white font-bold text-lg rounded-xl shadow-xl hover:bg-purple-700 transition transform hover:scale-[1.01] focus:outline-none focus:ring-4 focus:ring-purple-300"
          >
            {isLogin ? "Log In" : "Sign Up"}
          </button>

          {isLogin && (
            <p className="mt-4 text-center text-sm text-gray-600">
              <a
                href="#"
                className="font-medium text-purple-600 hover:text-purple-500"
              >
                Forgot password?
              </a>
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default Login;
