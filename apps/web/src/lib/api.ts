const PROD_BACKEND_URL = 'https://travelbharat-api-ne4e.onrender.com/api/v1';

export function getPublicApiUrl(): string {
  let url = process.env.NEXT_PUBLIC_API_URL;

  if (!url) {
    if (typeof window !== 'undefined' && window.location.hostname !== 'localhost') {
      return PROD_BACKEND_URL;
    }
    return 'http://localhost:4000/api/v1';
  }

  // Self-heal known configuration errors:
  if (
    url.includes('travelbharat-web.onrender.com') ||
    url === 'https://travelbharat-api.onrender.com' ||
    url === 'https://travelbharat-api.onrender.com/api/v1'
  ) {
    return PROD_BACKEND_URL;
  }

  // Remove trailing slashes
  url = url.replace(/\/+$/, '');

  // Ensure /api/v1 is appended
  if (!url.endsWith('/api/v1')) {
    url = `${url}/api/v1`;
  }

  return url;
}

interface FetchOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>;
}

export async function apiFetch<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
  const { params, ...fetchOptions } = options;
  const baseUrl = getPublicApiUrl();
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;

  let url = `${baseUrl}${cleanEndpoint}`;

  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        searchParams.set(key, String(value));
      }
    });
    const qs = searchParams.toString();
    if (qs) url += `?${qs}`;
  }

  const res = await fetch(url, {
    ...fetchOptions,
    headers: {
      'Content-Type': 'application/json',
      ...fetchOptions.headers,
    },
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    throw new Error(errorBody?.error?.message || `API error: ${res.status}`);
  }

  return res.json();
}
