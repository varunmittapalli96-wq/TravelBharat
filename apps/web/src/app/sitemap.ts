import { MetadataRoute } from 'next';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

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
    const [statesRes, placesRes] = await Promise.all([
      fetch(`${API_URL}/states`),
      fetch(`${API_URL}/places?limit=100`),
    ]);

    if (statesRes.ok) {
      const states = (await statesRes.json()).data || [];
      for (const s of states) {
        routes.push({
          url: `${SITE_URL}/states/${s.slug}`,
          lastModified: new Date(),
          priority: 0.8,
        });
      }
    }

    if (placesRes.ok) {
      const places = (await placesRes.json()).data || [];
      for (const p of places) {
        routes.push({
          url: `${SITE_URL}/places/${p.slug}`,
          lastModified: new Date(),
          priority: 0.85,
        });
      }
    }
  } catch (err) {
    console.error('Error generating sitemap', err);
  }

  return routes;
}
