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

const userProfileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  email: { type: String},
  firstName: { type: String },
  lastName: { type: String },
  updatedAt: { type: Date, default: Date.now }
});

const UserProfile = mongoose.model('UserProfile', userProfileSchema);

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

    const userProfile = new UserProfile({ userId: savedUser._id, email: savedUser.email });
    await userProfile.save();

    console.log("User saved successfully:", savedUser);
    res.status(201).json({ message: "User registered successfully" }); // Send success response
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Internal Server Error" }); // Send error response
  }
};

// Authenticates a user logging in
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

    const isValid = await bcrypt.compare(password, storedHashPassword);

    if (isValid) {
      console.log("Existing user id: " + existingUser._id);
      const token = jsonwebtoken.sign({ id: existingUser._id, username: existingUser.email}, secretKey, { expiresIn: expiresIn});
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

// Logs the user out 
const logout = async (req, res) => {
  try {
    console.log("Received logout request:"); // Log incoming request body

    console.log("User successfully logged out:", User);
    res.status(200).json({ message: "Logout successful!" }); // Send success response
    } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ message: "Internal Server Error" }); // Send error response
  }
};

// Displays user first and last name
const userinfo = async (req, res) => {

  const token = req.headers['Authorization'] || req.headers['authorization'].split(' ')[1];;
  if (!token) return res.status(404).json({ message: "User does not exist or ID not in token"});

  try {
    console.log("Received get user info request:"); // Log user info get request

    const decoding = jsonwebtoken.decode(token);

    const decoded = jsonwebtoken.verify(token, secretKey);
    const userId = decoded.id;

    const userProfile = await UserProfile.findOne({ userId });
    if (!userProfile) return res.status(404).json({ message: "Profile not found" });

    res.status(200).json({ message: "User data found", userProfile })

  } catch (error) {
    console.error("userinfo error:", error);
    res.status(500).json({ message: "Unexpected server error" });
  }
};

// Updates user first and last name
const updateProfile = async (req, res) => {
 
  const token = req.headers['Authorization'] || req.headers['authorization'].split(' ')[1];;
  
  if (!token) return res.status(404).json({ message: "Token not found" });

  try {
    console.log("Received update profile request: ");

    const decoding = jsonwebtoken.decode(token);

    const decoded = jsonwebtoken.verify(token, secretKey);
    const userId = decoded.id;

    if (!userId) {
      console.log("Missing user ID");
      res.status(400).json({ message: "Missing user ID or required fields "});
    }

    const { firstName, lastName } = req.body;

    const updatedProfile = await UserProfile.findOneAndUpdate( 
      { userId },
      { firstName, lastName, updatedAt: new Date() },
      { new: true }
    );

    console.log("User profile updated!", updatedProfile);
    res.status(200).json({ message: "Profile updated! "});    
  } catch (error) {
    console.log("Update profile error: ", error);
    res.status(500).json({ message: "Internal server error "});
  }
};

// Search for users
const search = async (req, res) => {
  const { query } = req.query;

  try {
    console.log("Recieved search request: ", req.body);

    const { searchTerm } = req.body;

    if (!searchTerm) {
      console.log("Missing search term");
      res.status(400).json({ message: "Missing search term" });
    }

    const regex = new RegExp(searchTerm, 'i');

    const user_search = await UserProfile.find({
      $or: [
        { firstName: { $regex: regex } }, 
        { lastName: { $regex: regex } }
      ]
    }).exec();

    
    if (user_search.length === 0) {
      console.log("No users found");
      res.status(400).json([]);
    } else {
      console.log("Users found");
      res.status(200).json(user_search);
      }

  } catch (error) {
    console.log("User search error ", error);
    res.status(500).json({ message: "Unexpected server error" });
  }
};

// Displays all users except self
const allContacts = async (req, res) => {
  
  const token = req.headers['Authorization'] || req.headers['authorization'].split(' ')[1];;

  if (!token) return res.status(404).json({ message: "Token not found" });

  try {
    console.log("Received get all users request: ");

    const decoded = jsonwebtoken.verify(token, secretKey);
    const userId = decoded.id;

    const user_search = await UserProfile.find({
      userId: { $ne: userId } 
    }).exec();

    console.log("Users found");
    res.status(200).json(user_search);

  } catch (error) {
    console.log("Get all users error", error);
    res.status(500).json({ message: "Unexpected server or database error "});
  }
};


// Define the router and endpoint
const authRoutes = Router();
const contactRoutes = Router();
app.use("/api/auth", authRoutes);
app.use("/api/contacts", contactRoutes);

// POST /api/auth/signup
authRoutes.post("/signup", signup);

// POST /api/auth/login
authRoutes.post("/login", login);

// POST /api/auth/logout
authRoutes.post("/logout", logout);

// GET /api/auth/userinfo
authRoutes.get("/userinfo", userinfo);

// POST /api/auth/update-profile
authRoutes.post("/update-profile", updateProfile);

// POST /api/contacts/search
contactRoutes.post("/search", search);

// GET /api/contacts/all-contacts
contactRoutes.get("/all-contacts", allContacts);

// Connect to MongoDB using Mongoose
mongoose
  .connect(DATABASE_URL) // Connect to the database using the URL from environment variables
  .then(() => console.log("MongoDB connected successfully")) // Log success message
  .catch((err) => console.error("MongoDB connection error:", err)); // Log error if connection fails

// Start the Express server and listen on the specified port
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});