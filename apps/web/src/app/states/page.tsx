import { Header } from '../../components/layout/Header';
import { Footer } from '../../components/layout/Footer';
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Building, Landmark, Compass, ArrowRight } from 'lucide-react';

export const dynamic = 'force-dynamic';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';

async function getStates(region?: string, type?: string) {
  let url = `${API_URL}/states`;
  const params = new URLSearchParams();
  if (region) params.set('region', region);
  if (type) params.set('type', type);
  const qs = params.toString();
  if (qs) url += `?${qs}`;

  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(3000), next: { revalidate: 60 } });
    if (!res.ok) return [];
    const data = await res.json();
    return data.data || [];
  } catch {
    return [];
  }
}

export const metadata = {
  title: 'All States & Union Territories of India | TravelBharat',
  description: 'Comprehensive directory of all 28 states and 8 union territories of India, detailing their capitals, regions, geography, and top tourist destinations.',
};

export default async function StatesPage({
  searchParams,
}: {
  searchParams: { region?: string; type?: string; q?: string };
}) {
  const states = await getStates(searchParams.region, searchParams.type);

  const filtered = searchParams.q
    ? states.filter((s: any) =>
        s.name.toLowerCase().includes(searchParams.q!.toLowerCase()) ||
        s.capital.toLowerCase().includes(searchParams.q!.toLowerCase())
      )
    : states;

  const regions = [
    { id: '', label: 'All Regions' },
    { id: 'NORTH', label: 'North' },
    { id: 'SOUTH', label: 'South' },
    { id: 'WEST', label: 'West' },
    { id: 'EAST', label: 'East' },
    { id: 'CENTRAL', label: 'Central' },
    { id: 'NORTHEAST', label: 'Northeast' },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1 py-12 md:py-16">
        <div className="container-main">
          {/* Header */}
          <div className="max-w-3xl mb-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-saffron-50 dark:bg-saffron-950/40 text-saffron-700 dark:text-saffron-400 border border-saffron-200 dark:border-saffron-800 mb-3">
              <Compass className="w-3.5 h-3.5" />
              <span>State & UT Encyclopedia</span>
            </div>
            <h1 className="section-title">States & Union Territories of India</h1>
            <p className="section-subtitle">
              Browse all 28 states and 8 union territories. Discover cultural heritage, geographic wonders, capital cities, and top destinations.
            </p>
          </div>

          {/* Region Filter Bar */}
          <div className="flex flex-wrap items-center gap-2 mb-10 pb-4 border-b border-[color:var(--color-border)]">
            {regions.map((r) => {
              const active = (searchParams.region || '') === r.id;
              const href = r.id ? `/states?region=${r.id}` : '/states';
              return (
                <Link
                  key={r.id}
                  href={href}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                    active
                      ? 'bg-stone-900 text-white dark:bg-white dark:text-stone-900 shadow-sm'
                      : 'bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
                  }`}
                >
                  {r.label}
                </Link>
              );
            })}
          </div>

          {/* States Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map((state: any) => (
              <Link
                key={state.id}
                href={`/states/${state.slug}`}
                className="card group flex flex-col justify-between overflow-hidden hover:border-saffron-400 dark:hover:border-saffron-600 transition-all duration-300"
              >
                <div>
                  {/* Banner Image */}
                  <div className="relative aspect-[16/10] w-full bg-stone-100 dark:bg-stone-800 overflow-hidden">
                    <Image
                      src={state.bannerImage || `/images/states/${state.slug}.jpg`}
                      alt={state.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    
                    {/* Badge */}
                    <div className="absolute top-3 left-3">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/90 dark:bg-black/80 text-stone-900 dark:text-stone-100 backdrop-blur-xs">
                        {state.type}
                      </span>
                    </div>

                    <div className="absolute bottom-3 left-3 right-3 text-white">
                      <h3 className="font-heading font-bold text-xl drop-shadow-sm group-hover:text-saffron-300 transition-colors">
                        {state.name}
                      </h3>
                      <p className="text-xs text-stone-200 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-saffron-400" />
                        <span>Capital: {state.capital}</span>
                      </p>
                    </div>
                  </div>

                  {/* Body description */}
                  <div className="p-4">
                    <p className="text-xs text-[color:var(--color-text-secondary)] line-clamp-2 leading-relaxed">
                      {state.description}
                    </p>
                  </div>
                </div>

                {/* Footer Count Chips */}
                <div className="px-4 py-3 bg-stone-50 dark:bg-stone-800/40 border-t border-[color:var(--color-border)] flex items-center justify-between text-xs text-[color:var(--color-text-tertiary)]">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <Building className="w-3.5 h-3.5 text-stone-400" />
                      <span>{state.cityCount} {state.cityCount === 1 ? 'city' : 'cities'}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <Landmark className="w-3.5 h-3.5 text-saffron-500" />
                      <span>{state.placeCount} places</span>
                    </span>
                  </div>
                  <span className="font-semibold text-saffron-600 dark:text-saffron-400 group-hover:translate-x-1 transition-transform">
                    →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
