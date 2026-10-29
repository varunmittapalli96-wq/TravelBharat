const INTERNAL_API = process.env.INTERNAL_API_URL;
const PUBLIC_API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';

export async function serverFetch<T>(path: string, init?: RequestInit): Promise<T | null> {
  const primaryBase = INTERNAL_API || PUBLIC_API;
  const timeoutMs = 15000;

  // 1. Try primary URL (internal private network first if available)
  try {
    const res = await fetch(`${primaryBase}${path}`, {
      ...init,
      signal: AbortSignal.timeout(timeoutMs),
    });
    if (res.ok) {
      const json = await res.json();
      return (json.data !== undefined ? json.data : json) as T;
    }
  } catch (err) {
    console.warn(`[serverFetch] Primary endpoint ${primaryBase}${path} unreachable:`, err);
  }

  // 2. Fallback to PUBLIC_API if primary was INTERNAL_API and failed
  if (INTERNAL_API && INTERNAL_API !== PUBLIC_API) {
    try {
      const res = await fetch(`${PUBLIC_API}${path}`, {
        ...init,
        signal: AbortSignal.timeout(timeoutMs),
      });
      if (res.ok) {
        const json = await res.json();
        return (json.data !== undefined ? json.data : json) as T;
      }
    } catch (err) {
      console.warn(`[serverFetch] Fallback endpoint ${PUBLIC_API}${path} failed:`, err);
    }
  }

  return null;
}

