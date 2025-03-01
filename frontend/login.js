import axios from "axios";

// Backend URL
const SERVER_URL = "http://localhost:8747";

async function callLogin() {
  // 1) Get input elements
  const emailInput = document.getElementById("login-email");
  const passwordInput = document.getElementById("login-password");

  // 2) Check if elements exist
  if (!emailInput || !passwordInput) {
    console.error("Missing #email or #password element in HTML");
    alert("Error: Email or password field is missing.");
    return;
  }

  // 3) Extract values
  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();

  // 4) Validate inputs
  if (!email || !password) {
    alert("Please enter both email and password.");
    return;
  }

  try {
    // 5) Show loading message
    alert("Logging in... Please wait.");

    // 6) Send request using Axios
    const response = await axios.post(
      `${SERVER_URL}/api/auth/login`,
      { email, password },
      { headers: { "Content-Type": "application/json" } }
    );

    // 7) Success response
    console.log("Login successful:", response.data);
    alert("Login successful!\n");

    localStorage.setItem('jwt_token', response.data.token);


    window.location.href = "homepage.html";
  } catch (error) {
    // 8) Handle errors
    console.error("Login error:", error);
    const message =
      error.response?.data?.message || error.message || "Unknown error";
    alert(`Login error: ${message}`);
  }
}

// Attach function globally (for debugging in console)
window.callLogin = callLogin;