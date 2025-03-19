import React, { useContext, useState } from "react";
import axios from "axios";
import { assets } from "../assets/assets";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";

const MyProfile = () => {
  const [isEdit, setIsEdit] = useState(false);
  const [image, setImage] = useState(null);
  const { userData, setUserData, token, backendUrl, loadUserProfileData } =
    useContext(AppContext);

  const updateUserProfileData = async () => {
    try {
      const formData = new FormData();
      formData.append("name", userData.name);
      formData.append("phone", userData.phone);
      formData.append("email", userData.email);
      formData.append("address", JSON.stringify(userData.address));
      formData.append("gender", userData.gender);
      formData.append("dob", userData.dob);
      if (image) {
        formData.append("image", image);
      }

      const { data } = await axios.post(
        `${backendUrl}/api/user/update-profile`,
        formData,
        { headers: { token, "Content-Type": "multipart/form-data" } }
      );

      if (data.success) {
        toast.success(data.message);
        loadUserProfileData();
        setIsEdit(false);
        setImage(null);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Failed to update profile");
    }
  };

  // Handle Image Upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setUserData((prev) => ({ ...prev, image: URL.createObjectURL(file) }));
    }
  };

  return (
    userData && (
      <div className="p-6 sm:p-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">My Profile</h1>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-8">
          <div className="w-full sm:w-1/3">
            {isEdit ? (
              <label>
                <div>
                  <img
                    src={userData.image}
                    alt="Profile"
                    className="w-48 h-48 rounded-full mx-auto object-cover border-4 border-primary"
                  />
                  {!userData.image && (
                    <img
                      src={assets.upload_icon}
                      alt="Upload"
                      className="w-8 h-8 mx-auto mt-2 cursor-pointer"
                    />
                  )}
                </div>
                <input onChange={handleImageChange} type="file" hidden />
              </label>
            ) : (
              <img
                src={userData.image}
                alt="Profile"
                className="w-48 h-48 rounded-full mx-auto object-cover border-4 border-primary"
              />
            )}
          </div>

          <div className="w-full sm:w-2/3">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Name
              </label>
              {isEdit ? (
                <input
                  type="text"
                  value={userData.name}
                  onChange={(e) =>
                    setUserData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  className="w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              ) : (
                <p className="text-gray-900">{userData.name}</p>
              )}
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              {isEdit ? (
                <input
                  type="email"
                  value={userData.email}
                  onChange={(e) =>
                    setUserData((prev) => ({ ...prev, email: e.target.value }))
                  }
                  className="w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              ) : (
                <p className="text-gray-900">{userData.email}</p>
              )}
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Phone
              </label>
              {isEdit ? (
                <input
                  type="text"
                  value={userData.phone}
                  onChange={(e) =>
                    setUserData((prev) => ({ ...prev, phone: e.target.value }))
                  }
                  className="w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              ) : (
                <p className="text-gray-900">{userData.phone}</p>
              )}
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Address
              </label>
              {isEdit ? (
                <>
                  <input
                    type="text"
                    value={userData.address.line1}
                    onChange={(e) =>
                      setUserData((prev) => ({
                        ...prev,
                        address: { ...prev.address, line1: e.target.value },
                      }))
                    }
                    className="w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Address Line 1"
                  />
                  <input
                    type="text"
                    value={userData.address.line2}
                    onChange={(e) =>
                      setUserData((prev) => ({
                        ...prev,
                        address: { ...prev.address, line2: e.target.value },
                      }))
                    }
                    className="w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Address Line 2"
                  />
                </>
              ) : (
                <p className="text-gray-900">
                  {userData.address?.line1}
                  {userData.address?.line2 && `, ${userData.address.line2}`}
                </p>
              )}
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Gender
              </label>
              {isEdit ? (
                <select
                  value={userData.gender}
                  onChange={(e) =>
                    setUserData((prev) => ({ ...prev, gender: e.target.value }))
                  }
                  className="w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              ) : (
                <p className="text-gray-900">{userData.gender}</p>
              )}
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Date of Birth
              </label>
              {isEdit ? (
                <input
                  type="date"
                  value={userData.dob}
                  onChange={(e) =>
                    setUserData((prev) => ({ ...prev, dob: e.target.value }))
                  }
                  className="w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              ) : (
                <p className="text-gray-900">{userData.dob}</p>
              )}
            </div>

            <button
              onClick={() => (isEdit ? updateUserProfileData() : setIsEdit(true))}
              className="w-full sm:w-auto px-6 py-2 bg-white text-gray-600 rounded-full hover:bg-primary transition-colors duration-300 border border-gray-300"
            >
              {isEdit ? "Save Information" : "Edit"}
            </button>
          </div>
        </div>
      </div>
    )
  );
};

export default MyProfile;
