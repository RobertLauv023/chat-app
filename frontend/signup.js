import axios from "axios";

// Backend URL
const SERVER_URL = "http://localhost:8747";

async function callSignup() {
  // 1) Get input elements
  const emailInput = document.getElementById("register-email");
  const passwordInput = document.getElementById("register-password");

  // 2) Check if elements exist
  if (!emailInput || !passwordInput) {
    console.error("Missing #email or #password element in HTML");
    alert("Error: Email or password field is missing.");
    return;
  }

  // 3) Extract values
  const email_sanitized = emailInput.value.trim();
  const email = escapeHtml(email_sanitized);
  const password = passwordInput.value.trim();


  // 4) Validate inputs
  if (!email || !password) {
    alert("Please enter both email and password.");
    return;
  }

  if (validateEmail(email)){
    try {
      // 5) Show loading message
      alert("Signing up... Please wait.");
  
      // 6) Send request using Axios
      const response = await axios.post(
        `${SERVER_URL}/api/auth/signup`,
        { email, password },
        { headers: { "Content-Type": "application/json" } }
      );
  
      // 7) Success response
      console.log("Signup successful:", response.data);
      alert("Signup successful!\n" + JSON.stringify(response.data, null, 2));
    } catch (error) {
      // 8) Handle errors
      console.error("Signup error:", error);
      const message =
        error.response?.data?.message || error.message || "Unknown error";
      alert(`Signup error: ${message}`);
    }
  } else {
    alert("Invalid email format. Please enter again.");
  }

}

// Check to ensure a valid email format is used
function validateEmail(email) {
  // Regular expression for validating email format
  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  
  return regex.test(email); // Returns true if the email matches the regex
}

// Escape user inputs to avoid any code injection
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
window.callSignup = callSignup;