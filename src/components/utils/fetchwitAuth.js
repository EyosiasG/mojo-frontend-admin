export async function fetchWithAuth(url, options = {}) {
  // Use a fallback for the token if the preferred key doesn't exist
  const token = localStorage.getItem("access_token") || localStorage.getItem("authToken");
  // console.log("Token retrieved:", token);

  if (!token) {
    console.error("Authentication token is missing.");
    throw new Error("Authentication token is missing.");
  }

  // Merge the headers with Authorization token
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
    ...options.headers, // Preserve any custom headers passed
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  // If response is not successful, throw an error
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url} - ${response.status} ${response.statusText}`);
  }

  // Return the entire response object for further processing
  return response;
}
