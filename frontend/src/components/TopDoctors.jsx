import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';

const TopDoctors = () => {
  const { doctors } = useContext(AppContext);
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center gap-4 py-10 text-gray-900 md:mx-6">
      <h1 className="text-2xl font-medium">Top Doctors to Book</h1>
      <p className="sm:w-1/2 text-center text-sm">Browse through our list of trusted doctors.</p>

      <div className="w-full grid grid-cols-auto gap-4 pt-4 sm:px-0">
        {doctors.slice(0, 10).map((item, index) => (
          <div key={index} className="border rounded-xl overflow-hidden cursor-pointer hover:scale-105 transition-transform duration-300">
            <img onClick={() => {
              navigate(`/appointment/${item._id}`);
              window.scrollTo(0, 0);
            }} src={item.image} alt={item.name} />
            <div className="p-3">
              <div className={`bg-green-100  ${item.available ? "text-green-700" : "text-red-500"}  text-xs px-2 py-1 rounded-md w-fit`}>{item.available ? "Available" : " Not Available"}</div>
              <p className="mt-2 font-semibold">{item.name}</p>
              <p className="text-sm text-gray-600">{item.speciality}</p>
            </div>
          </div>
        ))}
      </div>

      <button onClick={() => { navigate('/doctors'); scrollTo(0, 0); }} className="mt-6 px-6 py-2 bg-blue-50 text-gray-500 rounded-full shadow-md hover:bg-primary-dark transition">
        More
      </button>
    </div>
  );
};

export default TopDoctors;
