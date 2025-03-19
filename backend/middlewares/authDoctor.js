import jwt from "jsonwebtoken";
import Doctor from "../models/doctorModel.js";
import Appointment from "../models/appointmentModel.js"; // Ensure you have this model

const authDoctor = async (req, res, next) => {
  console.log("Headers received in middleware:", req.headers); // Debugging

  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
    try {
      token = req.headers.authorization.split(" ")[1]; // Extract token
      console.log("Token extracted:", token); // Debugging

      const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify token
      console.log("Decoded token:", decoded); // Debugging

      req.doctor = await Doctor.findById(decoded.id).select("-password"); // Fetch doctor
      console.log("Doctor found in DB:", req.doctor); // Debugging

      if (!req.doctor) {
        console.error("No doctor found with this ID:", decoded.id);
        return res.status(404).json({ success: false, message: "Doctor not found" });
      }

      next(); // Proceed to the next middleware or controller
    } catch (error) {
      console.error("Token verification failed:", error);
      return res.status(401).json({ success: false, message: "Invalid token" });
    }
  } else {
    console.log("No Authorization header found");
    return res.status(401).json({ success: false, message: "No token provided" });
  }
};


export default authDoctor ;
