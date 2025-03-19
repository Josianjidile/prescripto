import React, { useContext, useState } from "react";
import { assets } from "../../assets/assets";
import { AdminContext } from "../../context/AdminContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const AddDoctor = () => {
  const [docImg, setDocImg] = useState(null); // Initialize as null
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [experience, setExperience] = useState("1 year");
  const [fees, setFees] = useState("");
  const [about, setAbout] = useState("");
  const [speciality, setSpeciality] = useState("General Physician");
  const [degree, setDegree] = useState("");
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");

  const { token, backendUrl } = useContext(AdminContext);

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    try {
      if (!docImg) {
        return toast.error("Please upload a doctor image");
      }

      if (!token || !backendUrl) {
        return toast.error("Authentication token or backend URL is missing");
      }

      const formData = new FormData();
      formData.append("image", docImg);
      formData.append("name", name);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("experience", experience);
      formData.append("fees", Number(fees));
      formData.append("about", about);
      formData.append("speciality", speciality);
      formData.append("degree", degree);
      formData.append("address", JSON.stringify({ line1: address1, line2: address2 }));

      // Send the formData to the backend
      const { data } = await axios.post(`${backendUrl}/api/admin/add-doctor`, formData, {
        headers: { token }, // Pass the token in headers
      });

      if (data.success) {
        toast.success(data.message);

        // Reset form fields after successful submission
        setDocImg(null);
        setName("");
        setEmail("");
        setPassword("");
        setExperience("1 year");
        setFees("");
        setAbout("");
        setSpeciality("General Physician");
        setDegree("");
        setAddress1("");
        setAddress2("");
      } else {
        toast.error(data.message || "Failed to add doctor");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || "An error occurred");
    }
  };

  return (
    <form onSubmit={onSubmitHandler} className="m-5 w-full">
      <p className="mb-3 text-lg font-medium">Add Doctor</p>
      <div className="bg-white px-8 py-8 border rounded w-full max-w-4xl max-h-[80vh] overflow-y-scroll">
        {/* Doctor Image Upload */}
        <div className="flex items-center gap-4 mb-8 text-gray-500">
          <label htmlFor="doc-image">
            <img
              className="w-16 bg-gray-100 rounded-full cursor-pointer"
              src={docImg ? URL.createObjectURL(docImg) : assets.upload_area}
              alt="Upload Doctor Picture"
            />
          </label>
          <input
            type="file"
            id="doc-image"
            name="image"
            onChange={(e) => setDocImg(e.target.files[0])}
            className="hidden"
          />
          <p>
            Upload doctor <br /> picture
          </p>
        </div>

        {/* Form Fields */}
        <div className="flex flex-col lg:flex-row items-start gap-10 text-gray-600">
          {/* Left Column */}
          <div className="w-full lg:w-1/2 flex flex-col gap-4">
            {/* Doctor Name */}
            <div className="flex-1 flex flex-col gap-1">
              <label htmlFor="name">Doctor Name</label>
              <input
                className="border rounded px-3 py-2 w-full"
                type="text"
                id="name"
                name="name"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            {/* Doctor Email */}
            <div className="flex-1 flex flex-col gap-1">
              <label htmlFor="email">Doctor Email</label>
              <input
                className="border rounded px-3 py-2 w-full"
                type="email"
                id="email"
                name="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* Doctor Password */}
            <div className="flex-1 flex flex-col gap-1">
              <label htmlFor="password">Doctor Password</label>
              <input
                className="border rounded px-3 py-2 w-full"
                type="password"
                id="password"
                name="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {/* Experience */}
            <div className="flex-1 flex flex-col gap-1">
              <label htmlFor="experience">Experience</label>
              <select
                className="border rounded px-3 py-2 w-full"
                id="experience"
                name="experience"
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                required
              >
                <option value="">Select Experience</option>
                {[...Array(10)].map((_, i) => (
                  <option key={i + 1} value={`${i + 1} year`}>
                    {i + 1} year
                  </option>
                ))}
              </select>
            </div>

            {/* Fees */}
            <div className="flex-1 flex flex-col gap-1">
              <label htmlFor="fee">Fee</label>
              <input
                className="border rounded px-3 py-2 w-full"
                type="number"
                id="fee"
                name="fee"
                placeholder="Fee"
                value={fees}
                onChange={(e) => setFees(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Right Column */}
          <div className="w-full lg:w-1/2 flex flex-col gap-4">
            {/* Speciality */}
            <div className="flex-1 flex flex-col gap-1">
              <label htmlFor="speciality">Speciality</label>
              <select
                className="border rounded px-3 py-2 w-full"
                id="speciality"
                name="speciality"
                value={speciality}
                onChange={(e) => setSpeciality(e.target.value)}
                required
              >
                <option value="">Select Speciality</option>
                <option value="General Physician">General Physician</option>
                <option value="Gynecologist">Gynecologist</option>
                <option value="Dermatologist">Dermatologist</option>
                <option value="Pediatricians">Pediatricians</option>
                <option value="Neurologist">Neurologist</option>
                <option value="Gastroenterologist">Gastroenterologist</option>
              </select>
            </div>

            {/* Education */}
            <div className="flex-1 flex flex-col gap-1">
              <label htmlFor="education">Education</label>
              <input
                className="border rounded px-3 py-2 w-full"
                type="text"
                id="education"
                name="education"
                placeholder="Education"
                value={degree}
                onChange={(e) => setDegree(e.target.value)}
                required
              />
            </div>

            {/* Address */}
            <div className="flex-1 flex flex-col gap-1">
              <label htmlFor="address1">Address</label>
              <input
                className="border rounded px-3 py-2 w-full"
                type="text"
                id="address1"
                name="address1"
                placeholder="Address 1"
                value={address1}
                onChange={(e) => setAddress1(e.target.value)}
                required
              />
              <input
                className="border rounded px-3 py-2 mt-2 w-full"
                type="text"
                id="address2"
                name="address2"
                placeholder="Address 2"
                value={address2}
                onChange={(e) => setAddress2(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* About Section */}
        <div className="mt-4">
          <label htmlFor="about">About</label>
          <textarea
            className="border rounded px-3 py-2 w-full"
            id="about"
            name="about"
            placeholder="Write about doctor"
            rows={5}
            value={about}
            onChange={(e) => setAbout(e.target.value)}
            required
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="mt-6 bg-blue-500 text-white px-6 py-2 rounded-full w-full hover:bg-blue-600"
        >
          Add Doctor
        </button>
      </div>
    </form>
  );
};

export default AddDoctor;