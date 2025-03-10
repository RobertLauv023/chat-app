import apiClient from "@/lib/api-client";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import Chatrooms from "../src/pages/chatrooms/chatrooms";

describe("Chatrooms Page", () => {
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

    // Simulates a success when creating a chat room
    // Should return status 200 along with the message "chat room created"
    test('displays "Chatroom created!" when status returns with value 200', async () => {
        /**
         * Mocking the `apiClient.post` method to resolve with `{ status: 200 }`.
         * This simulates a successful create room response
         */
        apiClient.post.mockResolvedValue({ status: 200 });
    
        /**
         * `render` mounts the `Auth` component in a simulated DOM environment.
         * After this call, `Auth` is effectively "on screen" for testing.
         */
        render(<Chatrooms />);
    
        /**
         * We grab the input fields and signup button from the DOM
         * using placeholders/labels. React Testing Library offers
         * various query methods, such as getByPlaceholderText, getByRole, etc.
         */
        const roomInput = screen.getByPlaceholderText(/roomName/i);
        
        const createRoomButton = screen.getByRole("button", { name: /Create Room/i });
    
        /**
         * `userEvent.type` simulates typing into the input fields.
         * We enter a room name to mimic user input
         */
        await userEvent.type(roomInput, "NewRoom")
    
        /**
         * Simulate a button click to trigger the Auth component's
         * handleCreateRoom function, which calls `apiClient.post`.
         */
        userEvent.click(createRoomButton);
    
        /**
         * `waitFor` is used to handle asynchronous changes in the DOM.
         * We wait until "Chatroom created!" text appears,
         * confirming the component displays the success message.
         */
        await waitFor(() => {
          expect(screen.getByText(/Chatroom created!/i)).toBeInTheDocument();
        });
      });


      // Simulates an error when trying to create a room with a duplicate name
    // Should return status 409 along with the message "Room name already exists"
    test('displays "Room name already exists" when status returns with value 409', async () => {
        /**
         * Mocking the `apiClient.post` method to resolve with `{ status: 201 }`.
         * This simulates a failed room creation response
         */
        apiClient.post.mockResolvedValue({ status: 409 });
    
        /**
         * `render` mounts the `Auth` component in a simulated DOM environment.
         * After this call, `Auth` is effectively "on screen" for testing.
         */
        render(<Chatrooms />);
    
        /**
         * We grab the input fields and signup button from the DOM
         * using placeholders/labels. React Testing Library offers
         * various query methods, such as getByPlaceholderText, getByRole, etc.
         */
        const roomInput = screen.getByPlaceholderText(/roomName/i);
        
        const createRoomButton = screen.getByRole("button", { name: /Create Room/i});
    
        /**
         * `userEvent.type` simulates typing into the input fields.
         * We enter a room name to mimic user input
         */
        await userEvent.type(roomInput, "NewRoom")
    
        /**
         * Simulate a button click to trigger the Auth component's
         * handleCreateRoom function, which calls `apiClient.post`.
         */
        userEvent.click(createRoomButton);
    
        /**
         * `waitFor` is used to handle asynchronous changes in the DOM.
         * We wait until "Room name already exists" text appears,
         * confirming the component displays the success message.
         */
        await waitFor(() => {
          expect(screen.getByText(/Room name already exists/i)).toBeInTheDocument();
        });
      });

    // Simulates an error when trying to create a room with a missing room name field
    // Should return status 400 along with the message "Room name already exists"
    test('displays "Missing room name field" when status returns with value 400', async () => {
        /**
         * Mocking the `apiClient.post` method to resolve with `{ status: 400 }`.
         * This simulates a failed room creation response
         */
        apiClient.post.mockResolvedValue({ status: 400 });
    
        /**
         * `render` mounts the `Auth` component in a simulated DOM environment.
         * After this call, `Auth` is effectively "on screen" for testing.
         */
        render(<Chatrooms />);
    
        /**
         * We grab the input fields and signup button from the DOM
         * using placeholders/labels. React Testing Library offers
         * various query methods, such as getByPlaceholderText, getByRole, etc.
         */
        const roomInput = screen.getByPlaceholderText(/roomName/i);
        
        const createRoomButton = screen.getByRole("button", { name: /Create Room/i});
    
        /**
         * `userEvent.type` simulates typing into the input fields.
         * We enter room name to mimic user input
         */
        await userEvent.type(roomInput, "a")
    
        /**
         * Simulate a button click to trigger the Auth component's
         * handleCreateRoom function, which calls `apiClient.post`.
         */
        userEvent.click(createRoomButton);
    
        /**
         * `waitFor` is used to handle asynchronous changes in the DOM.
         * We wait until "Missing room name field" text appears,
         * confirming the component displays the success message.
         */
        await waitFor(() => {
          expect(screen.getByText(/Missing room name field/i)).toBeInTheDocument();
        });
      });

    // Simulates an error when trying to create a room
    // Should return "Internal service error" when trying to create a chat room
    test('displays "Internal server error" when an error occurs during room creation', async () => {
        /**
         * Mocking the `apiClient.post` error
         * This simulates an error when creating a chat room
         */
        apiClient.post.mockRejectedValue(new Error("Server error"));
    
        /**
         * `render` mounts the `Auth` component in a simulated DOM environment.
         * After this call, `Auth` is effectively "on screen" for testing.
         */
        render(<Chatrooms />);
    
        /**
         * We grab the input fields and signup button from the DOM
         * using placeholders/labels. React Testing Library offers
         * various query methods, such as getByPlaceholderText, getByRole, etc.
         */
        const roomInput = screen.getByPlaceholderText(/roomName/i);
        
        const createRoomButton = screen.getByRole("button", { name: /Create Room/i});
    
        /**
         * `userEvent.type` simulates typing into the input fields.
         * We enter a room name to mimic user input
         */
        await userEvent.type(roomInput, "a")
    
        /**
         * Simulate a button click to trigger the Auth component's
         * handleCreateRooms function, which calls `apiClient.post`.
         */
        userEvent.click(createRoomButton);
    
        /**
         * `waitFor` is used to handle asynchronous changes in the DOM.
         * We wait until "Internal Server error" text appears,
         * confirming the component displays the success message.
         */
        await waitFor(() => {
          expect(screen.getByText(/Internal Server error/i)).toBeInTheDocument();
        });
      });

    // Simulates a success when getting chat rooms
    // Should return status 200 along with the message "Chat rooms found"
    test('displays "Chat rooms found" when status returns with value 200', async () => {
        /**
         * Mocking the `apiClient.post` method to resolve with `{ status: 200 }`.
         * This simulates a successful get rooms response
         */
        apiClient.post.mockResolvedValue({ status: 200 });
    
        /**
         * `render` mounts the `Auth` component in a simulated DOM environment.
         * After this call, `Auth` is effectively "on screen" for testing.
         */
        render(<Chatrooms />);
    
        /**
         * We grab the input fields and signup button from the DOM
         * using placeholders/labels. React Testing Library offers
         * various query methods, such as getByPlaceholderText, getByRole, etc.
         */
        
        const getRoomsButton = screen.getByRole("button", { name: /Get Rooms/i});
    
        /**
         * Simulate a button click to trigger the Auth component's
         * handleGetRooms function, which calls `apiClient.post`.
         */
        userEvent.click(getRoomsButton);
    
        /**
         * `waitFor` is used to handle asynchronous changes in the DOM.
         * We wait until "Chat rooms found!" text appears,
         * confirming the component displays the success message.
         */
        await waitFor(() => {
          expect(screen.getByText(/Chat rooms found!/i)).toBeInTheDocument();
        });
      });

    // Simulates a failure(?) when there's no existing chat rooms.
    // Should return status 400 along with the message "No chat rooms found"
    test('displays "No chat rooms found" when status returns with value 400', async () => {
        /**
         * Mocking the `apiClient.post` method to resolve with `{ status: 400 }`.
         * This simulates a failed get rooms response
         */
        apiClient.post.mockResolvedValue({ status: 400 });
    
        /**
         * `render` mounts the `Auth` component in a simulated DOM environment.
         * After this call, `Auth` is effectively "on screen" for testing.
         */
        render(<Chatrooms />);
    
        /**
         * We grab the input fields and signup button from the DOM
         * using placeholders/labels. React Testing Library offers
         * various query methods, such as getByPlaceholderText, getByRole, etc.
         */
        
        const getRoomsButton = screen.getByRole("button", { name: /Get Rooms/i});
    
        /**
         * Simulate a button click to trigger the Auth component's
         * handleGetRooms function, which calls `apiClient.post`.
         */
        userEvent.click(getRoomsButton);
    
        /**
         * `waitFor` is used to handle asynchronous changes in the DOM.
         * We wait until "No chat rooms found" text appears,
         * confirming the component displays the success message.
         */
        await waitFor(() => {
          expect(screen.getByText(/No chat rooms found/i)).toBeInTheDocument();
        });
      });

    // Simulates an error when trying to get chat rooms.
    // Should return a message "Internal server error"
    test('displays "Internal server error" when an error occurs while getting chat rooms', async () => {
        /**
         * Mocking the `apiClient.post` error
         * This simulates an error when getting rooms
         */
        apiClient.post.mockRejectedValue(new Error("Internal server error"));
    
        /**
         * `render` mounts the `Auth` component in a simulated DOM environment.
         * After this call, `Auth` is effectively "on screen" for testing.
         */
        render(<Chatrooms />);
    
        /**
         * We grab the input fields and signup button from the DOM
         * using placeholders/labels. React Testing Library offers
         * various query methods, such as getByPlaceholderText, getByRole, etc.
         */
        
        const getRoomsButton = screen.getByRole("button", { name: /Get Rooms/i});
    
        /**
         * Simulate a button click to trigger the Auth component's
         * handleGetRooms function, which calls `apiClient.post`.
         */
        userEvent.click(getRoomsButton);
    
        /**
         * `waitFor` is used to handle asynchronous changes in the DOM.
         * We wait until "Internal server error" text appears,
         * confirming the component displays the success message.
         */
        await waitFor(() => {
          expect(screen.getByText(/Internal server error/i)).toBeInTheDocument();
        });
      });

    // Simulates a success when trying to delete a chat rooms
    // Should return a message "Chat room deleted"
    test('displays "Chat room deleted" when status 200 after deleting a chat room', async () => {
        /**
         * Mocking the `apiClient.post` method to resolve with `{ status: 200 }`.
         * This simulates a successful delete room response
         */
        apiClient.post.mockResolvedValue({ status: 200 })
    
        /**
         * `render` mounts the `Auth` component in a simulated DOM environment.
         * After this call, `Auth` is effectively "on screen" for testing.
         */
        render(<Chatrooms />);
    
        /**
         * We grab the input fields and signup button from the DOM
         * using placeholders/labels. React Testing Library offers
         * various query methods, such as getByPlaceholderText, getByRole, etc.
         */
        const roomInput = screen.getByPlaceholderText(/roomName/i);
        const deleteRoomsButton = screen.getByRole("button", { name: /Delete Room/i});
    
        /**
         * `userEvent.type` simulates typing into the input fields.
         * We enter a valid email and matching passwords to mimic user input.
         */
        await userEvent.type(roomInput, "DeleteRoom")
        /**
         * Simulate a button click to trigger the Auth component's
         * handleDeleteRooms function, which calls `apiClient.post`.
         */
        userEvent.click(deleteRoomsButton);
    
        /**
         * `waitFor` is used to handle asynchronous changes in the DOM.
         * We wait until "Chat room deleted" text appears,
         * confirming the component displays the success message.
         */
        await waitFor(() => {
          expect(screen.getByText(/Chat room deleted/i)).toBeInTheDocument();
        });
      });

    // Simulates failure when trying to delete a non-existent chat room
    // Should return a message "Internal server error"
    test('displays "Chat room does not exist" when status 404 due to trying to delete non-existent chat room', async () => {
        /**
         * Mocking the `apiClient.post` method to resolve with `{ status: 404 }`.
         * This simulates a failed delete room response.
         */
        apiClient.post.mockResolvedValue({ status: 404 })
    
        /**
         * `render` mounts the `Auth` component in a simulated DOM environment.
         * After this call, `Auth` is effectively "on screen" for testing.
         */
        render(<Chatrooms />);
    
        /**
         * We grab the input fields and signup button from the DOM
         * using placeholders/labels. React Testing Library offers
         * various query methods, such as getByPlaceholderText, getByRole, etc.
         */
        const roomInput = screen.getByPlaceholderText(/roomName/i);
        const deleteRoomsButton = screen.getByRole("button", { name: /Delete Room/i});
    
        /**
         * `userEvent.type` simulates typing into the input fields.
         * We enter a room name to mimic user input
         */
        await userEvent.type(roomInput, "FakeRoom")
        /**
         * Simulate a button click to trigger the Auth component's
         * handleDeleteRooms function, which calls `apiClient.post`.
         */
        userEvent.click(deleteRoomsButton);
    
        /**
         * `waitFor` is used to handle asynchronous changes in the DOM.
         * We wait until "Chat room does not exist" text appears,
         * confirming the component displays the success message.
         */
        await waitFor(() => {
          expect(screen.getByText(/Chat room does not exist/i)).toBeInTheDocument();
        });
      });


    // Simulates failure when attempting to delete without room name input
    // Should return a message "Missing or invalid room name
    test('displays "Missing or invalid room name" when status 400 due not inputting room name', async () => {
        /**
         * Mocking the `apiClient.post` method to resolve with `{ status: 400 }`.
         * This simulates a failed delete room response
         */
        apiClient.post.mockResolvedValue({ status: 400 })
    
        /**
         * `render` mounts the `Auth` component in a simulated DOM environment.
         * After this call, `Auth` is effectively "on screen" for testing.
         */
        render(<Chatrooms />);
    
        /**
         * We grab the input fields and signup button from the DOM
         * using placeholders/labels. React Testing Library offers
         * various query methods, such as getByPlaceholderText, getByRole, etc.
         */
        const roomInput = screen.getByPlaceholderText(/roomName/i);
        const deleteRoomsButton = screen.getByRole("button", { name: /Delete Room/i});
    
        /**
         * `userEvent.type` simulates typing into the input fields.
         * We enter a room name to mimic user input
         */
        await userEvent.type(roomInput, "a")
        /**
         * Simulate a button click to trigger the Auth component's
         * handleDeleteRooms function, which calls `apiClient.post`.
         */
        userEvent.click(deleteRoomsButton);
    
        /**
         * `waitFor` is used to handle asynchronous changes in the DOM.
         * We wait until "/Missing or invalid room name" text appears,
         * confirming the component displays the success message.
         */
        await waitFor(() => {
          expect(screen.getByText(/Missing or invalid room name/i)).toBeInTheDocument();
        });
      });

    // Simulates an error when trying to delete a chat room
    // Should return a message "Internal service error"
    test('displays "Internal service error" when an error occurs during room deletion', async () => {
        /**
         * Mocking the `apiClient.post` with an error
         * This simulates an error with delete chat room 
         */
        apiClient.post.mockRejectedValue(new Error("Server error"));
    
        /**
         * `render` mounts the `Auth` component in a simulated DOM environment.
         * After this call, `Auth` is effectively "on screen" for testing.
         */
        render(<Chatrooms />);
    
        /**
         * We grab the input fields and signup button from the DOM
         * using placeholders/labels. React Testing Library offers
         * various query methods, such as getByPlaceholderText, getByRole, etc.
         */
        const roomInput = screen.getByPlaceholderText(/roomName/i);
        const deleteRoomsButton = screen.getByRole("button", { name: /Delete Room/i});
    
        /**
         * `userEvent.type` simulates typing into the input fields.
         * We enter a room name to mimic user input
         */
        await userEvent.type(roomInput, "Room")
        /**
         * Simulate a button click to trigger the Auth component's
         * handleDeleteRooms function, which calls `apiClient.post`.
         */
        userEvent.click(deleteRoomsButton);
    
        /**
         * `waitFor` is used to handle asynchronous changes in the DOM.
         * We wait until "Internal service error!" text appears,
         * confirming the component displays the success message.
         */
        await waitFor(() => {
          expect(screen.getByText(/Internal service error/i)).toBeInTheDocument();
        });
      });
});
