import { Merchant } from '@/types/merhcant';

const BASE_URL = `${process.env.SERVER_URL}/${process.env.API_VERSION}`;

const getAuthToken = (): string | null => {
  const token = localStorage.getItem('jwt');
  if (!token) {
    throw new Error('No authentication token found.');
  }
  return token;
};

export const fetchMerchantRequests = async (status: string): Promise<Merchant[]> => {
  const token = getAuthToken();
  const url = `${BASE_URL}/merchant/search${status ? `?status=${status}` : ''}`;
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      authorization: `${token}`,
    },
  });

  if (response.status === 404) {
    return [];
  }

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to fetch merchant requests: ${errorText}`);
  }

  const data = await response.json();
  if (data.length === 0) {
    throw new Error('No data');
  }

  return data;
};

export const updateMerchantStatus = async (merchantId: string, status: string): Promise<void> => {
  const token = getAuthToken();
  const response = await fetch(`${BASE_URL}/merchant/status/${merchantId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      authorization: `${token}`,
    },
    body: JSON.stringify({ status }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to update merchant status: ${errorText}`);
  }
};
