import { fetchWithAuth } from '@/components/utils/fetchwitAuth';

const BASE_URL = 'https://mojoapi.crosslinkglobaltravel.com/api';

export const banksApi = {
  // Get all banks
  getAllBanks: async () => {
    const response = await fetchWithAuth(`${BASE_URL}/transfers/create`);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    if (!Array.isArray(data.banks)) {
      throw new Error('Invalid response format: banks array not found');
    }

    return data.banks;
  },
};
