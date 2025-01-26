import { fetchWithAuth } from '@/components/utils/fetchwitAuth';
import { toast } from 'react-toastify';

const BASE_URL = 'https://mojoapi.crosslinkglobaltravel.com/api';

export const currenciesApi = {
  // Get all currencies
  getAllCurrencies: async () => {
    try {
      const response = await fetchWithAuth(`${BASE_URL}/admin/currencies`);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        toast.error(errorData.message || `Failed to fetch currencies: HTTP error! status: ${response.status}`);
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (!data.data) {
        toast.error('Invalid response format from server');
        throw new Error('Invalid response format from server');
      }

      toast.success('Currencies fetched successfully');
      return data.data;

    } catch (error) {
      toast.error('Error fetching currencies');
      throw error;
    }
  },
};
