
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


// Fetch chat rooms on page load
window.onload = () => {
  fetchChatRooms();
};
