import { createContext } from "react";

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  // Destructure children directly

  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const currency ="$"
  const calculateAge = (dob) => {
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    return age;
  };


  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  // Function to format slotDate (expected format: YYYY_MM_DD)
  const slotDateFormat = (slotDate) => {
    const dateArray = slotDate.split("_");
    if (dateArray.length !== 3) return slotDate; // Return as-is if format is unexpected

    const [day, month, year] = dateArray; // Ensure correct ordering
    return `${day} ${months[parseInt(month, 10) - 1]} ${year}`;
  };

  const value = {
    calculateAge,
    slotDateFormat,
    currency,
    backendUrl
  };

  return (
    <AppContext.Provider value={value}>
      {children} {/* Render children properly */}
    </AppContext.Provider>
  );
};

export default AppContextProvider;
