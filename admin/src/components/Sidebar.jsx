import React, { useContext } from 'react';
import { AdminContext } from '../context/AdminContext';
import { NavLink } from 'react-router-dom';
import { assets } from '../assets/assets';
import { DoctorContext } from '../context/DoctorContext';

const Sidebar = () => {
  const { token } = useContext(AdminContext);
   const { dToken } = useContext(DoctorContext);

  return (
    <div className='min-h-screen bg-white border-r'>
      {token && (
        <ul className='text-[#515151] mt-5 space-y-4 md:space-y-0 md:flex md:flex-col'>
          <li>
            <NavLink
              to='/admin-dashboard'
              className={({ isActive }) =>
                `flex items-center gap-3 py-3.5 px-4 md:px-6 hover:bg-gray-100 ${
                  isActive ? 'bg-[#F2F3FF] border-r-4 border-primary font-semibold' : ''
                }`
              }
            >
              <img src={assets.home_icon} alt='Dashboard Icon' className='w-5 h-5' />
              <p className='hidden md:inline-block'>Dashboard</p>
            </NavLink>
          </li>
          <li>
            <NavLink
              to='/all-appointment'
              className={({ isActive }) =>
                `flex items-center gap-3 py-3.5 px-4 md:px-6 hover:bg-gray-100 ${
                  isActive ? 'bg-[#F2F3FF] border-r-4 border-primary font-semibold' : ''
                }`
              }
            >
              <img src={assets.appointment_icon} alt='Appointment Icon' className='w-5 h-5' />
              <p className='hidden md:inline-block'>Appointment</p>
            </NavLink>
          </li>
          <li>
            <NavLink
              to='/add-doctor'
              className={({ isActive }) =>
                `flex items-center gap-3 py-3.5 px-4 md:px-6 hover:bg-gray-100 ${
                  isActive ? 'bg-[#F2F3FF] border-r-4 border-primary font-semibold' : ''
                }`
              }
            >
              <img src={assets.add_icon} alt='Add Doctor Icon' className='w-5 h-5' />
              <p className='hidden md:inline-block'>Add Doctor</p>
            </NavLink>
          </li>
          <li>
            <NavLink
              to='/doctor-list'
              className={({ isActive }) =>
                `flex items-center gap-3 py-3.5 px-4 md:px-6 hover:bg-gray-100 ${
                  isActive ? 'bg-[#F2F3FF] border-r-4 border-primary font-semibold' : ''
                }`
              }
            >
              <img src={assets.people_icon} alt='Doctor List Icon' className='w-5 h-5' />
              <p className='hidden md:inline-block'>Doctor List</p>
            </NavLink>
          </li>
        </ul>
      )}


{dToken &&(

<ul className='text-[#515151] mt-5 space-y-4 md:space-y-0 md:flex md:flex-col'>
<li>
  <NavLink
    to='/doctor-dashboard'
    className={({ isActive }) =>
      `flex items-center gap-3 py-3.5 px-4 md:px-6 hover:bg-gray-100 ${
        isActive ? 'bg-[#F2F3FF] border-r-4 border-primary font-semibold' : ''
      }`
    }
  >
    <img src={assets.home_icon} alt='Dashboard Icon' className='w-5 h-5' />
    <p className='hidden md:inline-block'>Dashboard</p>
  </NavLink>
</li>
<li>
  <NavLink
    to='/doctor-appointment'
    className={({ isActive }) =>
      `flex items-center gap-3 py-3.5 px-4 md:px-6 hover:bg-gray-100 ${
        isActive ? 'bg-[#F2F3FF] border-r-4 border-primary font-semibold' : ''
      }`
    }
  >
    <img src={assets.appointment_icon} alt='Appointment Icon' className='w-5 h-5' />
    <p className='hidden md:inline-block'>Appointment</p>
  </NavLink>
</li>

<li>
  <NavLink
    to='/doctor-profile'
    className={({ isActive }) =>
      `flex items-center gap-3 py-3.5 px-4 md:px-6 hover:bg-gray-100 ${
        isActive ? 'bg-[#F2F3FF] border-r-4 border-primary font-semibold' : ''
      }`
    }
  >
    <img src={assets.people_icon} alt='Doctor List Icon' className='w-5 h-5' />
    <p className='hidden md:inline-block'>Doctor Profile</p>
  </NavLink>
</li>
</ul>
)}

    </div>
  );
};

export default Sidebar;
