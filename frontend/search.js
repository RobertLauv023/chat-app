import axios from "axios";

// Backend URL
const SERVER_URL = "http://localhost:8747";

async function callSearch() {
  // 1) Get input elements
  const searchInput = document.getElementById("search-term");

  // 2) Check if elements exist
  if (!searchInput) {
    console.error("Missing #search-term element in HTML");
    alert("Error: Search term field is missing.");
    return;
  }

  // 3) Extract values
  const searchTerm = searchInput.value.trim();

  // 4) Validate inputs
  if (!searchTerm) {
    alert("Please enter a term to search for");
    return;
  }

  try {
    // 5) Show loading message
    alert("Searching for users... Please wait.");

    // 6) Send request using Axios
    const response = await axios.post(
      `${SERVER_URL}/api/contacts/search`,
      { searchTerm },
      { headers: { "Content-Type": "application/json" } }
    );

    // 7) Success response
    console.log("Search successful:", response.data);
    return response.data;

  } catch (error) {
    // 8) Handle errors
    console.error("Search error:", error);
    const message =
      error.response?.data?.message || error.message || "Unknown error";
    alert(`Search error: ${message}`);
  }
}

// Attach function globally (for debugging in console)
window.callSearch = callSearch;