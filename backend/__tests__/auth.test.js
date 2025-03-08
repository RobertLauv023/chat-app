import request from "supertest"; // Supertest allows us to simulate HTTP requests
import { app, connectDB, User } from "../app.js";
import mongoose from "mongoose";
import jsonwebtoken from 'jsonwebtoken';

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
describe("POST /api/auth", () => {
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
    await User.deleteMany({});
  });

  /**
   * 1) Test the success scenario:
   *    If the request has valid email and password, the endpoint should
   *    create a user and return status 201 with a success message.
   */
  it("should create a user and return 201 if email/password are valid", async () => {
    /**
     * We use supertest to POST to /api/auth/signup on our Express `app`.
     * The `send({...})` method includes the JSON body with email/password.
     */
    const res = await request(app)
      .post("/api/auth/signup")
      .send({ email: "john@example.com", password: "secret123" });

    // We expect a 201 (Created) status code
    expect(res.status).toBe(201);
    // We also expect the response body to have a message with success text
    expect(res.body.message).toBe("User registered successfully");

    /**
     * Verify in the database that the user actually got created.
     * We query the User model for the given email and ensure it's not null.
     */
    const userInDb = await User.findOne({ email: "john@example.com" });
    expect(userInDb).not.toBeNull();
  });

  /**
   * 2) Test the scenario where the email is already registered:
   *    In that case, the endpoint should return a 400 (Bad Request)
   *    and a message indicating the email is taken.
   */
  it("should return 409 if email is already registered", async () => {
    // First, manually create a user document in the in-memory DB
    await User.create({ email: "jane@example.com", password: "pass" });

    // Now, attempt to sign up again with the same email
    const res = await request(app)
      .post("/api/auth/signup")
      .send({ email: "jane@example.com", password: "newpass" });

    // Expect 400 status code for a duplicate email scenario
    expect(res.status).toBe(409);
    // And check the message for "Email already registered"
    expect(res.body.message).toBe("Email already registered");
  });

  /**
   * 3) Test the scenario where the request is missing an email or a password:
   *    The endpoint should respond with a 400 for either missing field.
   */
  it("should return 400 if email or password is missing", async () => {
    // Missing password
    let res = await request(app)
      .post("/api/auth/signup")
      .send({ email: "missingpass@example.com" });
    expect(res.status).toBe(400);

    // Missing email
    res = await request(app)
      .post("/api/auth/signup")
      .send({ password: "newpass" });
    expect(res.status).toBe(400);
  });

  /**
   * 4) Test the success scenario:
   *    Test the scenario where the login was successful
   *    The endpoint should respond with a 200 and a success message
   */
  it("should return 200 if login was successful", async () => {
    // First manually create the user-document for in memory DB
    const ser = await request(app)
      .post("/api/auth/signup")
      .send({ email: "trial@example.com", password: "secret123" });

    const res = await request(app)
    .post("/api/auth/login")
    .send({ email: "trial@example.com", password: "secret123" });
  

  // We expect a (200) Login success code
  expect(res.status).toBe(200);
  // And check the message for "Login successful!"
  expect(res.body.message).toBe("Login successful!");
  });

  /**
   * 5) Test the scenario where the request is missing an email or a password:
   *    The endpoint should respond with a 400 for either missing field.
   */
  it("should return 400 if email or password is missing", async () => {
    // Missing password
    let res = await request(app)
      .post("/api/auth/login")
      .send({ email: "missingpass@example.com" });
    expect(res.status).toBe(400);

    // Missing email
    res = await request(app)
      .post("/api/auth/login")
      .send({ password: "newpass" });
    expect(res.status).toBe(400);
  });

  /**
   * 6) Test the scenario where the request send an email that doesn't exist:
   *    The endpoint should respond with a 400 for either missing field.
   */
  it("should return 404 if email entered is not found", async () => {
    // Missing password
    let res = await request(app)
      .post("/api/auth/login")
      .send({ email: "notrealemail@example.com", password: "fakepass123" });
    expect(res.status).toBe(404);
    expect(res.body.message).toBe("Email does not exist");

  });

  /**
   * 7) Test the success scenario:
   *    Test the scenario where the logout was successful
   *    The endpoint should respond with a 200 and a success message.
   */
  it("should return 200 if logout was successful", async () => {
    // Missing password
    let res = await request(app)
      .post("/api/auth/logout")
    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Logout successful!");
  });

  /**
   * 10) Test the success scenario:
   *    Test the scenario where the update profile was successful
   *    The endpoint should respond with a 200 and a success message.
   */
  it("should return 200 if profile updated", async () => {
    // Manually create user in mongodb
    const ser = await request(app)
      .post("/api/auth/signup")
      .send({ email: "trial@example.com", password: "secret123" });

    // Login to get the JWT token
    const response = await request(app)
      .post("/api/auth/login")
      .send({ email: "trial@example.com", password: "secret123" });
       token = response.body.token;

    // Test updating profile w/ firstName and lastName
    const res = await request(app)
      .post("/api/auth/update-profile")
      .send({ firstName: "Testing", lastName: "Stone"})
      .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.message).toBe( "Profile updated!" )
  });

  /**
   * 11) 
   *    Test the scenario where firstName or lastName fields are missing
   *    The endpoint should respond with a 400 and a error message.
   */
  it("should return 200 if profile updated", async () => {
    // Manually create user in mongodb
    const ser = await request(app)
      .post("/api/auth/signup")
      .send({ email: "trial@example.com", password: "secret123" });

    // Login to get the JWT token
    const response = await request(app)
      .post("/api/auth/login")
      .send({ email: "trial@example.com", password: "secret123" });
       token = response.body.token;

    // Test updating profile w/ firstName and lastName
    let res = await request(app)
      .post("/api/auth/update-profile")
      .send({ firstName: "Testing"})
      .set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(400);
      expect(res.body.message).toBe( "Missing first name or last name fields" )

      res = await request(app)
      .post("/api/auth/update-profile")
      .send({ lastName: "Testing"})
      .set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(400);
      expect(res.body.message).toBe( "Missing first name or last name fields" )
    
  });
});

describe("GET /api/auth", () => {
    let token;
    let decoded;
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
      await User.deleteMany({});
    });

    /**
   * 8) Test the success scenario:
   *    Test the scenario where the get user info was successful
   *    The endpoint should respond with a 200.
   */
  it("should return 200 if user data found", async () => {
    // Manually create user in mongodb
    const ser = await request(app)
      .post("/api/auth/signup")
      .send({ email: "trial@example.com", password: "secret123" });

    const response = await request(app)
      .post("/api/auth/login")
      .send({ email: "trial@example.com", password: "secret123" });
       token = response.body.token;

    const res = await request(app)
      .get("/api/auth/userinfo")
      .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
  });

  /**
   * 9) 
   *    Test the scenario where user token invalid or user doesn't exist
   *    The endpoint should respond with a 404 and an error message.
   */
  it("should return 404 if user data not found", async () => {
    const ser = await request(app)
      .post("/api/auth/signup")
      .send({ email: "trial@example.com", password: "secret123" });

    const response = await request(app)
      .post("/api/auth/login")
      .send({ email: "trial@example.com", password: "secret123" });
       token = response.body.token;

    decoded = jsonwebtoken.decode(token, { complete: true});

    decoded.payload.sub = "changed_value";

    const res = await request(app)
      .get("/api/auth/userinfo")
      .set('Authorization', `Bearer ${decoded}`);

      expect(res.status).toBe(404);
      expect(res.body.message).toBe( "Profile not found" );
  });
});