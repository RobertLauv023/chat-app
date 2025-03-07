import axios from "axios";

// Backend URL
const SERVER_URL = "http://localhost:8747";

async function callUserInfo() {

  try {
    // 5) Show loading message
    //alert("Fetching user info... Please wait.");

    const token = localStorage.getItem('jwt_token');

    // 6) Send request using Axios
    const response = await axios.get(
      `${SERVER_URL}/api/auth/userinfo`,
      { headers: 
        { "Content-Type": "application/json",
            'Authorization': `Bearer ${token}`
         } }
    );

    // 7) Success response
    const user = response.data;
    console.log("User info found:", response.data);
    /*
    alert("Email: " + user.userProfile.email + "\nName: " + user.userProfile.firstName + 
             " " + user.userProfile.lastName
    );
    */
    localStorage.setItem('email', user.userProfile.email);
    localStorage.setItem('firstName', user.userProfile.firstName);
    localStorage.setItem('lastName', user.userProfile.lastName);
  } catch (error) {
    // 8) Handle errors
    console.log("User info error:", error);
    const message =
      error.response?.data?.message || error.message || "Unknown error";
    alert(`Get user info error: ${message}`);
  }
}

// Attach function globally (for debugging in console)
window.callUserInfo = callUserInfo;