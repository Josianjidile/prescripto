import bcrypt from "bcrypt";
import validator from "validator";
import cloudinary from "cloudinary";
import Doctor from "../models/doctorModel.js";
import User from "../models/userModel.js";
import Appointment from "../models/appointmentModel.js";
import jwt from "jsonwebtoken"

const addDoctor = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      speciality,
      degree,
      experience,
      about,
      fees,
      address,
      slot
    } = req.body;
    const imageFile = req.file;

    // Check if all fields are provided
    if (
      !name ||
      !email ||
      !password ||
      !speciality ||
      !degree ||
      !experience ||
      !about ||
      !fees ||
      !address
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Please fill in all fields" });
    }

    // Validate email
    if (!validator.isEmail(email)) {
      return res
        .status(400)
        .json({ success: false, message: "Please enter a valid email" });
    }

    // Validate password length
    if (password.length < 8) {
      return res
        .status(400)
        .json({ success: false, message: "Please enter a strong password" });
    }

    // Hashing doctor password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Upload image file to Cloudinary
    const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
      resource_type: "image",
    });
    const imageUrl = imageUpload.secure_url;

    // Create a new doctor
    const doctorData = {
      name,
      email,
      image: imageUrl,
      password: hashedPassword,
      speciality,
      degree,
      experience,
      about,
      fees,
      address: JSON.parse(address),
      date: Date.now(),
    };

    const newDoctor = new Doctor(doctorData);
    await newDoctor.save();

    res.json({ success: true, message: "Doctor added successfully" });
  } catch (error) {
    console.error("Error adding doctor:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

//API FOR ADMIN LOGIN

const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASSWORD
    ) {

        const token = jwt.sign(email+password,process.env.JWT_SECRET)
        res.json({success:true,token})
    } else {
      res.json({ success: false, message: "Invalid credentials" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, error: message.error });
  }
};

//api tyo get all doctors list for admnin panel
const getAllDoctors = async (req, res) => {
  try {

    const doctors = await Doctor.find({}).select('-password');

    // Check if doctors exist
    if (doctors.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No doctors found",
      });
    }

    res.json({
      success: true,
      doctors,
    });
  } catch (error) {
    console.error("Error fetching doctors:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

//get all appointment list

const appointmentsAdmin  = async (req,res) => {
  try {
    const appointments = await Appointment.find({})
    res.json({success:true,appointments})
  } catch (error) {
    console.error("Error fetching doctors appointment:", error);
    res.status(500).json({ success: false, message: error.message });
  }
}


//cancel appointment

const cancelAppointment = async (req, res) => {
  try {
    const {  appointmentId } = req.body;

    // Check if appointment exists
    const appointmentData = await Appointment.findById(appointmentId);
    if (!appointmentData) {
      return res
        .status(404)
        .json({ success: false, message: "Appointment not found" });
    }

   

    await Appointment.findByIdAndUpdate(appointmentId, { cancelled: true });

    //release doctor slot
    const { docId, slotDate, slotTime } = appointmentData;
    const doctorData = await Doctor.findById(docId);

    let slots_booked = doctorData.slots_booked;

    slots_booked[slotDate] = slots_booked[slotDate].filter(
      (e) => e !== slotTime
    );
    await Doctor.findByIdAndUpdate(docId, { slots_booked });

    return res.status(200).json({
      success: true,
      message: "Appointment canceled successfully",
    });
  } catch (error) {
    console.error("Error canceling appointment:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

//api to get dashboard data for admin

const adminDashboard = async (req,res) => {
  try {
      const doctors = await Doctor.find({})
      const users = await User.find({})
      const   appointments = await Appointment.find({})

      const dashData ={
        doctors:doctors.length,
        appointments:appointments.length,
         patients:users.length,
        latestAppointments: appointments.reverse().slice(0,5)
      }

      res.json({success:true, dashData})
  } catch (error) {
    console.error("Error in getting dashboard data", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}



export { addDoctor, loginAdmin,getAllDoctors,appointmentsAdmin ,cancelAppointment,adminDashboard};

