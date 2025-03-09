import request from "supertest"; // Supertest allows us to simulate HTTP requests
import { app, connectDB, User, UserProfile } from "../app.js";
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
describe("POST /api/contacts ", () => {
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

  // Testing for searching for specific users.
  // Test should return status 200 to indicate users found
  it("should return list of users found and return status 200 if users are found", async() => {

    // First manually create the user-document for in memory DB
        const ser = await request(app)
            .post("/api/auth/signup")
            .send({ email: "trial@example.com", password: "secret123" });

        const response = await request(app)
              .post("/api/auth/login")
              .send({ email: "trial@example.com", password: "secret123" });
               token = response.body.token;

        // Test updating profile w/ firstName and lastName
        const resp = await request(app)
            .post("/api/auth/update-profile")
            .send({ firstName: "Testing", lastName: "Stone"})
            .set('Authorization', `Bearer ${token}`);

        const res = await request(app)
            .post("/api/contacts/search")
            .send({ searchTerm: "Testing"});
        
        expect(res.status).toBe(200);
  });

  // Testing for searching for users not existing.
  // Test should return status 400 to indicate users found
  it("should display no users return status 400 if no users are found", async() => {

    // First manually create the user-document for in memory DB
        const ser = await request(app)
            .post("/api/auth/signup")
            .send({ email: "trial@example.com", password: "secret123" });

        const response = await request(app)
              .post("/api/auth/login")
              .send({ email: "trial@example.com", password: "secret123" });
               token = response.body.token;

        // Test updating profile w/ firstName and lastName
        const resp = await request(app)
            .post("/api/auth/update-profile")
            .send({ firstName: "Testing", lastName: "Stone"})
            .set('Authorization', `Bearer ${token}`);

        const res = await request(app)
            .post("/api/contacts/search")
            .send({ searchTerm: "Bob"});
        
        expect(res.status).toBe(400);
  });

  // Testing search function w/ no search term.
  // Test should return status 400 to indicate a missing search term
  it("should display no users and return status 400 and a message 'Missing search term'", async() => {

    // First manually create the user-document for in memory DB
        const ser = await request(app)
            .post("/api/auth/signup")
            .send({ email: "trial@example.com", password: "secret123" });

        const response = await request(app)
              .post("/api/auth/login")
              .send({ email: "trial@example.com", password: "secret123" });
               token = response.body.token;

        // Test updating profile w/ firstName and lastName
        const resp = await request(app)
            .post("/api/auth/update-profile")
            .send({ firstName: "Testing", lastName: "Stone"})
            .set('Authorization', `Bearer ${token}`);

        const res = await request(app)
            .post("/api/contacts/search")
            .send({ searchTerm: ""});
        
        expect(res.status).toBe(400);
        expect(res.body.message).toBe("Missing search term");
  });

  
  // Testing search function error.
  // Test should return status 500 to indicate a missing search term
  it("should return status 500 and a message 'Unexpected server error' if an error occurrs during searching", async() => {

    // First manually create the user-document for in memory DB
        const ser = await request(app)
            .post("/api/auth/signup")
            .send({ email: "trial@example.com", password: "secret123" });

        const response = await request(app)
              .post("/api/auth/login")
              .send({ email: "trial@example.com", password: "secret123" });
               token = response.body.token;

        // Test updating profile w/ firstName and lastName
        const resp = await request(app)
            .post("/api/auth/update-profile")
            .send({ firstName: "Testing", lastName: "Stone"})
            .set('Authorization', `Bearer ${token}`);

        jest
            .spyOn(UserProfile, "find")
            .mockRejectedValue(new Error("Forced find error"))

        const res = await request(app)
            .post("/api/contacts/search")
            .send({ searchTerm: "Testing"});

        expect(res.status).toBe(500);
        expect(res.body.message).toBe("Unexpected server error");

        UserProfile.find.mockRestore();
  });

});


describe("GET /api/contacts ", () => {
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

    it("should display all users except self and return status 200 to indicate that users have been found", async() => {
        // First manually create the user-document for in memory DB
        const ser = await request(app)
            .post("/api/auth/signup")
            .send({ email: "trial@example.com", password: "secret123" });
        
        //const ser2 = await request(app)
        //    .post("/api/auth/signup")
        //    .send({ email: "trial2@example.com", password: "secret123" });

        
        const response = await request(app)
            .post("/api/auth/login")
            .send({ email: "trial@example.com", password: "secret123" });
             token = response.body.token;
        
        const res = await request(app)
            .get("/api/contacts/all-contacts")
            .set('Authorization', `Bearer ${token}`);

        expect(res.status).toBe(200);
    });

    it("should display no users and return status 404 if an error with the token occurs", async() => {
        // First manually create the user-document for in memory DB
        const ser = await request(app)
            .post("/api/auth/signup")
            .send({ email: "trial@example.com", password: "secret123" });
        
        const response = await request(app)
            .post("/api/auth/login")
            .send({ email: "trial@example.com", password: "secret123" });
             token = response.body.token;
        let a = "";
        const res = await request(app)
            .get("/api/contacts/all-contacts")
            .set('Authorization', `Bearer ${a}`);

        expect(res.status).toBe(404);
        expect(res.body.message).toBe("Token not found");
    });


});
