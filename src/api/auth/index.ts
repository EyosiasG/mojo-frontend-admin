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
  
      return response;
      
    } catch (error) {
      throw error;
    }
  },
}; 
