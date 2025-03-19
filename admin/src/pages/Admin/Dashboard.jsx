import React, { useContext, useEffect } from "react";
import { AdminContext } from "../../context/AdminContext";
import { assets } from "../../assets/assets";

const Dashboard = () => {
  const { token, getDashData, dashData, cancelAppointment } =
    useContext(AdminContext);

  // Fetch dashboard data when the component mounts or the token changes
  useEffect(() => {
    if (token) {
      getDashData();
    }
  }, [token]);

  // Return null if dashData is not available yet
  if (!dashData) return null;

  return (
    <div className="m-5">
      {/* Dashboard Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* Doctors Card */}
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 flex items-center gap-4">
          <img
            src={assets.doctor_icon}
            alt="Doctors"
            className="w-12 h-12 object-cover"
          />
          <div>
            <p className="text-2xl font-bold text-gray-800">
              {dashData.doctors}
            </p>
            <p className="text-sm text-gray-600">Doctors</p>
          </div>
        </div>

        {/* Appointments Card */}
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 flex items-center gap-4">
          <img
            src={assets.appointment_icon}
            alt="Appointments"
            className="w-12 h-12 object-cover"
          />
          <div>
            <p className="text-2xl font-bold text-gray-800">
              {dashData.appointments}
            </p>
            <p className="text-sm text-gray-600">Appointments</p>
          </div>
        </div>

        {/* Patients Card */}
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 flex items-center gap-4">
          <img
            src={assets.patients_icon}
            alt="Patients"
            className="w-12 h-12 object-cover"
          />
          <div>
            <p className="text-2xl font-bold text-gray-800">
              {dashData.patients}
            </p>
            <p className="text-sm text-gray-600">Patients</p>
          </div>
        </div>
      </div>

      {/* Latest Bookings Section */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        {/* Section Header */}
        <div className="flex items-center gap-3 mb-6">
          <img
            src={assets.list_icon}
            alt="Latest Bookings"
            className="w-8 h-8 object-cover"
          />
          <p className="text-xl font-semibold text-gray-800">Latest Bookings</p>
        </div>

        {/* Bookings List */}
        <div className="space-y-4">
          {dashData.latestAppointments?.map((item, index) => (
            <div
              key={index}
              className="grid grid-cols-1 sm:grid-cols-[auto_1fr_auto_auto] gap-4 items-center p-4 border rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              {/* Doctor Image */}
              <img
                src={item.docData.image}
                alt={item.docData.name}
                className="w-12 h-12 rounded-full object-cover"
              />

              {/* Doctor Name */}
              <p className="text-sm font-medium text-gray-800">
                {item.docData.name}
              </p>

              {/* Appointment Date */}
              <p className="text-sm text-gray-600">
                {item.slotDate} | {item.slotTime}
              </p>

              {/* Action Buttons */}
              <div className="flex justify-end">
                {item.cancelled ? (
                  <p className="text-red-500 font-medium">Cancelled</p>
                ) : (
                  <button
                    onClick={() => cancelAppointment(item._id)}
                    className="p-2 bg-red-50 rounded-lg hover:bg-red-100 transition-colors duration-200 relative group"
                  >
                    <img
                      className="w-6 h-6"
                      src={assets.cancel_icon}
                      alt="Cancel Appointment"
                    />
                    <span className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      Cancel Appointment
                    </span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;