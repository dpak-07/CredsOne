import React, { useState } from "react";
import RoleSelector from "./RoleSelector";
import { IconUser, IconMail, IconLock } from "./icons";

const InputField = ({ icon: Icon, type, placeholder, value, onChange }) => (
  <div className="relative mb-4">
    <Icon size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
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

const Login = ({ onAuthSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedRole, setSelectedRole] = useState("Learner");

  const handleSubmit = (e) => {
    e.preventDefault();
    const userName = isLogin ? (name || "Test Learner") : name;
    const role = isLogin ? "Learner" : selectedRole;
    onAuthSuccess(userName, role);
    setName("");
    setEmail("");
    setPassword("");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-md">
        {/* Toggle Tabs */}
        <div className="flex mb-8 bg-gray-200 rounded-xl p-1">
          <button
            onClick={() => setIsLogin(true)}
            className={`flex-1 py-3 text-lg font-bold rounded-xl transition-all duration-300 
              ${isLogin ? 'bg-purple-600 text-white shadow-lg' : 'text-gray-600 hover:bg-gray-300'}`}
          >
            Log In
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`flex-1 py-3 text-lg font-bold rounded-xl transition-all duration-300 
              ${!isLogin ? 'bg-purple-600 text-white shadow-lg' : 'text-gray-600 hover:bg-gray-300'}`}
          >
            Register
          </button>
        </div>

        <h2 className="text-3xl font-extrabold text-gray-900 mb-6 text-center">
          {isLogin ? "Welcome Back" : "Create Your Account"}
        </h2>

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <>
              <InputField
                icon={IconUser}
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

              {/* Role Selector with updated styling */}
              <RoleSelector
                selectedRole={selectedRole}
                setSelectedRole={setSelectedRole}
              />
            </>
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
              <a href="#" className="font-medium text-purple-600 hover:text-purple-500">
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
