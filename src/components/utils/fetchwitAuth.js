export async function fetchWithAuth(url, options = {}) {
  const token = localStorage.getItem("access_token") || localStorage.getItem("authToken");

  if (!token) {
    const Swal = (await import('sweetalert2')).default;
    
    await Swal.fire({
      icon: 'error',
      title: 'Authentication Required',
      text: 'Please log in to continue.',
    });

    window.location.href = '/';
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
