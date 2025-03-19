import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; 
import { AppContext } from "../context/AppContext";

const RelatedDoctors = ({ docId, speciality }) => {
  const { doctors } = useContext(AppContext); 
  const navigate = useNavigate(); 
  const [relDocs, setRelDocs] = useState([]);


  useEffect(() => {
    if (doctors && speciality) {
      const filteredDoctors = doctors.filter(
        (doc) => doc.speciality === speciality && doc._id !== docId
      );
      setRelDocs(filteredDoctors);
    }
  }, [doctors, docId, speciality]);

  return (
    <div className="flex flex-col items-center gap-4 py-10 text-gray-900 md:mx-6">
      <h1 className="text-2xl font-medium">Related Doctors to Book</h1>
      <p className="sm:w-1/2 text-center text-sm">
        Browse through our list of  trusted doctors.
      </p>

      <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pt-4 sm:px-0">
        {relDocs.slice(0, 5).map((item) => (
          <div
            key={item._id}
            className="border rounded-xl overflow-hidden cursor-pointer hover:scale-105 transition-transform duration-300"
            onClick={() => {
              navigate(`/appointment/${item._id}`);
              window.scrollTo(0, 0);
            }}
          >
            <img
              src={item.image}
              alt={item.name}
              className="w-full object-cover"
            />
            <div className="p-3">
              <div className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-md w-fit">
                Available
              </div>
              <p className="mt-2 font-semibold">{item.name}</p>
              <p className="text-sm text-gray-600">{item.speciality}</p>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={() => {
          navigate("/doctors");
          window.scrollTo(0, 0);
        }}
        className="mt-6 px-6 py-2 bg-blue-50 text-gray-500 rounded-full shadow-md hover:bg-primary-dark transition"
      >
        More
      </button>
    </div>
  );
};

export default RelatedDoctors;
