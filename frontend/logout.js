import axios from "axios";

// Backend URL
const SERVER_URL = "http://localhost:8747";

async function callLogout() {
  try {
    // 5) Show loading message
    alert("Logging out... Please wait.");

    // 6) Send request using Axios
    const response = await axios.post(
      `${SERVER_URL}/api/auth/logout`,
      { headers: { "Content-Type": "application/json" } }
    );

    // 7) Success response
    console.log("Logout successful:");

    alert("Logout successful!\n");
    
    localStorage.removeItem('jwt_token'); // Remove the JWT token
     
    window.location.href = "index.html"; // Take user back to login page
  } catch (error) {
    // 8) Handle errors
    console.error("Logout error:", error);
    const message =
      error.response?.data?.message || error.message || "Unknown error";
    alert(`Logout error: ${message}`);
  }
}

// Attach function globally (for debugging in console)
window.callLogout = callLogout;