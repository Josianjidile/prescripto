import React, { useState, useContext } from "react";
import { assets } from "../assets/assets";
import { NavLink, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";

const Navbar = () => {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const { token, setToken, userData } = useContext(AppContext);

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  const logout = () => {
    if (token) {
      setToken("");
      localStorage.removeItem("token");
    }
    navigate("/");
  };

  return (
    <div className="flex justify-between items-center text-sm mb-5 py-4 border-b border-b-gray-400 bg-white relative">
      {/* Logo */}
      <img
        onClick={() => navigate("/")}
        src={assets.logo}
        alt="Company Logo"
        className="w-32 md:w-44 cursor-pointer"
      />

      {/* Navigation Links (Desktop) */}
      <ul className="hidden md:flex items-center gap-5 font-medium">
        <NavLink to="/" className="hover:text-blue-500">
          <li className="py-1">HOME</li>
        </NavLink>
        <NavLink to="/doctors" className="hover:text-blue-500">
          <li className="py-1">ALL DOCTORS</li>
        </NavLink>
        <NavLink to="/about" className="hover:text-blue-500">
          <li className="py-1">ABOUT</li>
        </NavLink>
        <NavLink to="/contact" className="hover:text-blue-500">
          <li className="py-1">CONTACT</li>
        </NavLink>
      </ul>

      {/* Right Section */}
      <div className="flex items-center gap-4">
        {/* Admin/Doctor Login Button */}
        <button
          onClick={() => (window.location.href = "https://prescripto-admin-topaz.vercel.app")} // Navigate to external URL
          className="bg-gray-700 text-white px-3 py-1 md:px-4 md:py-2 rounded-full hover:bg-gray-800 transition-all text-sm md:text-base"
        >
          Admin
        </button>

        {/* Login Button (If Not Logged In) */}
        {!token && (
          <button
            onClick={() => navigate("/login")}
            className="bg-primary text-white px-3 py-1 md:px-4 md:py-2 rounded-full hover:bg-blue-600 transition-all text-sm md:text-base"
          >
            Create Account
          </button>
        )}

        {/* Profile Image and Dropdown */}
        {token && userData && (
          <div
            className="relative flex items-center gap-2 cursor-pointer"
            onMouseEnter={() => setShowProfileMenu(true)}
            onMouseLeave={() => setShowProfileMenu(false)}
          >
            <img
              className="w-8 h-8 rounded-full border border-gray-300"
              src={userData.image || assets.profile_pic}
              alt="User Profile"
            />

            {/* Profile Dropdown Menu */}
            {showProfileMenu && (
              <div className="absolute top-full right-0 pt-2 text-base font-medium text-gray-600 z-20">
                <div className="min-w-48 bg-stone-100 rounded flex flex-col gap-4 p-4 shadow-md">
                  <p
                    onClick={() => {
                      navigate("/my-profile");
                      setShowProfileMenu(false);
                    }}
                    className="hover:text-black cursor-pointer"
                  >
                    My Profile
                  </p>
                  <p
                    onClick={() => {
                      navigate("/my-appointments");
                      setShowProfileMenu(false);
                    }}
                    className="hover:text-black cursor-pointer"
                  >
                    My Appointments
                  </p>
                  <p
                    onClick={logout}
                    className="hover:text-black cursor-pointer"
                  >
                    Logout
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Mobile Menu Icon */}
        <div className="md:hidden cursor-pointer" onClick={toggleMenu}>
          <img src={assets.menu_icon} alt="Menu Icon" className="w-8" />
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {showMenu && (
        <div className="absolute top-16 right-0 w-64 bg-white shadow-lg md:hidden z-30">
          <ul className="flex flex-col gap-4 p-4">
            <NavLink to="/" className="hover:text-blue-500" onClick={toggleMenu}>
              <li className="py-1">HOME</li>
            </NavLink>
            <NavLink
              to="/doctors"
              className="hover:text-blue-500"
              onClick={toggleMenu}
            >
              <li className="py-1">ALL DOCTORS</li>
            </NavLink>
            <NavLink
              to="/about"
              className="hover:text-blue-500"
              onClick={toggleMenu}
            >
              <li className="py-1">ABOUT</li>
            </NavLink>
            <NavLink
              to="/contact"
              className="hover:text-blue-500"
              onClick={toggleMenu}
            >
              <li className="py-1">CONTACT</li>
            </NavLink>
          </ul>
        </div>
      )}
    </div>
  );
};

export default Navbar;