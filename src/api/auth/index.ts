import { toast } from 'react-toastify';

const BASE_URL = 'https://mojoapi.crosslinkglobaltravel.com/api';

export const authApi = {
  // Agent login
  loginAgent: async (username: string, password: string) => {
    try {
      const response = await fetch(`${BASE_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: username, password })
      });

      return response;
      

    } catch (error) {
      toast.error('Login failed');
      return false;
    }
  },

  // Logout other sessions
  logoutOtherSessions: async (password: string) => {
    try {
      const response = await fetch(`${BASE_URL}/user/logout-sessions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        },
        body: JSON.stringify({ password })
      });

      return response;
      
    } catch (error) {
      throw error;
    }
  },

  // Admin login
  loginAdmin: async (username: string, password: string) => {
    try {
      const response = await fetch(`${BASE_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: username, password })
      });
  
      const data = await response.json();
      
      if (!response.ok) {
        toast.error(data.message || 'Admin login failed');
        return false;
      }
  
      console.log('Admin login response:', data);
      const token = data.token || data.access_token || data.accessToken;
      
      if (!token) {
        toast.error('Invalid server response: No token received');
        return false;
      }
  
      localStorage.setItem('admin_access_token', token);
      localStorage.setItem('admin', 'true');
      toast.success('Admin login successful');
      return true;
  
    } catch (error) {
      toast.error('Admin login failed');
      return false;
    }
  },
}; 
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

export const logoutOtherSessions = async (password: string) => {
  try {
    const response = await fetch('https://mojoapi.crosslinkglobaltravel.com/api/user/logout-sessions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`
      },
      body: JSON.stringify({ password })
    });

    const data = await response.json();
    
    if (!response.ok) {
      toast.error(data.message || 'Failed to logout other sessions');
      throw new Error('Failed to logout other sessions');
    }

    toast.success('Successfully logged out of other sessions');
    return true;

  } catch (error) {
    throw error;
  }
}; 