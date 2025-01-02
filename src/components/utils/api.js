const API_BASE_URL = "https://mojoapi.crosslinkglobaltravel.com/api"; // Replace with your API base URL

// Function to get the transfer creation page data (e.g., available banks, exchange rate, etc.)
export const getTransferData = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/transfers`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        // Add authorization header if required
        "Authorization": `Bearer ${localStorage.getItem("access_token")}`,
      },
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching transfer data:", error);
    throw error;
  }
};

export const getUserData = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/users`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("access_token")}`,
      },
    });
    return await response.json();
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error;
  }
};

// Function to store transfer data (submit the transaction)
export const storeTransferData = async (transferDetails) => { // Removed the TypeScript type annotation
  try {
    const response = await fetch(`${API_BASE_URL}/transfers`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Add authorization header if required
        "Authorization": `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(transferDetails),
    });

    if (!response.ok) {
      throw new Error("Failed to create transfer.");
    }
    const data = await response.json();
    return data; // Assuming the API returns a success response with relevant data
  } catch (error) {
    console.error("Error creating transfer:", error);
    throw error;
  }
};
