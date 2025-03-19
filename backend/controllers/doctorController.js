import Doctor from "../models/doctorModel.js";
import bcrypt from "bcrypt";
import validator from "validator";
import jwt from "jsonwebtoken";
import Appointment from "../models/appointmentModel.js";

const changeDoctorAvailability = async (req, res) => {
  try {
    const { docId } = req.body;

    const docData = await Doctor.findById(docId);
    await Doctor.findByIdAndUpdate(docId, { available: !docData.available });
    res.json({ success: true, message: "Availability Changed" });
  } catch (error) {
    console.error("Error changing doctor availability:", error);
    return {
      success: false,
      message: error.response?.data?.message || error.message,
    };
  }
};

//get doctor list

const doctorList = async (req, res) => {
  try {
    const doctors = await Doctor.find({}).select([-"password", "-email"]);

    res.json({ success: true, doctors });
  } catch (error) {
    console.error("Error fetching doctors:", error);
    return {
      success: false,
      message: error.response?.data?.message || error.message,
    };
  }
};

//doctor login

const loginDoctor = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    // Check if user exists
    const doctor = await Doctor.findOne({ email });
    if (!doctor) {
      return res
        .status(401)
        .json({ success: false, message: "User does not exist" });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, doctor.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid email or password" });
    }

    // Generate JWT token
    const dToken = jwt.sign({ id: doctor._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    console.log("Generated token:", dToken); // Debugging

    res.status(200).json({
      success: true,
      message: "Login successful",
      dToken,
      doctor: {
        id: doctor._id,
        name: doctor.name,
        email: doctor.email,
      },
    });
  } catch (error) {
    console.error("Error logging in user:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// API GET DOCTOR APPOINTMENT FOR DOCTOR Panel

// Fetch appointments for a specific doctor
const appointmentsDoctor = async (req, res) => {
  try {
    if (!req.doctor) {
      return res.status(401).json({ success: false, message: "Unauthorized, no doctor found" });
    }

    const doctorId = req.doctor._id; // Get from auth middleware
    console.log("Doctor ID from middleware:", doctorId); // Debugging

    const appointments = await Appointment.find({ docId: doctorId }); // Fetch appointments
    console.log("Appointments fetched:", appointments);

    res.json({ success: true, appointments });
  } catch (error) {
    console.error("Error in loading doctor appointment:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Mark appointment as complete
const appointmentComplete = async (req, res) => {
  try {
    const { appointmentId } = req.body; // Only need appointmentId, docId is from middleware
    if (!req.doctor) {
      return res.status(401).json({ success: false, message: "Unauthorized, no doctor found" });
    }

    const docId = req.doctor._id; // Get docId from the middleware (auth)

    const appointmentData = await Appointment.findById(appointmentId);

    if (appointmentData && appointmentData.docId.toString() === docId.toString()) {
      await Appointment.findByIdAndUpdate(appointmentId, { isCompleted: true });
      return res.json({ success: true, message: "Appointment completed" });
    } else {
      return res.json({ success: false, message: "Marking as complete failed" });
    }
  } catch (error) {
    console.error("Error in completing appointment:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Cancel appointment
const appointmentCancelled = async (req, res) => {
  try {
    const { appointmentId } = req.body; // Only need appointmentId, docId is from middleware
    if (!req.doctor) {
      return res.status(401).json({ success: false, message: "Unauthorized, no doctor found" });
    }

    const docId = req.doctor._id; // Get docId from the middleware (auth)

    const appointmentData = await Appointment.findById(appointmentId);

    if (appointmentData && appointmentData.docId.toString() === docId.toString()) {
      await Appointment.findByIdAndUpdate(appointmentId, { cancelled: true });
      return res.json({ success: true, message: "Appointment cancelled" });
    } else {
      return res.json({ success: false, message: "Cancellation failed" });
    }
  } catch (error) {
    console.error("Error in canceling appointment:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};


// get dashboard from doctor panel 
const doctorDashboard = async (req, res) => {
  try {
    // Use doctor ID from authenticated doctor in middleware
    const doctorId = req.doctor._id;
    console.log("Doctor ID from middleware:", doctorId); // Debugging

    if (!doctorId) {
      return res.status(401).json({ success: false, message: "Unauthorized, no doctor found" });
    }

    // Fetch appointments for the doctor
    const appointments = await Appointment.find({ docId: doctorId });
    console.log("Appointments:", appointments); // Debugging

    let earnings = 0;
    let patients = [];

    // Loop through appointments to calculate earnings and patients
    appointments.forEach((item) => {
      if (item.isCompleted || item.payment) {
        earnings += item.amount;
      }

      if (!patients.includes(item.userId)) {
        patients.push(item.userId);
      }
    });

    // Get the latest appointments (up to 5)
    

    // Prepare dashboard data
    const dashData = {
      earnings,
      appointments: appointments.length,
      patients: patients.length,
      latestAppointment: appointments.reverse().slice(0,5),
    };

    console.log("Dash Data:", dashData); // Debugging

    res.json({ success: true, dashData });
  } catch (error) {
    console.error("Error in doctorDashboard:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

  // Get doctor profile
const doctorProfile = async (req, res) => {
  try {
    if (!req.doctor) {
      return res.status(401).json({ success: false, message: "Unauthorized, no doctor found" });
    }

    const doctorId = req.doctor._id; // Get doctor ID from auth middleware
    console.log("Doctor ID from middleware:", doctorId); // Debugging

    const profileData = await Doctor.findById(doctorId).select("-password");

    if (!profileData) {
      return res.status(404).json({ success: false, message: "Doctor profile not found" });
    }

    res.json({ success: true, profileData });
  } catch (error) {
    console.error("Error in fetching doctor profile:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Update doctor profile
const updateDoctorProfile = async (req, res) => {
  try {
    if (!req.doctor) {
      return res.status(401).json({ success: false, message: "Unauthorized, no doctor found" });
    }

    const doctorId = req.doctor._id; // Get doctor ID from auth middleware
    console.log("Updating doctor profile for ID:", doctorId); // Debugging

    const { fees, address, available } = req.body;

    const updatedProfile = await Doctor.findByIdAndUpdate(
      doctorId,
      { fees, address, available },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedProfile) {
      return res.status(404).json({ success: false, message: "Doctor profile update failed" });
    }

    res.json({ success: true, message: "Profile updated successfully", updatedProfile });
  } catch (error) {
    console.error("Error in updating doctor profile:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};



export { changeDoctorAvailability, doctorList,loginDoctor,appointmentsDoctor ,appointmentComplete,appointmentCancelled,doctorDashboard,updateDoctorProfile,doctorProfile};
