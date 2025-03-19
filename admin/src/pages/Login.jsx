import React, { useContext, useState } from "react";
import { AdminContext } from "../context/AdminContext";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { DoctorContext } from "../context/DoctorContext";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa"; // Import icons from FontAwesome

const Login = () => {
  const [state, setState] = useState("Admin"); // Toggle between Admin and Doctor
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
  const { setToken, backendUrl } = useContext(AdminContext);
  const { setDToken } = useContext(DoctorContext);

  // Toggle between Admin and Doctor login
  const toggleState = () => {
    setState(state === "Admin" ? "Doctor" : "Admin");
  };

  // Handle form submission
  const onSubmitHandler = async (event) => {
    event.preventDefault();

    // Validate backend URL
    if (!backendUrl || !backendUrl.startsWith("http")) {
      toast.error("Invalid backend URL");
      return;
    }

    try {
      // Determine the endpoint based on the current state
      const endpoint =
        state === "Admin" ? "/api/admin/login" : "/api/doctor/login";

      console.log("Login endpoint:", `${backendUrl}${endpoint}`); // Debugging

      // Make the API call
      const { data } = await axios.post(`${backendUrl}${endpoint}`, {
        email,
        password,
      });

      console.log("Login response:", data); // Debugging

      if (data.success) {
        // Save the token to localStorage and context based on the user type
        if (state === "Admin") {
          localStorage.setItem("token", data.token);
          setToken(data.token);
          console.log("Admin token stored:", data.token); // Debugging
        } else {
          localStorage.setItem("dToken", data.dToken);
          setDToken(data.dToken);
          console.log("Doctor token stored:", data.dToken); // Debugging
        }
        toast.success("Login successful!");

        // Redirect based on the user type
        if (state === "Admin") {
          window.location.href = "/admin-dashboard"; // Redirect to admin dashboard
        } else {
          window.location.href = "/doctor-dashboard"; // Redirect to doctor dashboard
        }
      } else {
        toast.error(data.message || "Invalid credentials!");
      }
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message || "Login failed");
      } else if (error.request) {
        toast.error("No response from the server. Please try again.");
      } else {
        toast.error("An unexpected error occurred. Please try again.");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <ToastContainer /> {/* Toast container to display notifications */}
      <form
        onSubmit={onSubmitHandler}
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-md"
      >
        <h1 className="text-2xl font-bold text-center mb-6">
          <span className="text-blue-600">{state}</span> Login
        </h1>

        {/* Email Input */}
        <div className="mb-4">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email
          </label>
          <div className="relative mt-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaEnvelope className="h-5 w-5 text-gray-400" /> {/* Email icon */}
            </div>
            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              type="email"
              id="email"
              required
              placeholder="Enter your email"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Password Input */}
        <div className="mb-6">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700"
          >
            Password
          </label>
          <div className="relative mt-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaLock className="h-5 w-5 text-gray-400" /> {/* Password icon */}
            </div>
            <input
              type={showPassword ? "text" : "password"} // Toggle input type
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              id="password"
              required
              placeholder="Enter your password"
              className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
            {/* Show/Hide Password Button */}
            <div
              className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <FaEyeSlash className="h-5 w-5 text-gray-400" /> // Hide password icon
              ) : (
                <FaEye className="h-5 w-5 text-gray-400" /> // Show password icon
              )}
            </div>
          </div>
        </div>

        {/* Login Button */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-all"
        >
          Login
        </button>

        {/* Toggle between Admin and Doctor Login */}
        <p className="mt-4 text-center text-sm text-gray-500">
          {state === "Admin" ? (
            <>
              Doctor Login{" "}
              <span
                onClick={toggleState}
                className="text-blue-500 cursor-pointer hover:underline"
              >
                Click here
              </span>
            </>
          ) : (
            <>
              Admin Login{" "}
              <span
                onClick={toggleState}
                className="text-blue-500 cursor-pointer hover:underline"
              >
                Click here
              </span>
            </>
          )}
        </p>
      </form>
    </div>
  );
};

export default Login;