import express, { Router } from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import * as bcrypt from 'bcrypt'
import jsonwebtoken from 'jsonwebtoken';

const secretKey = 'ALDNVBLSIKEJ123KFJ#$K!KJFDLK@J#!'
const expiresIn = '1h';

dotenv.config(); // Load environment variables from .env file

const app = express(); // Create an Express application
const PORT = process.env.PORT || 8747; // Define the port number (from environment variables or default 8747)
const DATABASE_URL = process.env.DATABASE_URL; // Load MongoDB connection string from environment variables

// Middleware to enable CORS (Cross-Origin Resource Sharing)
app.use(
  cors({
    origin: process.env.ORIGIN, // Allow requests only from this frontend domain (defined in .env)
    credentials: true, // Allow cookies and authentication headers in cross-origin requests
  })
);

// Middleware to parse incoming JSON requests
app.use(express.json());

// Define a user schema for MongoDB
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true }, // Email is required and must be unique
  password: { type: String, required: true }, // Password is required
});

// Create a Mongoose model for the "users" collection
const User = mongoose.model("User", userSchema);

const signup = async (req, res) => {
  try {
    console.log("Received signup request:", req.body); // Log incoming request body

    // Extract email and password from request body
    const { email, password } = req.body;

    // Validate that email and password are provided
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    // Check if the user already exists in the database
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user document
    const newUser = new User({ email, password: hashedPassword });
    const savedUser = await newUser.save(); // Save the user to MongoDB

    console.log("User saved successfully:", savedUser);
    res.status(201).json({ message: "User registered successfully" }); // Send success response
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Internal Server Error" }); // Send error response
  }
};

const login = async (req, res) => {
  try {
    console.log("Received login request:", req.body); // Log incoming request body

    // Extract email and password from request body
    const { email, password } = req.body;

    // Validate that email and password are provided
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    // Check if the user already exists in the database
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(404).json({ message: "Email does not exist" });
    }

    const storedHashPassword = existingUser.password;

    // Create a new user document
    //const newUser = new User({ email, password: hashedPassword });
    //const savedUser = await newUser.save(); // Save the user to MongoDB

    const isValid = await bcrypt.compare(password, storedHashPassword);

    if (isValid) {
      console.log("Existing user id: " + existingUser._id);
      const token = jsonwebtoken.sign({ id: existingUser._id, username: existingUser.email}, secretKey, { expiresIn: expiresIn});
      //console.log(token);
      console.log("User successfully logged in:", User);
      res.status(200).json({ message: "Login successful!", token: token }); // Send success response
    } else {
      console.log("User failed to login")
      res.status(400).json({ message: "Missing email or password, or invalid password"})
    }
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal Server Error" }); // Send error response
  }
};

const logout = async (req, res) => {
  try {
    console.log("Received logout request:"); // Log incoming request body

      //console.log(token);
    console.log("User successfully logged in:", User);
    res.status(200).json({ message: "Logout successful!" }); // Send success response
    } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ message: "Internal Server Error" }); // Send error response
  }
};


// Define the router and endpoint
const authRoutes = Router();
app.use("/api/auth", authRoutes);

// POST /api/auth/signup
authRoutes.post("/signup", signup);

// POST /api/auth/login
authRoutes.post("/login", login);

// POST /api/auth/logout
authRoutes.post("/logout", logout);

// Connect to MongoDB using Mongoose
mongoose
  .connect(DATABASE_URL) // Connect to the database using the URL from environment variables
  .then(() => console.log("MongoDB connected successfully")) // Log success message
  .catch((err) => console.error("MongoDB connection error:", err)); // Log error if connection fails

// Start the Express server and listen on the specified port
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});