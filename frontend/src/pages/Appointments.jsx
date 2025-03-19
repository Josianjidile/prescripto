import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { assets } from "../assets/assets";
import RelatedDoctors from "../components/RelatedDoctors";
import { toast } from "react-toastify";
import axios from "axios";

const Appointments = () => {
  const { docId } = useParams(); // Get the doctor ID from the URL
  const { doctors, currencySymbol, getDoctorData, token, backendUrl } = useContext(AppContext); // Access the list of doctors and currency symbol from context
  const navigate = useNavigate();
  const daysOfWeek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"]; // Days of the week
  const [docInfo, setDocInfo] = useState(null); // State to store the doctor's info
  const [docSlots, setDocSlots] = useState([]); // State to store available slots
  const [bookedSlots, setBookedSlots] = useState([]); // State to store booked slots
  const [slotIndex, setSlotIndex] = useState(0); // State to track the selected day index
  const [slotTime, setSlotTime] = useState(""); // State to track the selected time slot

  // Fetch the doctor's info based on the docId
  const fetchDocInfo = () => {
    if (doctors && docId) {
      const doctor = doctors.find((doc) => doc._id === docId); // Find the doctor by ID
      setDocInfo(doctor || null); // Update state with the doctor's info or null if not found
    }
  };

  // Fetch booked slots for the doctor
  const fetchBookedSlots = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/user/booked-slots/${docId}`);
      setBookedSlots(data.bookedSlots);
    } catch (error) {
      console.error("Error fetching booked slots:", error);
    }
  };

  // Generate available time slots for the next 7 days
  const getAvailableSlots = async () => {
    setDocSlots([]); // Reset slots

    let today = new Date(); // Get the current date

    for (let i = 0; i < 7; i++) {
      let currentDate = new Date(today);
      currentDate.setDate(today.getDate() + i); // Set the date for the next 7 days

      let endTime = new Date(currentDate);
      endTime.setHours(21, 0, 0, 0); // Set the end time to 9:00 PM

      // Set the start time based on the current time
      if (today.getDate() === currentDate.getDate()) {
        currentDate.setHours(currentDate.getHours() > 10 ? currentDate.getHours() + 1 : 10);
        currentDate.setMinutes(currentDate.getMinutes() > 30 ? 30 : 0);
      } else {
        currentDate.setHours(10); // Set the start time to 10:00 AM for future dates
        currentDate.setMinutes(0);
      }

      let timeSlot = [];
      while (currentDate < endTime) {
        let formattedTime = currentDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }); // Format time as HH:MM AM/PM
        let day = currentDate.getDate();
        let month = currentDate.getMonth() + 1;
        let year = currentDate.getFullYear();

        const slotDate = `${day}_${month}_${year}`;
        const slotKey = `${slotDate}_${formattedTime}`;

        // Check if the slot is already booked
        if (!bookedSlots.includes(slotKey)) {
          timeSlot.push({
            datetime: new Date(currentDate),
            time: formattedTime,
          });
        }

        currentDate.setMinutes(currentDate.getMinutes() + 30); // Increment time by 30 minutes
      }

      setDocSlots((prev) => [...prev, timeSlot]); // Add the time slots for the day
    }
  };

  const bookAppointment = async () => {
    if (!token) {
      toast.warn("Login to book appointment");
      return navigate("/login");
    }

    try {
      const date = docSlots[slotIndex][0].datetime;
      let day = date.getDate();
      let month = date.getMonth() + 1;
      let year = date.getFullYear();

      // Ensure consistent formatting for slotDate (e.g., "DD_MM_YYYY")
      const slotDate = `${day}_${month}_${year}`;

      // Log the data being sent to the backend for debugging
      console.log("Sending data to backend:", { docId, slotDate, slotTime });

      // Send the POST request with the required data
      const { data } = await axios.post(
        `${backendUrl}/api/user/book-appointment`,
        { docId, slotDate, slotTime },
        {
          headers: { token },
        }
      );

      if (data.success) {
        toast.success(data.message);
        getDoctorData(); // Refresh doctor data
        navigate("/my-appointments");
      } else {
        toast.error(data.message); // Show any error message from the backend
      }
    } catch (error) {
      if (error.response && error.response.data) {
        if (error.response.data.message === "Slot already booked. Please try another slot.") {
          toast.error("This slot is already booked. Please choose another time or date.");
        } else {
          toast.error(error.response.data.message); // Show other error messages from backend
        }
      } else {
        toast.error("An error occurred while booking your appointment. Please try again.");
      }
      console.error("Error booking appointment:", error);
    }
  };

  // Fetch doctor info and booked slots when the component mounts or when `doctors` or `docId` changes
  useEffect(() => {
    fetchDocInfo();
    fetchBookedSlots();
  }, [doctors, docId]);

  // Generate available slots when doctor info is available
  useEffect(() => {
    if (docInfo) {
      getAvailableSlots();
    }
  }, [docInfo, bookedSlots]);

  // Show loading state if doctor info is not yet available
  if (!docInfo) {
    return <div className="p-5 text-gray-600">Loading doctor information...</div>;
  }

  return (
    <div className="p-5">
      {/* -------- Doctor Details -------- */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Doctor Image */}
        <div className="w-full sm:w-auto">
          <img src={docInfo.image} alt={docInfo.name} className="bg-primary w-full sm:max-w-72 rounded-lg" />
        </div>

        {/* Doctor Info */}
        <div className="flex-1 border border-gray-400 rounded-lg p-8 py-7 bg-white mx-2 sm:mx-0 mt-[-80px] sm:mt-0">
          {/* Name and Verified Icon */}
          <p className="text-2xl font-bold flex items-center gap-2 text-gray-900">
            {docInfo.name}
            <img src={assets.verified_icon} alt="Verified" className="w-5" />
          </p>

          {/* Degree, Speciality, and Experience */}
          <div className="flex items-center gap-2 text-sm mt-1 text-gray-600">
            <p>
              {docInfo.degree} - {docInfo.speciality}
            </p>
            <button className="py-0.5 px-2 border border-gray-400 text-xs rounded-full">
              {docInfo.experience} years
            </button>
          </div>

          {/* About Section */}
          <div className="mt-5">
            <p className="text-lg font-semibold flex items-center gap-2">
              About <img src={assets.info_icon} alt="Info" className="w-5 h-5" />
            </p>
            <p className="text-gray-600 mt-2">{docInfo.about}</p>
          </div>

          {/* Appointment Fee */}
          <p className="mt-4 text-gray-600">
            Appointment fee: <span className="font-semibold">{currencySymbol}{docInfo.fees}</span>
          </p>
        </div>
      </div>

      {/* -------- Booking Slots -------- */}
      <div className="sm:ml-72 sm:pl-4 mt-4 font-medium text-gray-700">
        <p>Booking slot</p>

        {/* Days Selection */}
        <div className="flex gap-3 items-center w-full overflow-x-scroll mt-4">
          {docSlots.length > 0 &&
            docSlots.map((item, index) => (
              <div
                key={index}
                onClick={() => setSlotIndex(index)}
                className={`text-center py-6 min-w-16 rounded-full cursor-pointer ${
                  slotIndex === index ? "bg-primary text-white" : "border border-gray-200"
                }`}
              >
                <p>{item[0] && daysOfWeek[item[0].datetime.getDay()]}</p>
                <p>{item[0] && item[0].datetime.getDate()}</p>
              </div>
            ))}
        </div>

        {/* Time Slots */}
        <div className="flex items-center gap-3 w-full overflow-x-scroll mt-4">
          {docSlots.length > 0 &&
            docSlots[slotIndex]?.map((item, index) => (
              <p
                key={index}
                onClick={() => setSlotTime(item.time)}
                className={`text-sm font-light flex-shrink-0 px-5 py-2 rounded-full cursor-pointer ${
                  item.time === slotTime ? "bg-primary text-white" : "text-gray-400 border border-gray-200"
                }`}
              >
                {item.time.toLowerCase()}
              </p>
            ))}
        </div>

        {/* Book Appointment Button */}
        <button onClick={bookAppointment} className="mt-4 px-6 py-2 bg-primary text-white rounded-full">
          Book an appointment
        </button>
      </div>

      {/* -------- Related Doctors -------- */}
      <RelatedDoctors docId={docId} speciality={docInfo.speciality} />
    </div>
  );
};

export default Appointments;