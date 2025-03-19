import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const MyAppointment = () => {
  const { backendUrl, token } = useContext(AppContext);
  const [appointments, setAppointments] = useState([]);
  const navigate = useNavigate();

  // Months array for date formatting
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];

  // Function to format slotDate (expected format: YYYY_MM_DD)
  const slotDateFormat = (slotDate) => {
    const dateArray = slotDate.split("_");
    if (dateArray.length !== 3) return slotDate; // Return as-is if format is unexpected

    const [day, month, year] = dateArray; // Ensure correct ordering
    return `${day} ${months[parseInt(month, 10) - 1]} ${year}`;
  };

  // Fetch user appointments
  const getUserAppointments = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/user/appointments`, {
        headers: { token },
      });

      if (data.success) {
        setAppointments(data.appointments.reverse()); // Reverse to show latest first
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Error fetching appointments:", error);
      toast.error(error.response?.data?.message || "Failed to fetch appointments");
    }
  };

  // Cancel an appointment
  const cancelAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/user/cancel-appointment`,
        { appointmentId },
        { headers: { token } }
      );

      if (data.success) {
        toast.success(data.message);
        getUserAppointments(); // Refresh the list
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Error canceling appointment:", error);
      toast.error(error.response?.data?.message || "Failed to cancel appointment");
    }
  };

  // Initialize Razorpay payment
  const initPay = async (order) => {
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name: "Appointment Payment",
      description: "Appointment Payment",
      order_id: order.id,
      receipt: order.receipt,
      handler: async (response) => {
        try {
          const { data } = await axios.post(
            `${backendUrl}/api/user/verify-razorpay`,
            response,
            { headers: { token } }
          );
          if (data.success) {
            toast.success("Payment verified successfully");
            getUserAppointments(); // Refresh the list
            navigate("/my-appointments");
          }
        } catch (error) {
          console.error("Error verifying payment:", error);
          toast.error(error.response?.data?.message || "Payment verification failed");
        }
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  // Trigger Razorpay payment
  const appointmentRazorpay = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/user/payment-razorpay`,
        { appointmentId },
        { headers: { token } }
      );

      if (data.success) {
        initPay(data.order); // Initialize Razorpay payment
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Error processing Razorpay payment:", error);
      toast.error(error.response?.data?.message || "Payment failed");
    }
  };

  // Fetch appointments on component mount or when token changes
  useEffect(() => {
    if (token) {
      getUserAppointments();
    }
  }, [token]);

  return (
    <div className="p-6 sm:p-10">
      {/* Heading */}
      <p className="text-2xl font-bold text-gray-800 mb-6">My Appointments</p>

      {/* Appointments List */}
      <div className="space-y-6">
        {appointments.map((item, index) => (
          <div
            key={index}
            className="border border-gray-200 rounded-lg p-6 bg-white shadow-sm hover:shadow-md transition-shadow duration-300"
          >
            <div className="flex flex-col sm:flex-row items-center gap-6">
              {/* Doctor Image */}
              <div className="w-32 h-32 bg-indigo-50 rounded-full flex items-center justify-center">
                <img
                  src={item.docData.image}
                  alt={item.docData.name}
                  className="w-24 h-24 rounded-full object-cover"
                />
              </div>

              {/* Doctor Details */}
              <div className="flex-1">
                <p className="text-xl font-semibold text-gray-800">
                  {item.docData.name}
                </p>
                <p className="text-sm text-gray-600">
                  {item.docData.speciality}
                </p>
                <div className="mt-2">
                  <p className="text-sm text-gray-900">Address:</p>
                  <p className="text-sm text-gray-600">
                    {item.docData.address.line1}
                  </p>
                  <p className="text-sm text-gray-600">
                    {item.docData.address.line2}
                  </p>
                </div>
                <p className="mt-2 text-sm text-gray-600">
                  <span className="font-medium text-gray-800">Date & Time:</span>{" "}
                  {slotDateFormat(item.slotDate)} | {item.slotTime}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-2">
                {!item.cancelled && !item.isCompleted ? (
                  <>
                    {item.payment ? (
                      <button className="px-6 py-2 text-gray-500 bg-gray-300 rounded-lg cursor-not-allowed hover:bg-gray-400 transition-colors duration-300 border border-gray-300">
                        Paid
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={() => appointmentRazorpay(item._id)}
                          className="px-6 py-2 text-stone-500 rounded-lg hover:bg-primary hover:text-white transition-colors duration-300 border border-gray-300"
                        >
                          Pay Online
                        </button>
                        <button
                          onClick={() => cancelAppointment(item._id)}
                          className="px-6 py-2 text-stone-500 rounded-lg hover:bg-red-600 hover:text-white transition-colors duration-300 border border-gray-300"
                        >
                          Cancel Appointment
                        </button>
                      </>
                    )}
                  </>
                ) : (
                  <p className="px-6 py-2 text-red-500 font-medium">
                    {item.cancelled ? "Appointment Cancelled" : "Appointment Completed"}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyAppointment;