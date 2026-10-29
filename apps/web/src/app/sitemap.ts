import { MetadataRoute } from 'next';
import { serverFetch } from '../lib/server-api';

export const dynamic = 'force-dynamic';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://travelbharat-web.onrender.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const routes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}`, lastModified: new Date(), priority: 1.0 },
    { url: `${SITE_URL}/states`, lastModified: new Date(), priority: 0.9 },
    { url: `${SITE_URL}/explore`, lastModified: new Date(), priority: 0.9 },
    { url: `${SITE_URL}/saved`, lastModified: new Date(), priority: 0.5 },
    { url: `${SITE_URL}/about`, lastModified: new Date(), priority: 0.6 },
    { url: `${SITE_URL}/contact`, lastModified: new Date(), priority: 0.6 },
  ];

  try {
    const [states, places] = await Promise.all([
      serverFetch<any[]>('/states'),
      serverFetch<any[]>('/places?limit=100'),
    ]);

    if (states && Array.isArray(states)) {
      for (const s of states) {
        routes.push({
          url: `${SITE_URL}/states/${s.slug}`,
          lastModified: new Date(),
          priority: 0.8,
        });
      }
    }

    if (places && Array.isArray(places)) {
      for (const p of places) {
        routes.push({
          url: `${SITE_URL}/places/${p.slug}`,
          lastModified: new Date(),
          priority: 0.85,
        });
      }
    }
  } catch (err) {
    console.warn('Notice: sitemap dynamic routes fetch skipped or timed out:', err);
  }

  return routes;
}
