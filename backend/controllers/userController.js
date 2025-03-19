import bcrypt from "bcrypt";
import User from "../models/userModel.js";
import Doctor from "../models/doctorModel.js";
import validator from "validator";
import jwt from "jsonwebtoken";
import { v2 as cloudinary } from "cloudinary";
import Appointment from "../models/appointmentModel.js";
import razorpay from "razorpay";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate input
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    // Validate email
    if (!validator.isEmail(email)) {
      return res
        .status(400)
        .json({ success: false, message: "Enter a valid email" });
    }

    // Validate password length
    if (password.length < 8) {
      return res
        .status(400)
        .json({ success: false, message: "Please enter a strong password" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "Email already in use" });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const userData = {
      name,
      email,
      password: hashedPassword,
    };

    const newUser = new User(userData);
    const user = await newUser.save();

    // Generate JWT token (Fixed the issue)
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(201).json({ success: true, token });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

//api for user login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "User does not exist" });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid email or password" });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Error logging in user:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

//API TO GET USER PROFILE

const getProfile = async (req, res) => {
  try {
    const { userId } = req.body;

    const userData = await User.findById(userId).select("-password");

    res.status(200).json({ success: true, userData });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

const updateUserProfile = async (req, res) => {
  try {
    const { userId, phone, name, email, address, dob, gender } = req.body;
    const imageFile = req.file; // Assuming you're using Multer for file uploads

    // Validate required fields
    if (!userId || !name || !phone || !dob || !gender) {
      return res.status(400).json({ message: "Missing required data" });
    }

    // Check if the user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Parse address if provided
    let parsedAddress = null;
    if (address) {
      try {
        parsedAddress = JSON.parse(address);
      } catch (error) {
        return res.status(400).json({ message: "Invalid address format" });
      }
    }

    // Prepare update data
    const updateData = {
      name,
      phone,
      address: parsedAddress || user.address, // Use existing address if not provided
      dob,
      gender,
    };

    // Update image if provided
    if (imageFile) {
      try {
        const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
          resource_type: "image",
        });
        updateData.image = imageUpload.secure_url;
      } catch (error) {
        console.error("Error uploading image to Cloudinary:", error);
        return res.status(500).json({ message: "Error uploading image" });
      }
    }

    // Update user profile in the database
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true } // Return the updated document
    );

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      userData: updatedUser, // Return updated user data
    });
  } catch (error) {
    console.error("Error updating user profile:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

//api to book appointment

const bookAppointment = async (req, res) => {
  try {
    const { userId, docId, slotDate, slotTime } = req.body;

    // Fetch the doctor's data
    const docData = await Doctor.findById(docId).select("-password");

    if (!docData.available) {
      return res
        .status(400)
        .json({ success: false, message: "Doctor not available" });
    }

    // Initialize slots_booked if it's undefined
    if (!docData.slots_booked) {
      docData.slots_booked = {};
    }

    let slots_booked = docData.slots_booked;

    // Check if the slot is already booked
    if (slots_booked[slotDate] && slots_booked[slotDate].includes(slotTime)) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Slot already booked. Please try another slot.",
        });
    }

    // If the slot is available, add it to the booked slots
    if (slots_booked[slotDate]) {
      slots_booked[slotDate].push(slotTime);
    } else {
      slots_booked[slotDate] = [slotTime];
    }

    // Fetch user data
    const userData = await User.findById(userId).select("-password");

    // Create the appointment
    const appointmentData = {
      userId,
      docId,
      slotDate,
      slotTime,
      userData,
      docData,
      amount: docData.fees,
      date: Date.now(),
    };

    const newAppointment = new Appointment(appointmentData);
    await newAppointment.save();

    // Update the doctor's slots_booked field in the database
    await Doctor.findByIdAndUpdate(docId, { slots_booked });

    res.status(201).json({
      success: true,
      message: "Appointment booked successfully",
    });
  } catch (error) {
    console.error("Error booking appointment:", error);
    res.status(500).json({ message: "Server error. Please try again." });
  }
};

//api for appointment for frontend my appointment

const listAppointment = async (req, res) => {
  try {
    const { userId } = req.body;
    const appointments = await Appointment.find({ userId });
    res.json({ success: true, appointments });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// cancel appointment
const cancelAppointment = async (req, res) => {
  try {
    const { userId, appointmentId } = req.body;

    // Check if appointment exists
    const appointmentData = await Appointment.findById(appointmentId);
    if (!appointmentData) {
      return res
        .status(404)
        .json({ success: false, message: "Appointment not found" });
    }

    // Verify appointment belongs to the user
    if (appointmentData.userId !== userId) {
      return res
        .status(403)
        .json({
          success: false,
          message: "Unauthorized to cancel this appointment",
        });
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

const razorpayInstance = new razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET_KEY,
});

// API to make a payment using Razorpay
const paymentRazorpay = async (req, res) => {
  try {
    const { appointmentId } = req.body;
    const appointmentData = await Appointment.findById(appointmentId);

    if (!appointmentData || appointmentData.cancelled) {
      return res
        .status(500)
        .json({
          success: false,
          message: "Appointment cancelled or data not found",
        });
    }

    // Create options for Razorpay payment
    const options = {
      amount: appointmentData.amount * 100,
      currency: process.env.CURRENCY,
      receipt: appointmentId,
    };

    // Create an order
    const order = await razorpayInstance.orders.create(options);
    res.json({ success: true, order });
  } catch (error) {
    console.error("Error in paying for appointment:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

//api to verify payment for razorpay

const verifyRazorPay = async (req,res) => {
 try {
  const { razorpay_order_id } = req.body;
  const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id)
   if (orderInfo.status === 'paid') {
      await Appointment.findByIdAndUpdate(orderInfo.receipt,{payment:true})
      res.status(200).json({ success: true, message: "payment successfully" });
   }
 } catch (error) {
  res.status(500).json({ success: false, message: "payment failed" });
 }

  
};

export {
  registerUser,
  getProfile,
  loginUser,
  updateUserProfile,
  bookAppointment,
  listAppointment,
  cancelAppointment,
  paymentRazorpay,
  verifyRazorPay,
};
