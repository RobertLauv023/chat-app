//const socket = io('http://localhost:8747');

// Function to create a new chat room
/*
function createChatRoom() {
  const chatRoomName = document.getElementById('chatRoomName').value;
  const statusElement = document.getElementById('create-room-status');
  
  if (!chatRoomName) {
    statusElement.textContent = "Chat room name is required!";
    return;
  }
  
  // Send request to create a new chat room
  fetch('/chatrooms/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ name: chatRoomName })
  })
    .then(response => response.json())
    .then(data => {
      statusElement.textContent = `Chat room '${data.name}' created successfully!`;
      fetchChatRooms();  // Refresh the list of chat rooms after creation
      document.getElementById('chatRoomId').value = data._id; // Pre-fill the room ID for joining
    })
    .catch(error => {
      statusElement.textContent = 'Error creating chat room!';
      console.error('Error:', error);
    });
}*/

// Function to fetch and display all chat rooms
function fetchChatRooms() {
  fetch('/api/chatrooms/get-chatrooms')
    .then(response => response.json())
    .then(chatRooms => {
      const chatRoomList = document.getElementById('chatRoomList');
      chatRoomList.innerHTML = '';  // Clear existing list

      // Loop through each chat room and create a list item
      chatRooms.forEach(room => {
        const listItem = document.createElement('li');
        listItem.textContent = room.name;
        
        // Add a click event to join the room when clicked
        listItem.addEventListener('click', () => {
          joinChatRoom(room._id);
        });
        
        chatRoomList.appendChild(listItem);
      });
    })
    .catch(error => {
      console.error('Error fetching chat rooms:', error);
    });
}

/*
// Function to join a chat room
function joinChatRoom(roomId) {
  socket.emit('joinRoom', roomId);  // Join the room via Socket.IO

  // Fetch chat history from the server
  fetch(`/messages/${roomId}/messages`)
    .then(response => response.json())
    .then(messages => {
      document.getElementById('chat').innerHTML = '';  // Clear the chat window
      messages.forEach(displayMessage);
    })
    .catch(error => {
      console.error('Error fetching messages:', error);
    });
}
    */

// Function to send a message to a chat room

/*
function sendMessageToRoom() {
  const chatRoomId = document.getElementById('chatRoomId').value;
  const sender = 'user1';  // Assuming user1 as the sender for demo
  const message = document.getElementById('messageInput').value;

  if (!message) {
    alert("Message cannot be empty!");
    return;
  }

  // Emit the message to the server via Socket.IO
  socket.emit('sendMessage', { chatRoomId, sender, message });

  // Optionally, save the message to the database
  fetch('/messages/send', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ chatRoomId, sender, message }),
  });

  // Display the message on the chat window
  displayMessage({ sender, message });
  document.getElementById('messageInput').value = ''; // Clear input
}

// Function to display a message
function displayMessage(message) {
  const messageElement = document.createElement('div');
  messageElement.textContent = `${message.sender}: ${message.message}`;
  document.getElementById('chat').appendChild(messageElement);
}

// Listen for incoming messages for a chat room
socket.on('receiveMessage', (data) => {
  displayMessage(data);
});

// Function to send a direct message (DM)
function sendDirectMessage() {
  const sender = 'user1';  // Assuming user1 as the sender
  const recipient = document.getElementById('dmRecipient').value;
  const message = document.getElementById('messageInput').value;

  if (!recipient || !message) {
    alert("Recipient and message are required!");
    return;
  }

  // Emit the direct message to the server via Socket.IO
  socket.emit('sendDM', { sender, recipient, message });

  // Optionally, save the DM to the database
  fetch('/messages/send', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ sender, recipient, message }),
  });

  // Display the DM on the screen
  displayMessage({ sender, message });
  document.getElementById('messageInput').value = '';  // Clear input
}

// Listen for direct messages
socket.on('receiveDM', (data) => {
  const dmStatus = document.getElementById('dm-status');
  dmStatus.textContent = `${data.sender}: ${data.message}`;
});
*/

// Fetch chat rooms on page load
window.onload = () => {
  fetchChatRooms();
};
