import React from "react";
import { specialityData } from "../assets/assets";
import { Link } from "react-router-dom";

const SpecialityMenu = () => {
  return (
    <div className="flex flex-col items-center gap-4 py-8 sm:py-16 text-gray-800 px-4 sm:px-8" id="speciality">
      {/* Heading */}
      <h1 className="text-2xl sm:text-3xl font-medium text-center">
        Find by Speciality
      </h1>

      {/* Description */}
      <p className="w-full sm:w-1/2 lg:w-1/3 text-center text-sm sm:text-base">
        Simply browse through our extensive list of trusted doctors and schedule
        your appointment.
      </p>

      {/* Speciality Items */}
      <div className="flex justify-start sm:justify-center gap-4 sm:gap-6 pt-5 w-full overflow-x-auto no-scrollbar">
        {specialityData.map((item, index) => (
          <Link
            className="flex flex-col items-center text-xs sm:text-sm cursor-pointer flex-shrink-0 hover:scale-105 transition-transform duration-500"
            key={index}
            to={`/doctors/${item.speciality}`}
          >
            <img
              className="w-12 h-12 sm:w-20 sm:h-20 mb-2 object-cover rounded-full"
              src={item.image}
              alt={item.speciality}
            />
            <p className="text-center">{item.speciality}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default SpecialityMenu;