import express from "express";
import upload from "../middlewares/multer.js";
import {addDoctor,adminDashboard,appointmentsAdmin,cancelAppointment,getAllDoctors,loginAdmin} from "../controllers/adminController.js";
import authAdmin from "../middlewares/authMiddleware.js";
import { changeDoctorAvailability } from "../controllers/doctorController.js";

const adminRouter = express.Router();

adminRouter.post("/add-doctor",authAdmin, upload.single('image'), addDoctor);
adminRouter.post("/login",loginAdmin);
adminRouter.get("/all-doctors",authAdmin,getAllDoctors);
adminRouter.post("/change-availability",authAdmin,changeDoctorAvailability);
adminRouter.get("/appointments",authAdmin,appointmentsAdmin);
adminRouter.post("/cancel-appointment",authAdmin,cancelAppointment);
adminRouter.get("/dashboard",authAdmin,adminDashboard);

export default adminRouter;
