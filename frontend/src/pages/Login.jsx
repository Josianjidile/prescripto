import React, { useContext, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import { FaEnvelope, FaLock, FaUser, FaEye, FaEyeSlash } from "react-icons/fa";

const Login = () => {
  const [state, setState] = useState("Login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
  const { backendUrl, setToken } = useContext(AppContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (state === "Sign Up") {
        const response = await axios.post(`${backendUrl}/api/user/register`, {
          name,
          email,
          password,
        });

        if (response.data.success) {
          toast.success("Sign-up successful! Please log in.");
          setState("Login");
        } else {
          toast.error(response.data.message);
        }
      } else {
        const response = await axios.post(`${backendUrl}/api/user/login`, {
          email,
          password,
        });

        if (response.data.success) {
          toast.success("Login successful!");
          localStorage.setItem("token", response.data.token);
          setToken(response.data.token);
          navigate('/');
        } else {
          toast.error(response.data.message);
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong!");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-50 to-purple-50 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md transform transition-all hover:scale-105">
        {/* Heading */}
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-4">
          {state === "Login" ? "Login" : "Sign Up"}
        </h1>
        {/* Subtitle */}
        <p className="text-sm text-center text-gray-600 mb-6">
          Please {state === "Login" ? "login" : "sign up"} to book an appointment.
        </p>

        {/* Toggle between Login and Sign Up */}
        <div className="flex justify-center mb-6">
          <button
            onClick={() => setState("Login")}
            className={`px-6 py-2 rounded-l-lg font-semibold transition-colors duration-300 ${
              state === "Login"
                ? "bg-primary text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Login
          </button>
          <button
            onClick={() => setState("Sign Up")}
            className={`px-6 py-2 rounded-r-lg font-semibold transition-colors duration-300 ${
              state === "Sign Up"
                ? "bg-primary text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name Input (only for Sign Up) */}
          {state === "Sign Up" && (
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                  placeholder="Enter your name"
                  required
                />
                <FaUser className="absolute left-3 top-3 text-gray-400" />
              </div>
            </div>
          )}

          {/* Email Input */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <div className="relative">
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                placeholder="Enter your email"
                required
              />
              <FaEnvelope className="absolute left-3 top-3 text-gray-400" />
            </div>
          </div>

          {/* Password Input */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                placeholder="Enter your password"
                required
              />
              <FaLock className="absolute left-3 top-3 text-gray-400" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full px-4 py-2 bg-primary text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-black"
          >
            {state === "Login" ? "Login" : "Sign Up"}
          </button>
        </form>

        {/* Switch between Login and Sign Up */}
        <p className="text-sm text-center text-gray-600 mt-4">
          {state === "Login" ? (
            <>
              Don't have an account?{" "}
              <button
                onClick={() => setState("Sign Up")}
                className="text-primary hover:underline"
              >
                Create Account
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button
                onClick={() => setState("Login")}
                className="text-primary hover:underline"
              >
                Login
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
};

export default Login;