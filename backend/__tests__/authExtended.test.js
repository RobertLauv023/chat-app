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
describe("POST /api/auth Extended error coverage", () => {
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
   * This test simulates an error during user creation by forcing the
   * User model's save() method to throw an error. This triggers the catch
   * block in the signup controller, which should return a 500 status code
   * with the message "Internal Server Error".
   */
  it("should return 500 and 'Internal Server Error' if an exception occurs during signup", async () => {
    // Force User.prototype.save() to throw an error.
    jest
      .spyOn(User.prototype, "save")
      .mockRejectedValue(new Error("Forced save error"));

    const res = await request(app)
      .post("/api/auth/signup")
      .send({ email: "error@example.com", password: "secret" });

    // Expect a 500 status code and the error message.
    expect(res.status).toBe(500);
    expect(res.body.message).toBe("Internal Server Error");

    // Restore the original save method to avoid affecting other tests.
    User.prototype.save.mockRestore();
  });

  // This test simulates an error with regards to an incorrect password being input during login
  // It should return a 400 status code along with the message 'Missing email or password, or invalid password'
  it("should return 400 and 'Missing email or password, or invalid password during during login w/ wrong password", async() => {
    // First manually create the user-document for in memory DB
        const ser = await request(app)
          .post("/api/auth/signup")
          .send({ email: "trial5@example.com", password: "secret123" });

        const res = await request(app)
            .post("/api/auth/login")
            .send({ email: "trial5@example.com", password: "wrongpassword" });

        // We except a status (400 code)
        expect(res.status).toBe(400);
        // And check message for 'Missing email or password, or invalid password'
        expect(res.body.message).toBe("Missing email or password, or invalid password");
  });

  /**
   * This test simulates an error during user login by forcing the
   * User model's findOne() method to throw an error. This triggers the catch
   * block in the signup controller, which should return a 500 status code
   * with the message "Internal Server Error".
   */
  it("should return 500 and internal service error if an exception occurrs during login", async() => {
    // First manually create the user-document for in memory DB
    const ser = await request(app)
        .post("/api/auth/signup")
        .send({ email: "trial2@example.com", password: "secret123" });

    jest.spyOn(User, "findOne").mockRejectedValue(new Error("Forced findOne error"));

    const res = await request(app)
        .post("/api/auth/login")
        .send({ email: "trial2@example.com", password: "secret123" });

    // Expect a 500 status code and the error message.
    expect(res.status).toBe(500);
    expect(res.body.message).toBe("Internal Server Error");

    User.findOne.mockRestore();
  });
  
   /**
   * This test simulates an error during user get info by forcing the
   * User model's findOne() method to throw an error. This triggers the catch
   * block in the signup controller, which should return a 500 status code
   * with the message "Internal Server Error".
   */
   it("should return 404 and message 'User does not exist or ID not in token", async() => {
    // First manually create the user-document for in memory DB
    const ser = await request(app)
    .post("/api/auth/signup")
    .send({ email: "trial3@example.com", password: "secret123" });

    const rese = await request(app)
        .post("/api/auth/login")
        .send({ email: "trial3@example.com", password: "secret123" });

        token = "1.2.3"
    let a = "";
    const res = await request(app)
            .get("/api/auth/userinfo")
            .set('Authorization', `Bearer ${a}`);

    // Expect a 500 status code and the error message.
    expect(res.status).toBe(404);
    expect(res.body.message).toBe("User does not exist or ID not in token");

  });
});