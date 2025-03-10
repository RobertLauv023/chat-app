import express, { Router } from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import * as bcrypt from 'bcrypt'
import jsonwebtoken from 'jsonwebtoken';
import  { Server as SocketServer } from "socket.io";

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


// ------ Comment out below to try tests -------------------------

await connectDB(DATABASE_URL);
console.log("MongoDB connected successfully");

// Now start the server listening
const server = app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});

  const io = new SocketServer(server, 
    {

        cors: {
          origin: "http://localhost:5173",
          credentials: true,
        },
      });

// ---------------------------------------------------------------

// Define a user schema for MongoDB
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true }, // Email is required and must be unique
  password: { type: String, required: true }, // Password is required
});

// Create a Mongoose model for the "users" collection
export const User = mongoose.model("User", userSchema);


// Define a user profile schema for MongoDB
const userProfileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  email: { type: String},
  firstName: { type: String },
  lastName: { type: String },
  updatedAt: { type: Date, default: Date.now }
});

// Create a Mongoose model for the "userprofile" collection
export const UserProfile = mongoose.model('UserProfile', userProfileSchema);

// Define a chat room schema for MongoDB
const chatRoomSchema = new mongoose.Schema({
    roomName: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  });
// Create a Mongoose model for the "chatroom" collection
export const Chatroom = mongoose.model('ChatRoom', chatRoomSchema);

// Define a message schema for MongoDB
const messageSchema = new mongoose.Schema({
    roomName: { type: String, required: false },
    sender: { type: String, required: true },
    recipient: { type: String, required: false }, // Only used for direct messages
    message: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
  });
  
export const Message = mongoose.model('Message', messageSchema);

// Function to deal with user signup and saving into MongoDB
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
      return res.status(409).json({ message: "Email already registered" });
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

// Gets information about the currently logged in user
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

    console.log("User profile found");
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
      return;
    }

    const { firstName, lastName } = req.body;

    if (!firstName || !lastName) {
        console.log("Missing firstName or lastName ");
        res.status(400).json({ message: "Missing first name or last name fields" });
        return;
    }

    const updatedProfile = await UserProfile.findOneAndUpdate( 
      { userId },
      { firstName, lastName, updatedAt: new Date() },
      { new: true }
    );

    console.log("User profile updated!", updatedProfile);
    res.status(200).json({ message: "Profile updated!"});    
  } catch (error) {
    console.log("Update profile error: ", error);
    res.status(500).json({ message: "Internal server error "});
  }
};

// Search for users
const search = async (req, res) => {
  const { query } = req.query;

  try {
    console.log("Received search request: ", req.body);

    const { searchTerm } = req.body;

    if (!searchTerm) {
      console.log("Missing search term");
      res.status(400).json({ message: "Missing search term" });
      return;
    } else {

    const regex = new RegExp(searchTerm, 'i');

    const user_search = await UserProfile.find({
      $or: [
        { firstName: { $regex: regex } }, 
        { lastName: { $regex: regex } }
      ]
    });

    
    if (user_search.length === 0) {
      console.log("No users found");
      res.status(400).json([]);
    } else {
      console.log("Users found");
      res.status(200).json(user_search);
    }
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

// Creates a chatroom by specified name
const createChatroom = async (req, res) => {
    try {
        console.log("Received chatroom creation request");

        const { roomName } = req.body;

        if (!roomName) {
            console.log("Missing room name");
            res.status(400).json({ message: "Missing room name field" });
            return;
        }

        const existingRoom = await Chatroom.findOne({ roomName });
        if (existingRoom) {
            console.log("Room name already exists");
            res.status(409).json({ message: "Room name already exists" });
            return;
        }

        const newChatroom = new Chatroom({ roomName, createdAt: new Date()});
        const savedChatroom = await newChatroom.save();

        console.log("Chatroom created!", savedChatroom);
        res.status(201).json({ message: "Chatroom created!"});
    } catch (error) {
        console.log("Chatroom creation error", error);
        res.status(500).json({ message: "Internal server error"});
    }
};

// Get a list of all of the chatrooms
const getChatrooms = async (req, res) => {
    try {
        console.log("Received get all chatrooms request");

        //const chatroom_list = await Chatroom.find().exec();
        const chatroom_list = await Chatroom.find();
        
        if (chatroom_list.length === 0) {
            console.log("No chatrooms found");
            res.status(400).json([]);
        } else {
            console.log("Chatrooms found!", chatroom_list);
            res.status(200).json(chatroom_list);
            
        }
    } catch (error) {
        console.log("Get all chatrooms error", error);
        res.status(500).json({ message: "Internal service error"});
    }
};

// Delete a specified chatroom by name, and in turn, deleting any messages
// associated with that chat room
const deleteChatrooms = async (req, res) => {
  try {
    console.log("Received chatroom deletion request");

    const { roomName } = req.body;

    if (!roomName) {
      console.log("Missing or invalid room name field");
      res.status(400).json({ message: "Missing or invalid room name field" });
      return;
    }

    const deletedRoom = await Chatroom.deleteOne({ roomName });
    const deletedMessages = await Message.deleteMany({ roomName });

    if (deletedRoom.deletedCount === 0) {
      console.log("Chatroom does not exist");
      res.status(404).json({ message: "Chatroom does not exist" });
      return;
    }

    console.log("Chatroom deleted!", deletedRoom);
    res.status(200).json({ message: "Chatroom successfully deleted!"});
  } catch (error) {
    console.log("Error deleting chatroom", error);
    res.status(500).json({ message: "Internal server error "});
  }

};


// Send a message within a chat room
const sendMessage = async (req, res) => {
    try {
        console.log("Received send message request");

        const { roomName, sender, message } = req.body;

        if (!roomName || !sender || !message) {
            console.log("Missing roomName, sender, or message fields");
            res.status(400).json({ message: "Mising roomName, sender, or message fields"});
            return;
        }

        const newMessage = new Message({ roomName, sender, message });
        const savedMessage = await newMessage.save();

        console.log("Message saved", savedMessage);
        res.status(200).json({ message: "Message saved" });
    } catch (error) {
        console.log("Send message error", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Get the message history for the specified chat room when
// a user enters a chat room
const getMessages = async (req, res) => {
  try {
    console.log("Received get message request");

    const { roomName } = req.body;

    if (!roomName) {
      console.log("Missing roon name or room doesn't exist");
      res.status(400).json({ message: "Missing room name or room doesn't exist"});
      return;
    }

    const message_search = await Message.find({ roomName: roomName });

    if (message_search.length === 0) {
      console.log("No messages found");
      res.status(200).json([]);
    } else {
      console.log("Messages found", message_search);
      res.status(200).json(message_search);
    }

  } catch (error) {
    console.log("Error getting messages", error);
    res.status(500).json({ message: "Internal server error "});
  }

};

//------- Comment out below to try tests -------------------------------------------------------

// Socket.IO Connection
io.on('connection', socket => {
    console.log('A user connected');
  
    // Join a chat room
    socket.on('joinRoom', roomName => {
      socket.join(roomName);
      console.log(`User joined room: ${roomName}`);
    });
  
    // Listen for new messages from the client
    socket.on('sendMessage', async (data) => {
        const { roomName, sender, message } = data;

        const newMessage = new Message({ roomName, sender, message, timestamp: new Date()});

        try {
            await newMessage.save();
            console.log("Message saved to MongoDB", newMessage);
            
             // Broadcast the new message to all clients in the room
            io.to(roomName).emit('newMessage', newMessage);
        } catch (error){
            console.error("Error saving message", error);
        }
  
     
    });
  
    // Handle disconnect event
    socket.on('disconnect', () => {
      console.log('User disconnected');
    });
  });

//--------------- END --------------------------------------------------------------------------------

// Define the router and endpoint
const authRoutes = Router();
const contactRoutes = Router();
const chatroomRoutes = Router();
const messageRoutes = Router();
app.use("/api/auth", authRoutes);
app.use("/api/contacts", contactRoutes);
app.use("/api/chatrooms", chatroomRoutes);
app.use("/api/messages", messageRoutes);

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

// POST /api/chatrooms/create
chatroomRoutes.post("/create", createChatroom);

// GET /api/chatrooms/get-chatrooms
chatroomRoutes.get("/get-chatrooms", getChatrooms);

// DELETE /api/chatrooms/delete-chatrooms
chatroomRoutes.delete("/delete-chatrooms", deleteChatrooms);

// POST /api/messages/send-message
messageRoutes.post("/send-message", sendMessage);

// POST /api/messages/get-messages
messageRoutes.post("/get-messages", getMessages);

/**
 * connectDB:
 * A helper to connect to MongoDB. We'll call this in index.js (for real use)
 * and in tests (for in-memory or environment-based DB).
 */
export async function connectDB(uri) {
    return mongoose.connect(uri);
  }
  
  /**
   * Export the `app` so other files (like index.js or test files) can import it.
   * We also export the `User` model if tests need it.
   */
export { app };
