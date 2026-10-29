const PROD_BACKEND_URL = 'https://travelbharat-api-ne4e.onrender.com/api/v1';

export function getServerApiUrl(): string {
  let url =
    process.env.INTERNAL_API_URL ||
    process.env.API_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    (process.env.NODE_ENV === 'production' ? PROD_BACKEND_URL : 'http://localhost:4000/api/v1');

  // Self-heal known configuration errors:
  // 1. If pointing to the web frontend itself
  // 2. If pointing to the non-existent non-suffixed travelbharat-api host
  if (
    url.includes('travelbharat-web.onrender.com') ||
    url === 'https://travelbharat-api.onrender.com' ||
    url === 'https://travelbharat-api.onrender.com/api/v1' ||
    url.includes('localhost') && process.env.NODE_ENV === 'production'
  ) {
    url = PROD_BACKEND_URL;
  }

  // Remove trailing slashes
  url = url.replace(/\/+$/, '');

  // Ensure /api/v1 is appended if not present
  if (!url.endsWith('/api/v1')) {
    url = `${url}/api/v1`;
  }

  return url;
}

export async function serverFetch<T>(path: string, init?: RequestInit): Promise<T | null> {
  const base = getServerApiUrl();
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  const targetUrl = `${base}${cleanPath}`;
  const timeoutMs = 15000;

  // 1. Primary fetch
  try {
    const res = await fetch(targetUrl, {
      ...init,
      signal: AbortSignal.timeout(timeoutMs),
    });

    if (res.ok) {
      const json = await res.json();
      return (json.data !== undefined ? json.data : json) as T;
    }

    console.warn(`[serverFetch] ${targetUrl} returned HTTP ${res.status}`);
  } catch (err) {
    console.warn(`[serverFetch] Primary endpoint ${targetUrl} failed:`, err);
  }

  // 2. Fallback to production backend if primary failed and was different
  if (base !== PROD_BACKEND_URL && process.env.NODE_ENV === 'production') {
    try {
      const fallbackUrl = `${PROD_BACKEND_URL}${cleanPath}`;
      const res = await fetch(fallbackUrl, {
        ...init,
        signal: AbortSignal.timeout(timeoutMs),
      });

      if (res.ok) {
        const json = await res.json();
        return (json.data !== undefined ? json.data : json) as T;
      }
    } catch (err) {
      console.warn(`[serverFetch] Fallback ${PROD_BACKEND_URL} failed:`, err);
    }
  }

  return null;
}
