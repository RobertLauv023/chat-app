import axios from "axios";

// Backend URL
const SERVER_URL = "http://localhost:8747";

async function callUpdateProfile() {
  // 1) Get input elements
  
  const firstNameInput = document.getElementById("firstName");
  const lastNameInput = document.getElementById("lastName");

  // 2) Check if elements exist
  if (!firstNameInput || !lastNameInput) {
    console.error("Missing #firstName or #lastName element in HTML");
    alert("Error: First name or last name field is missing.");
    return;
  }

  // 3) Extract values
  const firstName_sanitize = firstNameInput.value.trim();
  const lastName_sanitize = lastNameInput.value.trim();

  const firstName = escapeHtml(firstName_sanitize);
  const lastName = escapeHtml(lastName_sanitize);

  // 4) Validate inputs
  if (!firstName || !lastName) {
    alert("Please enter both first and last name.");
    return;
  }

  try {
    // 5) Show loading message
    alert("Updating profile... Please wait.");

    const token = localStorage.getItem('jwt_token');

    // 6) Send request using Axios
    const response = await axios.post(
      `${SERVER_URL}/api/auth/update-profile`,
      { firstName, lastName },
      { headers: 
        { "Content-Type": "application/json",
            'Authorization': `Bearer ${token}`
         } }
    );

    // 7) Success response
    console.log("Profile update successful:", response.data);
    alert("Profile updated!");

    localStorage.setItem('firstName', firstName);
    localStorage.setItem('lastName', lastName);
  } catch (error) {
    // 8) Handle errors
    console.log("Profile update error:", error);
    const message =
      error.response?.data?.message || error.message || "Unknown error";
    alert(`Profile update error: ${message}`);
  }
}

function escapeHtml(str) {
  return str.replace(/[&<>"'`=\/]/g, function(match) {
      const map = {
          '&': '&amp;',
          '<': '&lt;',
          '>': '&gt;',
          '"': '&quot;',
          "'": '&apos;',
          '`': '&#96;',
          '=': '&#61;',
          '/': '&#47;'
      };
      return map[match];
  });
}


// Attach function globally (for debugging in console)
window.callUpdateProfile = callUpdateProfile;