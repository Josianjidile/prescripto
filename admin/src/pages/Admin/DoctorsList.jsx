import React, { useContext, useEffect } from "react";
import { AdminContext } from "../../context/AdminContext";

const DoctorsList = () => {
  const { getAllDoctors, doctors,changeDoctorAvailability } = useContext(AdminContext);

  useEffect(() => {
    getAllDoctors();
  }, []);

  return (
    <div className="m-5 max-h-[90vh] overflow-y-scroll">
      <h2 className="text-lg font-medium">Doctors List</h2>
      <div className="w-full flex flex-wrap gap-4 pt-5 gap-y-6">
        {doctors.length > 0 ? (
          doctors.map((doctor, index) => (
            <div
              className="border border-indigo-200 rounded-xl max-w-56 overflow-hidden cursor-pointer group"
              key={index}
            >
              <img
                className="bg-indigo-50 group-hover:bg-primary transition-all duration-500"
                src={doctor.image}
                alt=""
              />
              <div className="p-4">
                <p className="text-neutral-800 text-lg font-medium">
                  {doctor.name}
                </p>
                <p className="text-zinc-500 text-sm">{doctor.speciality}</p>
                <div className="mt-2 flex items-center gap-1 text-sm">
                  <input className="cursor-pointer" type="checkbox" onChange={()=>changeDoctorAvailability(doctor._id)} checked={doctor.available} />
                  <p>available</p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No doctors found.</p>
        )}
      </div>
    </div>
  );
};

export default DoctorsList;
