import React, { useContext, useEffect, useState } from 'react';
import { DoctorContext } from '../../context/DoctorContext';
import { AppContext } from '../../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const DoctorProfile = () => {
  const { dToken, profileData, setProfileData, getProfileData } = useContext(DoctorContext);
  const { currency, backendUrl } = useContext(AppContext);
  const [isEdit, setIsEdit] = useState(false);

  // Update profile data
  const updateProfile = async () => {
    try {
      const updatedData = {
        address: profileData.address,
        fees: Number(profileData.fees), // Ensure it's a number
        available: profileData.available,
        about: profileData.about,
      };
  
      const { data } = await axios.post(
        `${backendUrl}/api/doctor/update-profile`,
        updatedData,
        {
          headers: { Authorization: `Bearer ${dToken}` },
        }
      );
  
      if (data.success) {
        toast.success('Profile updated successfully!');
        setIsEdit(false);
        getProfileData(); // Refresh profile data
      } else {
        toast.error(data.message || 'Failed to update profile.');
      }
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
      console.error('Error updating profile:', error);
    }
  };
  

  // Fetch profile data on component mount or when dToken changes
  useEffect(() => {
    if (dToken) {
      getProfileData();
    }
  }, [dToken]);

  if (!profileData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Profile Container */}
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Profile Header */}
        <div className="flex flex-col md:flex-row p-6">
          {/* Profile Image */}
          <div className="w-full md:w-1/3 flex justify-center md:justify-start">
            <img
              src={profileData.image}
              alt={profileData.name}
              className="w-48 h-48 rounded-full object-cover border-4 border-white shadow-lg"
            />
          </div>

          {/* Profile Details */}
          <div className="w-full md:w-2/3 mt-6 md:mt-0 md:ml-6">
            {/* Name */}
            <h1 className="text-3xl font-bold text-gray-800">{profileData.name}</h1>

            {/* Degree and Speciality */}
            <div className="mt-2">
              <p className="text-lg text-gray-600">
                {profileData.degree} - {profileData.speciality}
              </p>
              <button className="mt-2 px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
                {profileData.experience} years of experience
              </button>
            </div>

            {/* About Section */}
            <div className="mt-4">
              <p className="text-gray-700 font-semibold">About:</p>
              {isEdit ? (
                <textarea
                  value={profileData.about}
                  onChange={(e) =>
                    setProfileData((prev) => ({ ...prev, about: e.target.value }))
                  }
                  className="w-full p-2 border rounded-lg"
                  rows="4"
                />
              ) : (
                <p className="text-gray-600 mt-1">{profileData.about}</p>
              )}
            </div>

            {/* Appointment Fee */}
            <div className="mt-4">
              <p className="text-gray-700 font-semibold">
                Appointment Fee:{' '}
                <span className="text-green-600">
                  {isEdit ? (
                    <input
                      type="number"
                      value={profileData.fees}
                      onChange={(e) =>
                        setProfileData((prev) => ({ ...prev, fees: e.target.value }))
                      }
                      className="w-24 p-2 border rounded-lg"
                    />
                  ) : (
                    `${currency}${profileData.fees}`
                  )}
                </span>
              </p>
            </div>

            {/* Address */}
            <div className="mt-4">
              <p className="text-gray-700 font-semibold">Address:</p>
              {isEdit ? (
                <>
                  <input
                    type="text"
                    value={profileData.address.line1}
                    onChange={(e) =>
                      setProfileData((prev) => ({
                        ...prev,
                        address: { ...prev.address, line1: e.target.value },
                      }))
                    }
                    className="w-full p-2 border rounded-lg"
                  />
                  <input
                    type="text"
                    value={profileData.address.line2}
                    onChange={(e) =>
                      setProfileData((prev) => ({
                        ...prev,
                        address: { ...prev.address, line2: e.target.value },
                      }))
                    }
                    className="w-full p-2 border rounded-lg mt-2"
                  />
                </>
              ) : (
                <>
                  <p className="text-gray-600">{profileData.address.line1}</p>
                  <p className="text-gray-600">{profileData.address.line2}</p>
                </>
              )}
            </div>

            {/* Availability */}
            <div className="mt-4 flex items-center">
              <input
                type="checkbox"
                checked={profileData.available}
                onChange={() =>
                  setProfileData((prev) => ({ ...prev, available: !prev.available }))
                }
                disabled={!isEdit}
                className="form-checkbox h-5 w-5 text-blue-600"
              />
              <label htmlFor="available" className="ml-2 text-gray-700">
                Available
              </label>
            </div>

            {/* Edit/Save Button */}
            <div className="mt-6">
              {isEdit ? (
                <button
                  onClick={updateProfile}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-200"
                >
                  Save Profile
                </button>
              ) : (
                <button
                  onClick={() => setIsEdit(true)}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
                >
                  Edit Profile
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorProfile;