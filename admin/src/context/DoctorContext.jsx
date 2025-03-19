import { useState, createContext } from "react";
import { toast } from "react-toastify";
import axios from "axios";

export const DoctorContext = createContext();

export const DoctorContextProvider = ({ children }) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [dToken, setDToken] = useState(localStorage.getItem("dToken") || "");
  const [appointments, setAppointments] = useState([]);
  const [dashData, setDashData] = useState(false);
  const [profileData, setProfileData] = useState(false);

  // Fetch all appointments
  const getAllAppointments = async () => {
    try {
      console.log("Fetching appointments with token:", dToken);

      const { data } = await axios.get(
        `${backendUrl}/api/doctor/my-appointments`,
        {
          headers: { Authorization: `Bearer ${dToken}` },
        }
      );

      if (data.success) {
        setAppointments(data.appointments.reverse());
        toast.success("Appointments fetched successfully!");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Error fetching appointments:", error.response?.data);
      toast.error(
        error.response?.data?.message || "Failed to fetch appointments."
      );
    }
  };

  // Complete an appointment
  const completeAppointment = async (appointmentId) => {
    try {
      console.log("Completing appointment:", appointmentId);

      const { data } = await axios.post(
        `${backendUrl}/api/doctor/complete-appointment`,
        { appointmentId },
        {
          headers: { Authorization: `Bearer ${dToken}` },
        }
      );

      if (data.success) {
        toast.success("Appointment marked as completed!");
        getAllAppointments(); // Refresh appointments after completion
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Error completing appointment:", error.response?.data);
      toast.error(
        error.response?.data?.message || "Failed to complete appointment."
      );
    }
  };

  // Cancel an appointment
  const cancelAppointment = async (appointmentId) => {
    try {
      console.log("Canceling appointment:", appointmentId);

      const { data } = await axios.post(
        `${backendUrl}/api/doctor/cancel-appointment`,
        { appointmentId },
        {
          headers: { Authorization: `Bearer ${dToken}` },
        }
      );

      if (data.success) {
        toast.success("Appointment canceled successfully!");
        getAllAppointments(); // Refresh appointments after cancellation
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Error canceling appointment:", error.response?.data);
      toast.error(
        error.response?.data?.message || "Failed to cancel appointment."
      );
    }
  };

  const getDashData = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/doctor/dashboard`, {
        headers: { Authorization: `Bearer ${dToken}` },
      });

      console.log("Response Data:", data); // Debugging

      if (data.success) {
        setDashData(data.dashData);
        console.log("Dashboard Data:", data.dashData); // Debugging
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error.response?.data);
      toast.error(
        error.response?.data?.message || "Failed to fetch dashboard data."
      );
    }
  };

  const getProfileData = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/doctor/profile`, {
        headers: { Authorization: `Bearer ${dToken}` },
      });
      if (data.success) {
        setProfileData(data.profileData);
        console.log(data.profileData);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error.response?.data);
      toast.error(
        error.response?.data?.message || "Failed to fetch dashboard data."
      );
    }
  };

  const value = {
    backendUrl,
    dToken,
    setDToken,
    getAllAppointments,
    completeAppointment,
    cancelAppointment,
    appointments,
    setAppointments,
    getDashData,
    setDashData,
    dashData,
    setProfileData,
    profileData,
    getProfileData
  };

  return (
    <DoctorContext.Provider value={value}>{children}</DoctorContext.Provider>
  );
};

export default DoctorContextProvider;
