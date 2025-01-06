import { fetchWithAuth } from '@/components/utils/fetchwitAuth';

const BASE_URL = 'https://mojoapi.crosslinkglobaltravel.com/api';

export const currenciesApi = {
  // Get all currencies
  getAllCurrencies: async () => {
    const response = await fetchWithAuth(`${BASE_URL}/currencies`);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    if (!data.data) {
      throw new Error('Invalid response format from server');
    }

    return data.data;
  },
};
