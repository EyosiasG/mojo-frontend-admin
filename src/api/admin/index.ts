import { fetchWithAuth } from '@/components/utils/fetchwitAuth';


const BASE_URL = 'https://mojoapi.crosslinkglobaltravel.com/api';

interface User {
  created_at: string;
}

interface UserData {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  password: string;
  id_image: string | null;
  role: string;
}

interface UpdateUserData {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  id_image?: string | null;
  password?: string;
}

export const adminApi = {
    createUser: async (userData: UserData): Promise<any> => {
        const accessToken = localStorage.getItem("access_token");
        
        const response = await fetch(`${BASE_URL}/admin/users/store`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${accessToken}`,
          },
          body: JSON.stringify(userData),
        });
    
        if (!response.ok) {
          throw new Error("Failed to create user");
        }
    
        return response.json();
      },

  // Get all users
  getAllUsers: async () => {
    console.log('Making API request to:', `${BASE_URL}/customers`);
    const response = await fetchWithAuth(`${BASE_URL}/customers`);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('API Error:', errorData);
      throw new Error(errorData.message || `Server error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Raw API response:', data);
    
    if (!data.customers) {
      console.error('Invalid response format:', data);
      throw new Error('Invalid response format from server');
    }

    const sortedUsers = data.customers.sort((a: User, b: User) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
    
    console.log('Sorted users:', sortedUsers);
    return sortedUsers;
  },

  getAllAgents: async () => {
    console.log('Making API request to:', `${BASE_URL}/admin/agents`);
    const response = await fetchWithAuth(`${BASE_URL}/admin/agents`);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('API Error:', errorData);
      throw new Error(errorData.message || `Server error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Raw API response:', data);
    
    if (!data.agents) {
      console.error('Invalid response format:', data);
      throw new Error('Invalid response format from server');
    }

    const sortedAgents = data.agents.sort((a: User, b: User) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
    
    console.log('Sorted users:', sortedAgents);
    return sortedAgents;
  },



  getUserData: async (userId: string) => {
    const response = await fetch(`${BASE_URL}/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch user');
    }
    return response.json();
  },

  updateUser: async (userId: string, userData: UpdateUserData) => {
    const response = await fetch(`${BASE_URL}/users/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update user');
    }
    return response.json();
  },

  // Search users
  searchUsers: async (query: string) => {
    const response = await fetchWithAuth(`${BASE_URL}/users/search/${query}`);
    
    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    const data = await response.json();
    if (!data.data || data.data.length === 0) {
      throw new Error('User not found');
    }
    
    return data.data;
  },

  // Delete user
  deleteUser: async (userId: string | number) => {
    const response = await fetchWithAuth(`${BASE_URL}/users/${userId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    return true;
  },

  // Update user password
  updatePassword: async (userId: string | number, passwordData: {
    currentPassword: string;
    newPassword: string;
  }): Promise<any> => {
    const response = await fetchWithAuth(`${BASE_URL}/users/${userId}/password`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(passwordData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to update password');
    }

    return response.json();
  },

  getUser: async () => {
    const response = await fetchWithAuth(`${BASE_URL}/user`);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Failed to fetch authenticated user: ${response.status}`);
    }

    return response.json();
  },

  getMonthlyTransactions: async () =>{
    const response = await fetchWithAuth(`${BASE_URL}/admin/dashboard`);
    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.statusText}`);
    }

    const result = await response.json();
    
    if (result.status !== "success" || !result.transactions) {
      throw new Error('Invalid data format received from server');
    }

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthlyTotals = months.map((month, index) => ({
      name: month,
      value: Math.round((result.transactions[(index + 1).toString()] || 0) * 10) / 10
    }));

    return monthlyTotals;
  },

  getMonthlyUsers: async () => {
    const response = await fetchWithAuth(`${BASE_URL}/admin/dashboard`);
    const result = await response.json();
        
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthlyTotals = months.map((month, index) => ({
      name: month,
      actual: result.users?.[index + 1] || 0 // Changed from transactions to users
    }));

    return monthlyTotals;
  },

  getTotalTransactions: async () => {
    const response = await fetchWithAuth(`${BASE_URL}/admin/dashboard`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data;
  }
}; 