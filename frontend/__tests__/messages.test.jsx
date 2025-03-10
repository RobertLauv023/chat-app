import apiClient from "@/lib/api-client";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import Messages from "../src/pages/messages/messages";

describe("Messages Page", () => {
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

    // Simulates a success when sending a message
    // Should return status 200 along with the message "message sent"
    test('displays "Message sent" when status returns with value 200', async () => {
        /**
         * Mocking the `apiClient.post` method to resolve with `{ status: 200 }`.
         * This simulates a successful send message response
         */
        apiClient.post.mockResolvedValue({ status: 200 });
    
        /**
         * `render` mounts the `Auth` component in a simulated DOM environment.
         * After this call, `Auth` is effectively "on screen" for testing.
         */
        render(<Messages />);
    
        /**
         * We grab the input fields and signup button from the DOM
         * using placeholders/labels. React Testing Library offers
         * various query methods, such as getByPlaceholderText, getByRole, etc.
         */
        const roomInput = screen.getByPlaceholderText(/roomName/i);
        const senderInput = screen.getByPlaceholderText(/sender/i);
        const messageInput = screen.getByPlaceholderText(/toSend/i);
        
        const sendMessageButton = screen.getByRole("button", { name: /Send/i });
    
        /**
         * `userEvent.type` simulates typing into the input fields.
         * We enter a room name, sender name, and message to mimic user input
         */
        await userEvent.type(roomInput, "A room");
        await userEvent.type(senderInput, "Bob");
        await userEvent.type(messageInput, "Anyone there?");
    
        /**
         * Simulate a button click to trigger the Auth component's
         * handleSendMessages function, which calls `apiClient.post`.
         */
        userEvent.click(sendMessageButton);
    
        /**
         * `waitFor` is used to handle asynchronous changes in the DOM.
         * We wait until "Message sent" text appears,
         * confirming the component displays the success message.
         */
        await waitFor(() => {
          expect(screen.getByText(/Message sent/i)).toBeInTheDocument();
        });
      });

    // Simulates a failure when sending a message with one or more empty fields
    // Should return status 400 along with the message "Missing roomName, sender, or message fields"
    test('displays "Missing roomName, sender, or message fields" when status 400 due to missing fields', async () => {
        /**
         * Mocking the `apiClient.post` method to resolve with `{ status: 400 }`.
         * This simulates a failed send message response.
         */
        apiClient.post.mockResolvedValue({ status: 400 });
    
        /**
         * `render` mounts the `Auth` component in a simulated DOM environment.
         * After this call, `Auth` is effectively "on screen" for testing.
         */
        render(<Messages />);
    
        /**
         * We grab the input fields and signup button from the DOM
         * using placeholders/labels. React Testing Library offers
         * various query methods, such as getByPlaceholderText, getByRole, etc.
         */
        const roomInput = screen.getByPlaceholderText(/roomName/i);
        const senderInput = screen.getByPlaceholderText(/sender/i);
        const messageInput = screen.getByPlaceholderText(/toSend/i);
        
        const sendMessageButton = screen.getByRole("button", { name: /Send/i });
    
        /**
         * `userEvent.type` simulates typing into the input fields.
         * We enter a room name, no sender name, and a message to mimic user input
         */
        await userEvent.type(roomInput, "A room");
        //await userEvent.type(senderInput, ""); // comment this out to test missing fields
        await userEvent.type(messageInput, "Anyone there?");
    
        /**
         * Simulate a button click to trigger the Auth component's
         * handleSendMessages function, which calls `apiClient.post`.
         */
        userEvent.click(sendMessageButton);
    
        /**
         * `waitFor` is used to handle asynchronous changes in the DOM.
         * We wait until "Missing roomName, sender, or message fields" text appears,
         * confirming the component displays and error message
         */
        await waitFor(() => {
          expect(screen.getByText(/Missing roomName, sender, or message fields/i)).toBeInTheDocument();
        });
      });

    // Simulates an error occuring while trying to send a message
    // Should return "Internal Service error" 
    test('displays "Internal service error" when an error occurs while trying to send messages', async () => {
        /**
         * Mocking the `apiClient.post` with an error
         * This simulates an error during sending messages
         */
        apiClient.post.mockRejectedValue(new Error("Server error"));
    
        /**
         * `render` mounts the `Auth` component in a simulated DOM environment.
         * After this call, `Auth` is effectively "on screen" for testing.
         */
        render(<Messages />);
    
        /**
         * We grab the input fields and signup button from the DOM
         * using placeholders/labels. React Testing Library offers
         * various query methods, such as getByPlaceholderText, getByRole, etc.
         */
        const roomInput = screen.getByPlaceholderText(/roomName/i);
        const senderInput = screen.getByPlaceholderText(/sender/i);
        const messageInput = screen.getByPlaceholderText(/toSend/i);
        
        const sendMessageButton = screen.getByRole("button", { name: /Send/i });
    
        /**
         * `userEvent.type` simulates typing into the input fields.
         * We enter a room name, sender name, and message to simulate user response
         */
        await userEvent.type(roomInput, "A room");
        await userEvent.type(senderInput, "Brand"); 
        await userEvent.type(messageInput, "Anyone there?");
    
        /**
         * Simulate a button click to trigger the Auth component's
         * handleSendMessages function, which calls `apiClient.post`.
         */
        userEvent.click(sendMessageButton);
    
        /**
         * `waitFor` is used to handle asynchronous changes in the DOM.
         * We wait until "Internal service error" text appears,
         * confirming the component displays the success message.
         */
        await waitFor(() => {
          expect(screen.getByText(/Internal service error/i)).toBeInTheDocument();
        });
      });

    // Simulates a success when retrieving messages
    // Should return status 200 along with the message "Message found"
    test('displays "Messages found" when status 200 after getting messages', async () => {
        /**
         * Mocking the `apiClient.post` method to resolve with `{ status: 200 }`.
         * This simulates a successful get message response
         */
        apiClient.post.mockResolvedValue({ status: 200 });
    
        /**
         * `render` mounts the `Auth` component in a simulated DOM environment.
         * After this call, `Auth` is effectively "on screen" for testing.
         */
        render(<Messages />);
    
        /**
         * We grab the input fields and signup button from the DOM
         * using placeholders/labels. React Testing Library offers
         * various query methods, such as getByPlaceholderText, getByRole, etc.
         */
        const roomInput = screen.getByPlaceholderText(/roomName/i);
        
        const getMessageButton = screen.getByRole("button", { name: /Get Messages/i });
    
        /**
         * `userEvent.type` simulates typing into the input fields.
         * We enter a room name to match user input
         */
        await userEvent.type(roomInput, "A room");
    
        /**
         * Simulate a button click to trigger the Auth component's
         * handleGetMessages function, which calls `apiClient.post`.
         */
        userEvent.click(getMessageButton);
    
        /**
         * `waitFor` is used to handle asynchronous changes in the DOM.
         * We wait until "Messages found" text appears,
         * confirming the component displays the success message.
         */
        await waitFor(() => {
          expect(screen.getByText(/Messages found/i)).toBeInTheDocument();
        });
      });

    // Simulates a failure when retrieving messages
    // Should return status 400 along with the message "Missing room name or room doesnt exist"
    test('displays "Missing room name or room doesnt exist" when status 400 after getting messages', async () => {
        /**
         * Mocking the `apiClient.post` method to resolve with `{ status: 400}`.
         * This simulates an unsuccessful message search
         */
        apiClient.post.mockResolvedValue({ status: 400 });
    
        /**
         * `render` mounts the `Auth` component in a simulated DOM environment.
         * After this call, `Auth` is effectively "on screen" for testing.
         */
        render(<Messages />);
    
        /**
         * We grab the input fields and signup button from the DOM
         * using placeholders/labels. React Testing Library offers
         * various query methods, such as getByPlaceholderText, getByRole, etc.
         */
        const roomInput = screen.getByPlaceholderText(/roomName/i);
        
        const getMessageButton = screen.getByRole("button", { name: /Get Messages/i });
    
    
        /**
         * Simulate a button click to trigger the Auth component's
         * handleGetMessagesfunction, which calls `apiClient.post`.
         */
        userEvent.click(getMessageButton);
    
        /**
         * `waitFor` is used to handle asynchronous changes in the DOM.
         * We wait until "Missing room name or room doesn't exist" text appears,
         * confirming the component displays the success message.
         */
        await waitFor(() => {
          expect(screen.getByText(/Missing room name or room doesn't exist/i)).toBeInTheDocument();
        });
      });

    // Simulates an error when trying to get messages
    // Should return an error message "Internal Service error"
    test('displays "Internal service error" when an error occurs while getting messages', async () => {
        /**
         * Mocking the `apiClient.post` with a rejected value.
         * This simulates an error occuring during the search
         */
        apiClient.post.mockRejectedValue(new Error("Server error"));
    
        /**
         * `render` mounts the `Auth` component in a simulated DOM environment.
         * After this call, `Auth` is effectively "on screen" for testing.
         */
        render(<Messages />);
    
        /**
         * We grab the input fields and signup button from the DOM
         * using placeholders/labels. React Testing Library offers
         * various query methods, such as getByPlaceholderText, getByRole, etc.
         */
        const roomInput = screen.getByPlaceholderText(/roomName/i);
        
        const getMessageButton = screen.getByRole("button", { name: /Get Messages/i });
    
    
        /**
         * Simulate a button click to trigger the Auth component's
         * handleGetMessage function, which calls `apiClient.post`.
         */
        userEvent.click(getMessageButton);
    
        /**
         * `waitFor` is used to handle asynchronous changes in the DOM.
         * We wait until "Internal service error" text appears,
         * confirming the component displays the success message.
         */
        await waitFor(() => {
          expect(screen.getByText(/Internal service error/i)).toBeInTheDocument();
        });
      });
});