// app/lib/api/index.ts

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export const fetchFromApi = async (
  endpoint: string,
  options: RequestInit = {}
) => {
  // Always prepend /api here
  const url = `${API_BASE_URL}/api${endpoint}`;

  console.log('Final API URL:', url);

  const defaultHeaders = {
    'Content-Type': 'application/json',
  };

  const config: RequestInit = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
    credentials: 'include', // needed for auth / cookies
  };

  try {
    const response = await fetch(url, config);

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`API ${response.status}: ${text}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
};
