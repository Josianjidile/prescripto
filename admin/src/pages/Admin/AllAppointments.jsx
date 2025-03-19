import React, { useContext, useEffect } from "react";
import { AdminContext } from "../../context/AdminContext";
import { AppContext } from "../../context/AppContext";
import { assets } from "../../assets/assets";

const AllAppointments = () => {
  const { token, getAllAppointments, appointments, cancelAppointment } =
    useContext(AdminContext);
  const { calculateAge, slotDateFormat, currency } = useContext(AppContext);

  // Fetch all appointments when the component mounts or the token changes
  useEffect(() => {
    if (token) {
      getAllAppointments();
    }
  }, [token]);

  return (
    <div className="w-full max-w-6xl mx-auto p-5">
      {/* Heading */}
      <p className="mb-3 text-lg font-medium">All Appointments</p>

      {/* Appointments Table */}
      <div className="bg-white border rounded-lg text-sm max-h-[80vh] min-h-[60vh] overflow-y-auto">
        {/* Table Header (Visible only on larger screens) */}
        <div className="hidden sm:grid grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr] grid-flow-col py-3 px-6 border-b bg-gray-50">
          <p>#</p>
          <p>Patient</p>
          <p>Age</p>
          <p>Date & Time</p>
          <p>Doctor</p>
          <p>Fee</p>
          <p>Action</p>
        </div>

        {/* Appointments List */}
        {appointments.map((item, index) => (
          <div
            key={index}
            className="grid grid-cols-1 sm:grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr] gap-4 sm:gap-0 sm:grid-flow-col items-center py-3 px-6 border-b hover:bg-gray-50 transition-colors duration-200"
          >
            {/* Serial Number */}
            <p className="text-center sm:text-left">
              <span className="font-semibold sm:hidden"># </span>
              {index + 1}
            </p>

            {/* Patient Details */}
            <div className="flex items-center gap-3">
              <img
                className="w-8 h-8 rounded-full object-cover"
                src={item.userData.image}
                alt={item.userData.name}
              />
              <p className="truncate">
                <span className="font-semibold sm:hidden">Patient: </span>
                {item.userData.name}
              </p>
            </div>

            {/* Patient Age */}
            <p className="text-center sm:text-left">
              <span className="font-semibold sm:hidden">Age: </span>
              {calculateAge(item.userData.dob) || "N/A"}
            </p>

            {/* Appointment Date & Time */}
            <p className="truncate">
              <span className="font-semibold sm:hidden">Date & Time: </span>
              {slotDateFormat(item.slotDate)} | {item.slotTime}
            </p>

            {/* Doctor Details */}
            <div className="flex items-center gap-3">
              <img
                className="w-8 h-8 rounded-full object-cover"
                src={item.docData.image}
                alt={item.docData.name}
              />
              <p className="truncate">
                <span className="font-semibold sm:hidden">Doctor: </span>
                {item.docData.name}
              </p>
            </div>

            {/* Appointment Fee */}
            <p className="text-center sm:text-left">
              <span className="font-semibold sm:hidden">Fee: </span>
              {currency}
              {item.amount}
            </p>

            {/* Action Buttons */}
            <div className="flex justify-center sm:justify-start">
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
  );
};

export default AllAppointments;
