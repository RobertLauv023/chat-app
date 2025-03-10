import apiClient from "@/lib/api-client";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import Auth from "../src/pages/auth/index";

/**
 * We group our tests under a `describe` block titled "Auth Page".
 * This helps organize and label tests in Jest's output.
 */
describe("Auth Page", () => {
  /**
   * We'll override `console.log` to keep our test output clean
   * (e.g., to prevent printing "Error: Signup failed" in our console).
   */
  let originalLog;

  /**
   * `beforeAll` runs once before any tests in this `describe` block.
   * Here, we save the original `console.log` and replace it with a Jest mock.
   */
  beforeAll(() => {
    originalLog = console.log;
    console.log = jest.fn(); // No-op for logs
  });

  /**
   * `afterAll` runs once after all tests finish.
   * We restore `console.log` so we don't affect other test files.
   */
  afterAll(() => {
    console.log = originalLog;
  });

  /**
   * `beforeEach` runs before every single test in this `describe` block.
   * We use it to clear all mocks, ensuring each test starts with a clean slate.clear
   */
  beforeEach(() => {
    jest.clearAllMocks();
  });

  /**
   * 1st test: If the API call resolves with a 201 status,
   * we expect the UI to display "Signup successful!".
   */
  test('displays "Signup successful!" when signup returns status 201', async () => {
    /**
     * Mocking the `apiClient.post` method to resolve with `{ status: 201 }`.
     * This simulates a successful signup response.
     */
    apiClient.post.mockResolvedValue({ status: 201 });

    /**
     * `render` mounts the `Auth` component in a simulated DOM environment.
     * After this call, `Auth` is effectively "on screen" for testing.
     */
    render(<Auth />);

    /**
     * We grab the input fields and signup button from the DOM
     * using placeholders/labels. React Testing Library offers
     * various query methods, such as getByPlaceholderText, getByRole, etc.
     */
    const emailInput = screen.getByPlaceholderText(/email/i);
    const passwordInput = screen.getByPlaceholderText(/^password$/i);
    const signupButton = screen.getByRole("button", { name: /signup/i });

    /**
     * `userEvent.type` simulates typing into the input fields.
     * We enter a valid email and matching passwords to mimic user input.
     */
    await userEvent.type(emailInput, "test@example.com");
    await userEvent.type(passwordInput, "password123");

    /**
     * Simulate a button click to trigger the Auth component's
     * handleSignup function, which calls `apiClient.post`.
     */
    userEvent.click(signupButton);

    /**
     * `waitFor` is used to handle asynchronous changes in the DOM.
     * We wait until "Signup successful!" text appears,
     * confirming the component displays the success message.
     */
    await waitFor(() => {
      expect(screen.getByText(/signup successful!/i)).toBeInTheDocument();
    });
  });

  /**
   * 2nd test: If the API call rejects, we expect the UI to display
   * "Signup failed. Please try again." as an error message.
   */
  test("displays error message when signup fails", async () => {
    /**
     * Mocking the `apiClient.post` method to reject with an Error object.
     * This simulates a failed signup response from the server.
     */
    apiClient.post.mockRejectedValue(new Error("Signup failed"));

    /**
     * Again, we mount the Auth component so we can interact with it in the test.
     */
    render(<Auth />);

    /**
     * We retrieve the email/password/confirmPassword fields and signup button
     * just like in the previous test.
     */
    const emailInput = screen.getByPlaceholderText(/email/i);
    const passwordInput = screen.getByPlaceholderText(/^password$/i);
    const signupButton = screen.getByRole("button", { name: /signup/i });

    /**
     * Simulate user typing in valid credentials, then clicking signup.
     * Because `apiClient.post` is mocked to reject, this will produce an error scenario.
     */
    await userEvent.type(emailInput, "test@example.com");
    await userEvent.type(passwordInput, "password123");

    userEvent.click(signupButton);

    /**
     * We wait for the error message "Signup failed. Please try again."
     * to appear, confirming the Auth component handles failures correctly.
     */
    await waitFor(() => {
      expect(
        screen.getByText(/signup failed\. please try again\./i)
      ).toBeInTheDocument();
    });
  });

  /**
   * 3rd test: If the API call resolves with a 200 status,
   * we expect the UI to display "Login successful!".
   */
  test('displays "Login Successful" when login returns status 200', async () => {

    /**
     * Mocking the `apiClient.post` method to resolve with `{ status: 200 }`.
     * This simulates a successful login response.
     */
    apiClient.post.mockResolvedValue({ status: 200 });

    /**
     * `render` mounts the `Auth` component in a simulated DOM environment.
     * After this call, `Auth` is effectively "on screen" for testing.
     */
    render(<Auth />);

    /**
     * We grab the input fields and login button from the DOM
     * using placeholders/labels. React Testing Library offers
     * various query methods, such as getByPlaceholderText, getByRole, etc.
     */
    const emailInput = screen.getByPlaceholderText(/email/i);
    const passwordInput = screen.getByPlaceholderText(/^password$/i);
    const loginButton = screen.getByRole("button", { name: /login/i });

     /**
     * `userEvent.type` simulates typing into the input fields.
     * We enter a valid email and matching passwords to mimic user input.
     */
     await userEvent.type(emailInput, "tonari@gmail.com");
     await userEvent.type(passwordInput, "123");
 
     /**
      * Simulate a button click to trigger the Auth component's
      * handleLogin function, which calls `apiClient.post`.
      */
     userEvent.click(loginButton);

     /**
     * `waitFor` is used to handle asynchronous changes in the DOM.
     * We wait until "login successful!" text appears,
     * confirming the component displays the success message.
     */
    await waitFor(() => {
      expect(screen.getByText(/login successful!/i)).toBeInTheDocument();
    });
  });

  /**
   * 4th test: If the API is rejected,
   * we expect the UI to display "Login failed. Please try again".
   */
  test('displays error message when login fails ', async () => {

    /**
     * Mocking the `apiClient.post` method to resolve with error.
     * This simulates an error during login
     */
    apiClient.post.mockRejectedValue(new Error("Login failed"));

    /**
     * `render` mounts the `Auth` component in a simulated DOM environment.
     * After this call, `Auth` is effectively "on screen" for testing.
     */
    render(<Auth />);

    /**
     * We grab the input fields and login button from the DOM
     * using placeholders/labels. React Testing Library offers
     * various query methods, such as getByPlaceholderText, getByRole, etc.
     */
    const emailInput = screen.getByPlaceholderText(/email/i);
    const passwordInput = screen.getByPlaceholderText(/^password$/i);
    const loginButton = screen.getByRole("button", { name: /login/i });

     /**
     * `userEvent.type` simulates typing into the input fields.
     * We enter a valid email and matching passwords to mimic user input.
     */
     await userEvent.type(emailInput, "fake@gmail.com");
     await userEvent.type(passwordInput, "12345");
 
     /**
      * Simulate a button click to trigger the Auth component's
      * handleLogin function, which calls `apiClient.post`.
      */
     userEvent.click(loginButton);

     /**
     * `waitFor` is used to handle asynchronous changes in the DOM.
     * We wait until "Login failed\. Please try again\" text appears,
     * confirming the component displays the success message.
     */
    await waitFor(() => {
      expect(screen.getByText(/Login failed\. Please try again\./i)).toBeInTheDocument();
    });
  });

  /**
   * 5th test: If the API call resolves with a 200 status,
   * we expect the UI to display "Logout sucess".
   */
  test('displays "Logout success" when logout returns status 200', async () => {

    /**
     * Mocking the `apiClient.post` method to resolve with `{ status: 200 }`.
     * This simulates a successful logout response.
     */
    apiClient.post.mockResolvedValue({ status: 200 });

    /**
     * `render` mounts the `Auth` component in a simulated DOM environment.
     * After this call, `Auth` is effectively "on screen" for testing.
     */
    render(<Auth />);

    const logoutButton = screen.getByRole("button", { name: /logout/i });
 
     /**
      * Simulate a button click to trigger the Auth component's
      * handleLogout function, which calls `apiClient.post`.
      */
     userEvent.click(logoutButton);

     /**
     * `waitFor` is used to handle asynchronous changes in the DOM.
     * We wait until "logout successful!" text appears,
     * confirming the component displays the success message.
     */
    await waitFor(() => {
      expect(screen.getByText(/logout successful!/i)).toBeInTheDocument();
    });
  });

  /**
   * 6th test: If the API call is rejected,
   * we expect the UI to display "Logout failed. Please try again".
   */
  test('displays error message when logout fails ', async () => {

    /**
     * Mocking the `apiClient.post` method to resolve with error.
     * This simulates an error during logout
     */
    apiClient.post.mockRejectedValue(new Error("Logout failed"));

    /**
     * `render` mounts the `Auth` component in a simulated DOM environment.
     * After this call, `Auth` is effectively "on screen" for testing.
     */
    render(<Auth />);

    const logoutButton = screen.getByRole("button", { name: /logout/i });
 
     /**
      * Simulate a button click to trigger the Auth component's
      * handleLogout function, which calls `apiClient.post`.
      */
     userEvent.click(logoutButton);

     /**
     * `waitFor` is used to handle asynchronous changes in the DOM.
     * We wait until "Logout failed\. Please try again\" text appears,
     * confirming the component displays the success message.
     */
    await waitFor(() => {
      expect(screen.getByText(/Logout failed\. Please try again\./i)).toBeInTheDocument();
    });
  });

  /**
   * 7th test: If the API call resolves with a 200 status,
   * we expect the UI to display "User data found".
   */
  test('displays "User data found" when Get Info returns status 200', async () => {

    /**
     * Mocking the `apiClient.post` method to resolve with `{ status: 200 }`.
     * This simulates a successful get info response
     */
    apiClient.post.mockResolvedValue({ status: 200 });

    /**
     * `render` mounts the `Auth` component in a simulated DOM environment.
     * After this call, `Auth` is effectively "on screen" for testing.
     */
    render(<Auth />);

    const getInfoButton = screen.getByRole("button", { name: /UserInfo/i });
 
     /**
      * Simulate a button click to trigger the Auth component's
      * handleLogout function, which calls `apiClient.post`.
      */
     userEvent.click(getInfoButton);

     /**
     * `waitFor` is used to handle asynchronous changes in the DOM.
     * We wait until "user data found" text appears,
     * confirming the component displays the success message.
     */
    await waitFor(() => {
      expect(screen.getByText(/user data found/i)).toBeInTheDocument();
    });
  });

  /**
   * 8th test: If the API call is rejected,
   * we expect the UI to display "Failed getting user info".
   */
  test('displays error message when get info fails', async () => {

    /**
     * Mocking the `apiClient.post` method to resolve with error
     * This simulates an error during get info
     */
    apiClient.post.mockRejectedValue(new Error("Failed to get user info"));

    /**
     * `render` mounts the `Auth` component in a simulated DOM environment.
     * After this call, `Auth` is effectively "on screen" for testing.
     */
    render(<Auth />);

    const getInfoButton = screen.getByRole("button", { name: /UserInfo/i });
 
     /**
      * Simulate a button click to trigger the Auth component's
      * handleGetInfo function, which calls `apiClient.post`.
      */
     userEvent.click(getInfoButton);

     /**
     * `waitFor` is used to handle asynchronous changes in the DOM.
     * We wait until "Failed getting user info" text appears,
     * confirming the component displays the success message.
     */
    await waitFor(() => {
      expect(screen.getByText(/Failed getting user info/i)).toBeInTheDocument();
    });
  });

  /**
   * 9th test: If the API call resolves with a 200 status,
   * we expect the UI to display "Profile updated".
   */
  test('displays "Profile updated!" when update profile returns status 200', async () => {
    /**
     * Mocking the `apiClient.post` method to resolve with `{ status: 200 }`.
     * This simulates a successful update profile response.
     */
    apiClient.post.mockResolvedValue({ status: 200 });

    /**
     * `render` mounts the `Auth` component in a simulated DOM environment.
     * After this call, `Auth` is effectively "on screen" for testing.
     */
    render(<Auth />);

    /**
     * We grab the input fields and signup button from the DOM
     * using placeholders/labels. React Testing Library offers
     * various query methods, such as getByPlaceholderText, getByRole, etc.
     */
    const firstNameInput = screen.getByPlaceholderText(/firstName/i);
    const lastNameInput = screen.getByPlaceholderText(/lastName/i);
    const updateProfileButton = screen.getByRole("button", { name: /updateprofile/i });

    /**
     * `userEvent.type` simulates typing into the input fields.
     * We enter a first and last name to mimic user input
     */
    await userEvent.type(firstNameInput, "Thomas");
    await userEvent.type(lastNameInput, "Tank");

    /**
     * Simulate a button click to trigger the Auth component's
     * handleSignup function, which calls `apiClient.post`.
     */
    userEvent.click(updateProfileButton);

    /**
     * `waitFor` is used to handle asynchronous changes in the DOM.
     * We wait until "profile updated!" text appears,
     * confirming the component displays the success message.
     */
    await waitFor(() => {
      expect(screen.getByText(/profile updated!/i)).toBeInTheDocument();
    });
  });

  /**
   * 10th test: If the API call is rejected,
   * we expect the UI to display "Failed to update profile".
   */
  test('displays error when update profile fails', async () => {
    /**
     * Mocking the `apiClient.post` error
     * This simulates an error when updating the profile
     */
    apiClient.post.mockRejectedValue(new Error("Failed to update profile"));

    /**
     * `render` mounts the `Auth` component in a simulated DOM environment.
     * After this call, `Auth` is effectively "on screen" for testing.
     */
    render(<Auth />);

    /**
     * We grab the input fields and signup button from the DOM
     * using placeholders/labels. React Testing Library offers
     * various query methods, such as getByPlaceholderText, getByRole, etc.
     */
    const firstNameInput = screen.getByPlaceholderText(/firstName/i);
    const lastNameInput = screen.getByPlaceholderText(/lastName/i);
    const updateProfileButton = screen.getByRole("button", { name: /updateprofile/i });

    /**
     * `userEvent.type` simulates typing into the input fields.
     * We enter a first and last name to mimc user input
     */
    await userEvent.type(firstNameInput, "Thomas");
    await userEvent.type(lastNameInput, "Tank");

    /**
     * Simulate a button click to trigger the Auth component's
     * handleUpdateProfile function, which calls `apiClient.post`.
     */
    userEvent.click(updateProfileButton);

    /**
     * `waitFor` is used to handle asynchronous changes in the DOM.
     * We wait until "failed to update profile" text appears,
     * confirming the component displays the success message.
     */
    await waitFor(() => {
      expect(screen.getByText(/failed to update profile/i)).toBeInTheDocument();
    });
  });
});