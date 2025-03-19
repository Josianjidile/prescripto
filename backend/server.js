import express from "express";
import cors from "cors";
import dotenv from "dotenv"; // Corrected import
import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";
import adminRouter from "./routes/adminRoute.js";
import doctorRouter from "./routes/doctorRoute.js";
import userRouter from "./routes/userRoute.js";

// Initialize dotenv to load environment variables
dotenv.config();
connectCloudinary()

// App configuration
const app = express();
const port = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();


// Middleware
app.use(cors());
app.use(express.json());


// API endpoints
app.use("/api/admin",adminRouter)
app.use("/api/doctor",doctorRouter)
app.use("/api/user",userRouter)


app.get('/', (req, res) => {
  res.send("API working");
});

// Start server
app.listen(port, () => console.log(`Server started on port ${port}`));
