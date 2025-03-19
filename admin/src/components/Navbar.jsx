import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminContext } from '../context/AdminContext';
import { assets } from '../assets/assets';
import { DoctorContext } from '../context/DoctorContext';

const Navbar = () => {
  const { token, setToken } = useContext(AdminContext);
  const { dToken, setDToken } = useContext(DoctorContext);
  const navigate = useNavigate();

  const logout = () => {
    if (token) {
      setToken('');
      localStorage.removeItem('token');
    }
    if (dToken) {
      setDToken('');
      localStorage.removeItem('dToken');
    }
    navigate('/');
  };

  return (
    <div className="flex items-center justify-between p-4 bg-white shadow-md">
      <div className="flex items-center space-x-4">
        <img src={assets.admin_logo} alt="Logo" className="w-32" />
        <p className="border px-2.5 rounded-full border-gray-400 text-gray-700">
          {token ? 'Admin' : dToken ? 'Doctor' : 'Guest'}
        </p>
      </div>
      {(token || dToken) && (
        <button
          onClick={logout}
          className="px-10 py-2 bg-primary text-stone-50 rounded-full hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Logout
        </button>
      )}
    </div>
  );
};

export default Navbar;