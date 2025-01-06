import { toast } from 'react-toastify';

export const loginAgent = async (username: string, password: string) => {
  try {
    const response = await fetch('https://mojoapi.crosslinkglobaltravel.com/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: username, password })
    });

    const data = await response.json();
    
    if (!response.ok) {
      toast.error(data.message || 'Login failed');
      return false;
    }

    console.log('Login response:', data);
    const token = data.token || data.access_token || data.accessToken;
    
    if (!token) {
      toast.error('Invalid server response: No token received');
      return false;
    }

    localStorage.setItem('access_token', token);
    localStorage.setItem('agent', 'true');
    toast.success('Login successful');
    return true;

  } catch (error) {
    toast.error('Login failed');
    return false;
  }
}; 