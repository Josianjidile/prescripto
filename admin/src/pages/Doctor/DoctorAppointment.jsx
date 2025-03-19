import React, { useContext, useEffect } from "react";
import { DoctorContext } from "../../context/DoctorContext";
import { AppContext } from "../../context/AppContext";
import { assets } from "../../assets/assets";

const DoctorAppointment = () => {
  const { dToken, appointments, getAllAppointments, cancelAppointment, completeAppointment } =
    useContext(DoctorContext);
  const { calculateAge, slotDateFormat, currency } = useContext(AppContext);

  useEffect(() => {
    if (dToken) {
      getAllAppointments();
    }
  }, [dToken]);

  return (
    <div className="w-full max-w-6xl mx-auto p-4">
      <p className="mb-3 text-lg font-medium">All Appointments</p>
      <div className="bg-white border rounded-lg overflow-hidden">
        {/* Header for larger screens */}
        <div className="hidden sm:grid sm:grid-cols-[0.5fr_2fr_1fr_1fr_3fr_1fr_1fr] gap-4 py-3 px-6 bg-gray-50 border-b">
          <p>#</p>
          <p>Patient</p>
          <p>Payment</p>
          <p>Age</p>
          <p>Date & Time</p>
          <p>Fees</p>
          <p>Action</p>
        </div>
        {/* Appointment items */}
        {appointments.map((item, index) => (
          <div
            key={index}
            className="p-4 border-b last:border-b-0 sm:grid sm:grid-cols-[0.5fr_2fr_1fr_1fr_3fr_1fr_1fr] gap-4 items-center"
          >
            {/* Simplified view for small screens */}
            <div className="sm:hidden space-y-2">
              <div className="flex items-center gap-2">
                <img
                  src={item.userData.image}
                  alt={item.userData.name}
                  className="w-8 h-8 rounded-full"
                />
                <p className="font-medium">{item.userData.name}</p>
              </div>
              <div className="border px-2.5 rounded-full border-gray-400 text-gray-700 flex justify-between">
                <p>{item.payment ? "Online" : "Cash"}</p>
                <p>{calculateAge(item.userData.dob)}</p>
              </div>
              <p>{slotDateFormat(item.slotDate)}</p>
              <div className="flex justify-between">
                <p>{currency}{item.amount}</p>
                {!item.cancelled && !item.isCompleted && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => cancelAppointment(item._id)}
                      className="p-1.5 bg-red-50 rounded-full hover:bg-red-100 transition-colors"
                      title="Cancel"
                    >
                      <img
                        src={assets.cancel_icon}
                        alt="Cancel"
                        className="w-5 h-5"
                      />
                    </button>
                    <button
                      onClick={() => completeAppointment(item._id)}
                      className="p-1.5 bg-green-50 rounded-full hover:bg-green-100 transition-colors"
                      title="Complete"
                    >
                      <img
                        src={assets.tick_icon}
                        alt="Complete"
                        className="w-5 h-5"
                      />
                    </button>
                  </div>
                )}
              </div>
            </div>
            {/* Full table layout for larger screens */}
            <div className="hidden sm:block">{index + 1}</div>
            <div className="hidden sm:flex sm:items-center sm:gap-2">
              <img
                src={item.userData.image}
                alt={item.userData.name}
                className="w-8 h-8 rounded-full"
              />
              <p>{item.userData.name}</p>
            </div>
            <div className="hidden sm:block">
              <p>{item.payment ? "Online" : "Cash"}</p>
            </div>
            <div className="hidden sm:block">
              <p>{calculateAge(item.userData.dob)}</p>
            </div>
            <div className="hidden sm:block">
              <p>{slotDateFormat(item.slotDate, item.slotTime)}</p>
            </div>
            <div className="hidden sm:block">
              <p>{currency}{item.amount}</p>
            </div>
            <div className="hidden sm:flex sm:gap-2">
              {item.cancelled ? (
                <p className="text-red-500">Cancelled</p>
              ) : item.isCompleted ? (
                <p className="text-green-500">Completed</p>
              ) : (
                <>
                  <button
                    onClick={() => cancelAppointment(item._id)}
                    className="p-1.5 bg-red-50 rounded-full hover:bg-red-100 transition-colors"
                    title="Cancel"
                  >
                    <img
                      src={assets.cancel_icon}
                      alt="Cancel"
                      className="w-5 h-5"
                    />
                  </button>
                  <button
                    onClick={() => completeAppointment(item._id)}
                    className="p-1.5 bg-green-50 rounded-full hover:bg-green-100 transition-colors"
                    title="Complete"
                  >
                    <img
                      src={assets.tick_icon}
                      alt="Complete"
                      className="w-5 h-5"
                    />
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DoctorAppointment;