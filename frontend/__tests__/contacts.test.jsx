import apiClient from "@/lib/api-client";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import Contacts from "../src/pages/contacts/index";

describe("Contacts Page", () => {
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

    // Simulates a success when searching for users
    // Should return status 200 along with the message "users found"
    test('displays "Users found" when search users returns status 200', async () => {
        /**
         * Mocking the `apiClient.post` method to resolve with `{ status: 201 }`.
         * This simulates a successful searchresponse.
         */
        apiClient.post.mockResolvedValue({ status: 200 });
    
        /**
         * `render` mounts the `Auth` component in a simulated DOM environment.
         * After this call, `Auth` is effectively "on screen" for testing.
         */
        render(<Contacts />);
    
        /**
         * We grab the input fields and signup button from the DOM
         * using placeholders/labels. React Testing Library offers
         * various query methods, such as getByPlaceholderText, getByRole, etc.
         */
        const searchInput = screen.getByPlaceholderText(/search/i);
        
        const searchUsersButton = screen.getByRole("button", { name: /SearchUsers/i });
    
        /**
         * `userEvent.type` simulates typing into the input fields.
         * We enter a valid email and matching passwords to mimic user input.
         */
        await userEvent.type(searchInput, "Billy")
    
        /**
         * Simulate a button click to trigger the Auth component's
         * handleSearchUsers function, which calls `apiClient.post`.
         */
        userEvent.click(searchUsersButton);
    
        /**
         * `waitFor` is used to handle asynchronous changes in the DOM.
         * We wait until "Users found!" text appears,
         * confirming the component displays the success message.
         */
        await waitFor(() => {
          expect(screen.getByText(/users found/i)).toBeInTheDocument();
        });
      });

      // Simulates a failed case when searching for users due to lack of input
      // Should return "Missing search term" when status returns 400
      test('displays "Missing search term" when search users returns status 400', async () => {
        /**
         * Mocking the `apiClient.post` method to resolve with `{ status: 400 }`.
         * This simulates an unsuccessful search response.
         */
        apiClient.post.mockResolvedValue({ status: 400 });
    
        /**
         * `render` mounts the `Auth` component in a simulated DOM environment.
         * After this call, `Auth` is effectively "on screen" for testing.
         */
        render(<Contacts />);
    
        /**
         * We grab the input fields and signup button from the DOM
         * using placeholders/labels. React Testing Library offers
         * various query methods, such as getByPlaceholderText, getByRole, etc.
         */
        const searchInput = screen.getByPlaceholderText(/search/i);
        const searchUsersButton = screen.getByRole("button", { name: /SearchUsers/i });
    
        /**
         * `userEvent.type` simulates typing into the input fields.
         * We enter a search term to mimic user input.
         * An error seems to occur whenever just "" is enterd, so we enter in "?" which should
         * still get us the same result
         */
        await userEvent.type(searchInput, "a")
    
        /**
         * Simulate a button click to trigger the Auth component's
         * handleSearchUsers function, which calls `apiClient.post`.
         */
        userEvent.click(searchUsersButton);
    
        /**
         * `waitFor` is used to handle asynchronous changes in the DOM.
         * We wait until "Missing search term" text appears,
         * confirming the component displays the error message
         */
        await waitFor(() => {
          expect(screen.getByText(/Missing search term/i)).toBeInTheDocument();
        });
      });

      // Simulate an error occurring during the search process
      // Should return the message "Internal server error" when an error occurs
      test('displays "Internal server error" when an error occurs during user finding', async () => {
        /**
         * Mocking the `apiClient.post` method to resolve with an error
         * This simulates an unsuccessful search response.
         */
        apiClient.post.mockRejectedValue(new Error('Internal Service error'));
    
        /**
         * `render` mounts the `Auth` component in a simulated DOM environment.
         * After this call, `Auth` is effectively "on screen" for testing.
         */
        render(<Contacts />);
    
        /**
         * We grab the input fields and signup button from the DOM
         * using placeholders/labels. React Testing Library offers
         * various query methods, such as getByPlaceholderText, getByRole, etc.
         */
        const searchInput = screen.getByPlaceholderText(/search/i);
        const searchUsersButton = screen.getByRole("button", { name: /SearchUsers/i });
    
        /**
         * `userEvent.type` simulates typing into the input fields.
         * We enter a search term mimic user input.
         */
        await userEvent.type(searchInput, "Billy")
    
        /**
         * Simulate a button click to trigger the Auth component's
         * handleSearchUsers function, which calls `apiClient.post`.
         */
        userEvent.click(searchUsersButton);
    
        /**
         * `waitFor` is used to handle asynchronous changes in the DOM.
         * We wait until "Internal server error" text appears,
         * confirming the component displays the error message
         */
        await waitFor(() => {
          expect(screen.getByText(/Internal server error/i)).toBeInTheDocument();
        });
      });

    // Simulates a success when searching for all users
    // Should return status 200 along with the message "users found"
    test('displays "Users found" when search all users returns status 200', async () => {
        /**
         * Mocking the `apiClient.post` method to resolve with `{ status: 200 }`.
         * This simulates a successful search all response
         */
        apiClient.post.mockResolvedValue({ status: 200 });
    
        /**
         * `render` mounts the `Auth` component in a simulated DOM environment.
         * After this call, `Auth` is effectively "on screen" for testing.
         */
        render(<Contacts />);
    
        /**
         * We grab the input fields and signup button from the DOM
         * using placeholders/labels. React Testing Library offers
         * various query methods, such as getByPlaceholderText, getByRole, etc.
         */
        
        const searchAllButton = screen.getByRole("button", { name: /SearchAll/i });
    
        /**
         * Simulate a button click to trigger the Auth component's
         * handleSearchAll function, which calls `apiClient.post`.
         */
        userEvent.click(searchAllButton);
    
        /**
         * `waitFor` is used to handle asynchronous changes in the DOM.
         * We wait until "Users found!" text appears,
         * confirming the component displays the success message.
         */
        await waitFor(() => {
          expect(screen.getByText(/users found/i)).toBeInTheDocument();
        });
      });

    // Simulates an error when searching for all users
    // Should return an error along with the message "Internal Service error"
    test('displays "Internal Service Error" when an erroc occurs during getting all users', async () => {
        /**
         * Mocking the `apiClient.post` error.
         * This simulates an error when searching for users
         */
        apiClient.post.mockRejectedValue(new Error("Server error"));
    
        /**
         * `render` mounts the `Auth` component in a simulated DOM environment.
         * After this call, `Auth` is effectively "on screen" for testing.
         */
        render(<Contacts />);
    
        /**
         * We grab the input fields and signup button from the DOM
         * using placeholders/labels. React Testing Library offers
         * various query methods, such as getByPlaceholderText, getByRole, etc.
         */
        
        const searchAllButton = screen.getByRole("button", { name: /SearchAll/i });
    
        /**
         * Simulate a button click to trigger the Auth component's
         * handleSearchAll function, which calls `apiClient.post`.
         */
        userEvent.click(searchAllButton);
    
        /**
         * `waitFor` is used to handle asynchronous changes in the DOM.
         * We wait until "Internal server error" text appears,
         * confirming the component displays the success message.
         */
        await waitFor(() => {
          expect(screen.getByText(/Internal server error/i)).toBeInTheDocument();
        });
      });
});