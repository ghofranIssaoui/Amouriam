const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

interface RequestOptions extends RequestInit {
  token?: string;
  data?: any;
}

export async function client<T>(
  endpoint: string,
  { data, token, headers: customHeaders, ...customConfig }: RequestOptions = {}
): Promise<T> {
  const config: RequestInit = {
    method: data ? 'POST' : 'GET',
    body: data ? JSON.stringify(data) : undefined,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...customHeaders,
    },
    ...customConfig,
  };

  return window.fetch(`${API_URL}${endpoint}`, config).then(async (response) => {
    const data = await response.json().catch(() => ({}));

    if (response.ok) {
      return data;
    } else {
      return Promise.reject(data);
    }
  });
}
