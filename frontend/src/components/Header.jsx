import React from 'react';
import { assets } from '../assets/assets';

const Header = () => {
  return (
    <div className='flex flex-col md:flex-row justify-between items-center bg-primary rounded-lg px-4 py-6 sm:px-6 md:px-10 lg:px-20 gap-6 sm:gap-8'>
      {/* -------- Left Side --------- */}
      <div className='flex flex-col gap-4 sm:gap-6 text-white max-w-lg text-center md:text-left'>
        <h1 className='text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-tight'>
          Book Appointment <br /> With Trusted Doctors
        </h1>
        <div className='flex flex-col gap-4'>
          <div className='flex flex-col sm:flex-row items-center gap-3'>
            <img 
              src={assets.group_profiles} 
              alt="Group Profiles" 
              className='w-20 sm:w-24'
            />
            <p className='text-sm sm:text-base'>
              Simply browse through our extensive list of trusted doctors <br className='hidden sm:block' /> 
              and schedule your appointment hassle-free.
            </p>
          </div>
        </div>
        <a
          href="#"
          aria-label="Book an appointment"
          className='flex items-center justify-center gap-2 bg-white text-primary px-6 py-3 hover:scale-105 transition-transform duration-300 rounded-full w-full sm:w-fit font-semibold hover:bg-gray-100'
        >
          Book Appointment
          <img src={assets.arrow_icon} alt="Arrow Icon" className='w-4' />
        </a>
      </div>

      {/* -------- Right Side --------- */}
      <div className='flex justify-center md:justify-end w-full md:w-auto'>
        <img
          src={assets.header_img}
          alt="Header Illustration"
          className='w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg object-contain'
        />
      </div>
    </div>
  );
};

export default Header;
