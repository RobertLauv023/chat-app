import request from "supertest"; // Supertest allows us to simulate HTTP requests
import { app, connectDB, Chatroom, Message} from "../app.js";
import mongoose from "mongoose";
import jsonwebtoken, { JsonWebTokenError } from 'jsonwebtoken';

/**
 * We rely on @shelf/jest-mongodb to supply process.env.MONGO_URL,
 * which points to an in-memory MongoDB instance for testing.
 *
 * jest.config.cjs references @shelf/jest-mongodb as a preset,
 */

/**
 * This describe block groups tests for the auth endpoints endpoint: 
 * POST /api/auth/signup
 * POST /api/auth/login
 * POST /api/auth/logout
 */
describe("POST /api/chatrooms ", () => {
    let token
  /**
   * Before any of our tests run, we connect Mongoose to the ephemeral MongoDB
   * instance provided by process.env.MONGO_URL. The connectDB function is
   * defined in `app.js`, so we just call it here.
   */
  beforeAll(async () => {
    await connectDB(process.env.MONGO_URL);
  });

  /**
   * After all tests complete, we disconnect from MongoDB to free resources
   * and ensure no open handles remain (important in Jest).
   */
  afterAll(async () => {
    await mongoose.disconnect();
  });

  /**
   * We clear out all users between tests so each test starts with a fresh DB.
   * This helps prevent one test's data from affecting another.
   */
  afterEach(async () => {
    await Chatroom.deleteMany({});
  });

  // Testing for successful creation of chat room
  // Test should return a status of 200 and a message "Chatroom created!"
  it("should create a chat room and return status 201 if unique room name", async() => {

    // Send POST request with chatroom of given name
    const res = await request(app)
        .post("/api/chatrooms/create")
        .send({ roomName: "NewRoom" });

    // Expect status of 201
    expect(res.status).toBe(201);
    // Expect message of "Chatroom created!"
    expect(res.body.message).toBe("Chatroom created!");
  });

  // Testing for unsuccessful creation of chat room due to duplicate name
  // Test should return a status of 409 and a message "Room name already exists"
  it("should not create a chat room and return status 409 if room name already exists", async() => {

    // Send POST request with chatroom of given name
    const ser = await request(app)
        .post("/api/chatrooms/create")
        .send({ roomName: "NewRoom" });

    // Send another POST request with the same name
    const res = await request(app)
        .post("/api/chatrooms/create")
        .send({ roomName: "NewRoom" });

    // Expect status of 400
    expect(res.status).toBe(409);
    // Expect message of "Chatroom created!"
    expect(res.body.message).toBe("Room name already exists");
  });

  // Testing for unsuccessful creation of chat room due to missing name
  // Test should return a status of 400 and a message "Missing room name field"
  it("should not create a chat room and return status 400 if missing the room name field", async() => {

    // Send another POST request with the same name
    const res = await request(app)
        .post("/api/chatrooms/create")
        .send({ roomName: "" });

    // Expect status of 400
    expect(res.status).toBe(400);
    // Expect message of "Missing room name field"
    expect(res.body.message).toBe("Missing room name field");
  });

  // Testing for failure during creation of chat orom
  // Test should return a status of 500 and a message "Internal server error"
  it("should not create a chat room and return status 500 if an error occurs during room creation", async() => {

    jest
        .spyOn(Chatroom.prototype, "save")
        .mockRejectedValue(new Error("Forced save error"));

    // Send another POST request with the same name
    const res = await request(app)
        .post("/api/chatrooms/create")
        .send({ roomName: "Room name" });

    // Expect status of 500
    expect(res.status).toBe(500);
    // Expect message of "Internal server error"
    expect(res.body.message).toBe("Internal server error");

    Chatroom.prototype.save.mockRestore();
  });

});

describe("GET /api/chatrooms ", () => {
    let token
  /**
   * Before any of our tests run, we connect Mongoose to the ephemeral MongoDB
   * instance provided by process.env.MONGO_URL. The connectDB function is
   * defined in `app.js`, so we just call it here.
   */
  beforeAll(async () => {
    await connectDB(process.env.MONGO_URL);
  });

  /**
   * After all tests complete, we disconnect from MongoDB to free resources
   * and ensure no open handles remain (important in Jest).
   */
  afterAll(async () => {
    await mongoose.disconnect();
  });

  /**
   * We clear out all users between tests so each test starts with a fresh DB.
   * This helps prevent one test's data from affecting another.
   */
  afterEach(async () => {
    await Chatroom.deleteMany({});
  });

  // Testing success response for getChatrooms
  // Should return status 200 if chatrooms were found
  it("should display all chat rooms and return status 200 if chatrooms were found", async() => {
    // Send POST request with chatroom of given name
    // to create a chatroom
    const ser = await request(app)
        .post("/api/chatrooms/create")
        .send({ roomName: "NewRoom" });

    // Send GET request to look for available chat rooms
    const res = await request(app)
        .get("/api/chatrooms/get-chatrooms");
    
    // Expect return status to be 200
    expect(res.status).toBe(200);
  });

  // Testing fail response for getChatrooms
  // Should return status 400 if no chatrooms were found
  it("should not display anything and return status 400 if no chatrooms were found", async() => {
    
    // Send GET request to look for available chat rooms
    const res = await request(app)
        .get("/api/chatrooms/get-chatrooms");
    
    // Expect return status to be 200
    expect(res.status).toBe(400);
  });

  // Testing fail response for getChatrooms
  // Should return status 400 if no chatrooms were found
  it("should not display anything and return status 500 if error occurred during chat room searching", async() => {
    
    jest.spyOn(Chatroom, "find").mockRejectedValue(new Error("Forced find error"));

    // Send GET request to look for available chat rooms
    const res = await request(app)
        .get("/api/chatrooms/get-chatrooms");
    
    // Expect return status to be 200
    expect(res.status).toBe(500);
    expect(res.body.message).toBe("Internal service error");

    Chatroom.find.mockRestore();
  });

});

describe("DELETE /api/chatrooms ", () => {
    let token
  /**
   * Before any of our tests run, we connect Mongoose to the ephemeral MongoDB
   * instance provided by process.env.MONGO_URL. The connectDB function is
   * defined in `app.js`, so we just call it here.
   */
  beforeAll(async () => {
    await connectDB(process.env.MONGO_URL);
  });

  /**
   * After all tests complete, we disconnect from MongoDB to free resources
   * and ensure no open handles remain (important in Jest).
   */
  afterAll(async () => {
    await mongoose.disconnect();
  });

  /**
   * We clear out all users between tests so each test starts with a fresh DB.
   * This helps prevent one test's data from affecting another.
   */
  afterEach(async () => {
    await Chatroom.deleteMany({});
  });

  // Testing out success for delete chatrooms
  // Should return status 200 and message 'Chatroom successfully deleted!'
  it("should return status 200 and a message 'Chatroom successfully deleted!'", async() => {
    // Send POST request with chatroom of given name
    // to create a chatroom
    const ser = await request(app)
        .post("/api/chatrooms/create")
        .send({ roomName: "NewRoom" });

    // Send DELETE request with the recently created room
    const res = await request(app)
        .delete("/api/chatrooms/delete-chatrooms")
        .send({ roomName: "NewRoom"  });

    // Expect status of 200
    expect(res.status).toBe(200);
    // Expect message to be "Chatroom successfully deleted!"
    expect(res.body.message).toBe("Chatroom successfully deleted!");

    });

  // Testing out failure for delete chatrooms due to missing input
  // Should return status 400 and message 'Missing or invalid room name field'
  it("should return status 400 and a message 'Missing or invalid room name field'", async() => {
    // Send POST request with chatroom of given name
    // to create a chatroom
    const ser = await request(app)
        .post("/api/chatrooms/create")
        .send({ roomName: "NewRoom" });

    // Send DELETE request without entering a room name
    const res = await request(app)
        .delete("/api/chatrooms/delete-chatrooms")
        .send({ roomName: "" });

    // Expect status to be 400
    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Missing or invalid room name field");
    });

    // Testing out failure for delete chatrooms due to non-existent chat room
  // Should return status 404 and message 'Chatroom does not exist'
  it("should return status 404 and a message 'Chatroom does not exist'", async() => {
    // Send POST request with chatroom of given name
    // to create a chatroom
    const ser = await request(app)
        .post("/api/chatrooms/create")
        .send({ roomName: "NewRoom" });

    // Send DELETE request without entering a room name
    const res = await request(app)
        .delete("/api/chatrooms/delete-chatrooms")
        .send({ roomName: "FakeRoom" });

    // Expect status to be 404
    expect(res.status).toBe(404);
    expect(res.body.message).toBe("Chatroom does not exist");
    });

    // Testing out failure for delete chatrooms due to error
  // Should return "Internal server error"
  it("should return internal service error when an error occurs during chat room deletion", async() => {
    // Send POST request with chatroom of given name
    // to create a chatroom
    const ser = await request(app)
        .post("/api/chatrooms/create")
        .send({ roomName: "NewRoom" });

    jest.spyOn(Chatroom, "deleteOne").mockRejectedValue(new Error("Forced delete error"));

    // Send DELETE request without entering a room name
    const res = await request(app)
        .delete("/api/chatrooms/delete-chatrooms")
        .send({ roomName: "NewRoom" });

    // Expect status to be 500
    expect(res.status).toBe(500);
    expect(res.body.message).toBe("Internal server error ");

    Chatroom.deleteOne.mockRestore();
    });

    
});

describe("POST /api/messages ", () => {
    let token
  /**
   * Before any of our tests run, we connect Mongoose to the ephemeral MongoDB
   * instance provided by process.env.MONGO_URL. The connectDB function is
   * defined in `app.js`, so we just call it here.
   */
  beforeAll(async () => {
    await connectDB(process.env.MONGO_URL);
  });

  /**
   * After all tests complete, we disconnect from MongoDB to free resources
   * and ensure no open handles remain (important in Jest).
   */
  afterAll(async () => {
    await mongoose.disconnect();
  });

  /**
   * We clear out all users between tests so each test starts with a fresh DB.
   * This helps prevent one test's data from affecting another.
   */
  afterEach(async () => {
    await Chatroom.deleteMany({});
    await Message.deleteMany({});
  });

  // Testing successfully sending a message inside a chat room
  // Should return status 200 and a message
  it("should return status 200 if a sent message is saved", async() => {
    // Create a chat room inside DB memory
    const ser = await request(app)
        .post("/api/chatrooms/create")
        .send({ roomName: "NewRoom" });

    const res = await request(app)
        .post("/api/messages/send-message")
        .send({ roomName: "NewRoom", sender: "Bill", message: "Hey there!" });
    
    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Message saved");
  });

  // Testing failing to send a message
  // Should return status 400 and a message
  it("should return status 400 if the roomName, sender, or message fields are empty", async() => {
    // Create a chat room inside DB memory
    const ser = await request(app)
        .post("/api/chatrooms/create")
        .send({ roomName: "NewRoom" });

    // Testing empty message field
    let res = await request(app)
        .post("/api/messages/send-message")
        .send({ roomName: "NewRoom", sender: "Bill", message: "" });
    
    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Mising roomName, sender, or message fields");

    // Testing empty sender field
    res = await request(app)
        .post("/api/messages/send-message")
        .send({ roomName: "NewRoom", sender: "", message: "Mesage" });
    
    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Mising roomName, sender, or message fields");

    // Testing empty roomName field
    res = await request(app)
        .post("/api/messages/send-message")
        .send({ roomName: "", sender: "Bill", message: "Mesage" });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Mising roomName, sender, or message fields");

    // Testing all empty fields
    res = await request(app)
        .post("/api/messages/send-message")
        .send({ roomName: "", sender: "", message: "" });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Mising roomName, sender, or message fields");
  });

  // Testing error during message saving
  // Should return status 500 and a message
  it("should return status 500 if an error occurs during message saving", async() => {
    // Create a chat room inside DB memory
    const ser = await request(app)
        .post("/api/chatrooms/create")
        .send({ roomName: "NewRoom" });

    // Force an error during the 'save' function
    jest.spyOn(Message.prototype, "save").mockRejectedValue(new Error("Forced save error"));

    // Send POST request to save a message
    const res = await request(app)
        .post("/api/messages/send-message")
        .send({ roomName: "NewRoom", sender: "Bill", message: "Hey there!" });
    
    // Expect status of 500
    expect(res.status).toBe(500);
    // Expect error message
    expect(res.body.message).toBe("Internal server error");

    Message.prototype.save.mockRestore();
  });

  // Testing successfully getting messages for the chat room
  // Should return status 200 
  it("should display messages and return status 200 if message in chat room are found", async() => {
    // Create a chat room inside DB memory
    const ser = await request(app)
        .post("/api/chatrooms/create")
        .send({ roomName: "NewRoom" });

    // Sending POST request to save a message
    const response = await request(app)
        .post("/api/messages/send-message")
        .send({ roomName: "NewRoom", sender: "Bill", message: "Hey there!" });
    
    // Sending a POST request to get any messages for a specific chat room
    const res = await request(app)
        .post("/api/messages/get-messages")
        .send({ roomName: "NewRoom" });
    
    // Expect status to be 200
    expect(res.status).toBe(200);
  });

  // Testing no messages in current chat room
  // Should return status 200 
  it("should display no messages and return status 200 if no messages in current chat room found", async() => {
    // Create a chat room inside DB memory
    const ser = await request(app)
        .post("/api/chatrooms/create")
        .send({ roomName: "NewRoom" });
    
    // Sending a POST request to get any messages for a specific chat room
    const res = await request(app)
        .post("/api/messages/get-messages")
        .send({ roomName: "NewRoom" });
    
    // Expect status to be 200
    expect(res.status).toBe(200);
  });

  // Testing failure to find message due to missing room name input
  // Should return status 400 
  it("should display no messages and return status 200 if no messages in current chat room found", async() => {
    // Create a chat room inside DB memory
    const ser = await request(app)
        .post("/api/chatrooms/create")
        .send({ roomName: "NewRoom" });
    
    // Sending a POST request without a room name
    const res = await request(app)
        .post("/api/messages/get-messages")
        .send({ roomName: "" });
    
    // Expect status to be 400
    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Missing room name or room doesn't exist");
  });

  // Testing failure during message searching
  // Should return status 400 
  it("should display no messages and return status 200 if no messages in current chat room found", async() => {
    // Create a chat room inside DB memory
    const ser = await request(app)
        .post("/api/chatrooms/create")
        .send({ roomName: "NewRoom" });
    
    jest.spyOn(Message, "find").mockRejectedValue(new Error("Forced find error"));
    // Sending a POST request without a room name
    const res = await request(app)
        .post("/api/messages/get-messages")
        .send({ roomName: "NewRoom" });
    
    // Expect status to be 400
    expect(res.status).toBe(500);
    expect(res.body.message).toBe("Internal server error ");

    Message.find.mockRestore();
  });
});