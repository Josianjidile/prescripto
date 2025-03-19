import React, { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Login from "./pages/Login";
import { AdminContext } from "./context/AdminContext";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";

import AllAppointments from "./pages/Admin/AllAppointments";
import AddDoctor from "./pages/Admin/AddDoctor";
import DoctorsList from "./pages/Admin/DoctorsList";
import Dashboard from "./pages/Admin/Dashboard";
import { DoctorContext } from "./context/DoctorContext";
import DoctorDashboard from "./pages/Doctor/DoctorDashboard";
import DoctorProfile from "./pages/Doctor/DoctorProfile";
import DoctorAppointment from "./pages/Doctor/DoctorAppointment";

const App = () => {
  const { token } = useContext(AdminContext);
  const { dToken } = useContext(DoctorContext);

  const isAuthenticated = token || dToken; // Check if either token exists

  return (
    <div className="bg-[#F8F9FD] min-h-screen">
      <ToastContainer />
      {isAuthenticated ? (
        <>
          <Navbar />
          <div className="flex items-start">
            <Sidebar />
            <div className="flex-1 p-6">
              <Routes>
                {/* Admin Routes */}
                {token && (
                  <>
                    <Route path="/" element={<Navigate to="/admin-dashboard" />} />
                    <Route path="/admin-dashboard" element={<Dashboard />} />
                    <Route path="/all-appointment" element={<AllAppointments />} />
                    <Route path="/add-doctor" element={<AddDoctor />} />
                    <Route path="/doctor-list" element={<DoctorsList />} />
                  </>
                )}

                {/* Doctor Routes */}
                {dToken && (
                  <>
                    <Route path="/" element={<Navigate to="/doctor-dashboard" />} />
                    <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
                    <Route path="/doctor-profile" element={<DoctorProfile />} />
                    <Route path="/doctor-appointment" element={<DoctorAppointment />} />
                  </>
                )}

                {/* Fallback Route */}
                <Route path="*" element={<Navigate to={token ? "/admin-dashboard" : "/doctor-dashboard"} />} />
              </Routes>
            </div>
          </div>
        </>
      ) : (
        <>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
          <ToastContainer />
        </>
      )}
    </div>
  );
};

export default App;