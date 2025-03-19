import React, { useContext, useEffect, useState } from 'react';
import { DoctorContext } from '../../context/DoctorContext';
import { assets } from '../../assets/assets';
import { AppContext } from '../../context/AppContext';

const DoctorDashboard = () => {
  const { dToken, dashData, setDashData, getDashData } = useContext(DoctorContext);
  const { currency, slotDateFormat } = useContext(AppContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (dToken) {
      setLoading(true);
      setError(null);
      getDashData()
        .then(() => setLoading(false))
        .catch((err) => {
          setError(err.message);
          setLoading(false);
        });
    }
  }, [dToken]);

  if (loading) {
    return <div className="m-5">Loading...</div>;
  }

  if (error) {
    return <div className="m-5 text-red-500">Error: {error}</div>;
  }

  return (
    dashData && (
      <div className="m-5">
        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Earnings Card */}
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 flex items-center gap-4">
            <img src={assets.earning_icon} alt="Earnings" className="w-12 h-12 object-cover" />
            <div>
              <p className="text-2xl font-bold text-gray-800">
                {currency}{dashData.earnings}
              </p>
              <p className="text-sm text-gray-600">Earnings</p>
            </div>
          </div>

          {/* Appointments Card */}
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 flex items-center gap-4">
            <img src={assets.appointment_icon} alt="Appointments" className="w-12 h-12 object-cover" />
            <div>
              <p className="text-2xl font-bold text-gray-800">{dashData.appointments}</p>
              <p className="text-sm text-gray-600">Appointments</p>
            </div>
          </div>

          {/* Patients Card */}
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 flex items-center gap-4">
            <img src={assets.patients_icon} alt="Patients" className="w-12 h-12 object-cover" />
            <div>
              <p className="text-2xl font-bold text-gray-800">{dashData.patients}</p>
              <p className="text-sm text-gray-600">Patients</p>
            </div>
          </div>
        </div>

        {/* Latest Bookings Section */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center gap-3 mb-6">
            <img src={assets.list_icon} alt="Latest Bookings" className="w-8 h-8 object-cover" />
            <p className="text-xl font-semibold text-gray-800">Latest Appointments</p>
          </div>

          <div className="space-y-4">
            {dashData.latestAppointment?.map((item, index) => (
              <div
                key={index}
                className="grid grid-cols-1 sm:grid-cols-[auto_1fr_auto_auto] gap-4 items-center p-4 border rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                <img src={item.userData.image} alt={item.docData.name} className="w-12 h-12 rounded-full object-cover" />
                <p className="text-sm font-medium text-gray-800">{item.docData.name}</p>
                <p className="text-sm text-gray-600">
                  {item.slotDate} | {item.slotTime}
                </p>
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
      </div>
    )
  );
};

export default DoctorDashboard;