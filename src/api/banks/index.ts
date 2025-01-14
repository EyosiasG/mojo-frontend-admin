import { fetchWithAuth } from '@/components/utils/fetchwitAuth';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

export const banksApi = {
  // Get all banks
  getAllBanks: async () => {
    if (!BASE_URL) {
      throw new Error('BASE_URL is not configured');
    }
    
    const response = await fetchWithAuth(`${BASE_URL}/transfers/create`);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    if (!Array.isArray(data.banks)) {
      throw new Error('Invalid response format: banks array not found');
    }
    console.log("Banks: ", data.banks);
    return data.banks;
  },
};
