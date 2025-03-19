import React from 'react';
import { assets } from '../assets/assets';
import { useNavigate } from 'react-router-dom';

const Banner = () => {
    const navigate = useNavigate();
  
  return (
    <div className='flex flex-col md:flex-row bg-primary text-white rounded-lg px-6 sm:px-10 md:px-14 lg:px-20 my-10 mx-4 md:mx-10 items-center justify-between gap-6 py-8'>
      {/* -------- Left Side --------- */}
      <div className='flex flex-col gap-4 text-center md:text-left max-w-2xl'>
        <h2 className='text-xl sm:text-2xl md:text-3xl font-bold leading-tight'>
          Book Appointment <br /> With 100+ Trusted Doctors
        </h2>
        <p className='text-xs sm:text-sm text-gray-100'>
          Simply browse through our extensive list of trusted doctors and schedule your appointment hassle-free.
        </p>
        <button
        onClick={() => {
            navigate(`/login`);
            window.scrollTo(0, 0);
          }}
          className='bg-white text-primary px-6 py-2 rounded-full font-semibold shadow-md hover:bg-gray-100 hover:scale-105 transition-all duration-300 w-fit mx-auto md:mx-0'
        >
          Create Account & Book Appointment
        </button>
      </div>

      {/* -------- Right Side --------- */}
      <div className='flex justify-center md:justify-end w-full md:w-auto'>
        <img 
          src={assets.appointment_img} 
          alt="Appointment Illustration" 
          className='w-40 sm:w-48 md:w-56 lg:w-64'
        />
      </div>
    </div>
  );
};

export default Banner;
