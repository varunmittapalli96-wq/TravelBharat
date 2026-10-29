import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { Hero } from '../components/home/Hero';
import { IndiaMap } from '../components/home/IndiaMap';
import { CategoryBrowser } from '../components/home/CategoryBrowser';
import { UnescoStrip } from '../components/home/UnescoStrip';
import { MonthWidget } from '../components/home/MonthWidget';
import { PlaceCard } from '../components/places/PlaceCard';
import Link from 'next/link';
import { Sparkles, ArrowRight } from 'lucide-react';

export const dynamic = 'force-dynamic';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';

async function getData() {
  try {
    const [statsRes, statesRes, featuredRes, unescoRes] = await Promise.all([
      fetch(`${API_URL}/stats`, { cache: 'no-store', signal: AbortSignal.timeout(4000) }).catch(() => null),
      fetch(`${API_URL}/states`, { cache: 'no-store', signal: AbortSignal.timeout(4000) }).catch(() => null),
      fetch(`${API_URL}/places?sort=popular&limit=6`, { cache: 'no-store', signal: AbortSignal.timeout(4000) }).catch(() => null),
      fetch(`${API_URL}/places?unesco=true&limit=6`, { cache: 'no-store', signal: AbortSignal.timeout(4000) }).catch(() => null),
    ]);

    const stats = statsRes && statsRes.ok ? (await statsRes.json()).data : null;
    const states = statesRes && statesRes.ok ? (await statesRes.json()).data : [];
    const featuredPlaces = featuredRes && featuredRes.ok ? (await featuredRes.json()).data : [];
    const unescoPlaces = unescoRes && unescoRes.ok ? (await unescoRes.json()).data : [];

    return { stats, states, featuredPlaces, unescoPlaces };
  } catch (err) {
    console.error('Error fetching home data:', err);
    return { stats: null, states: [], featuredPlaces: [], unescoPlaces: [] };
  }
}

export default async function HomePage() {
  const { stats, states, featuredPlaces, unescoPlaces } = await getData();

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <Hero stats={stats} />

        {/* Featured Destinations Section */}
        <section className="py-16 md:py-24 border-t border-[color:var(--color-border)]">
          <div className="container-main">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-saffron-50 dark:bg-saffron-950/40 text-saffron-700 dark:text-saffron-400 border border-saffron-200 dark:border-saffron-800 mb-3">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Must-Visit Destinations</span>
                </div>
                <h2 className="section-title">Iconic Destinations of Bharat</h2>
                <p className="section-subtitle">
                  Signature landmarks and breathtaking landscapes defining the cultural tapestry of India.
                </p>
              </div>
              <Link
                href="/explore"
                className="mt-4 md:mt-0 font-semibold text-saffron-600 dark:text-saffron-400 hover:underline inline-flex items-center gap-1.5 text-sm"
              >
                <span>View All 56+ Destinations</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredPlaces.map((place: any) => (
                <PlaceCard key={place.id} place={place} />
              ))}
            </div>
          </div>
        </section>

        {/* Region & Geographic Explorer */}
        <IndiaMap states={states} />

        {/* Category Browser */}
        <CategoryBrowser />

        {/* UNESCO Heritage Strip */}
        <UnescoStrip unescoPlaces={unescoPlaces} />

        {/* Seasonal Month Widget */}
        <MonthWidget />
      </main>

      <Footer />
    </div>
  );
}
