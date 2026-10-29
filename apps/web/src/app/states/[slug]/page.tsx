import { Header } from '../../../components/layout/Header';
import { Footer } from '../../../components/layout/Footer';
import { PlaceCard } from '../../../components/places/PlaceCard';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { MapPin, Building, Landmark, Compass, ChevronRight, Share2 } from 'lucide-react';

export const dynamic = 'force-dynamic';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';

async function getState(slug: string) {
  try {
    const res = await fetch(`${API_URL}/states/${slug}`, { signal: AbortSignal.timeout(3000), next: { revalidate: 60 } });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data;
  } catch {
    return null;
  }
}

async function getStatePlaces(stateId: string) {
  try {
    const res = await fetch(`${API_URL}/places?stateId=${stateId}&limit=50`, { signal: AbortSignal.timeout(3000), next: { revalidate: 60 } });
    if (!res.ok) return [];
    const json = await res.json();
    return json.data || [];
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const state = await getState(params.slug);
  if (!state) return { title: 'State Not Found | TravelBharat' };

  return {
    title: `${state.name} Tourism Guide – Places to Visit, Capital, Cities | TravelBharat`,
    description: `Complete travel encyclopedia for ${state.name}. Explore top tourist destinations, capital city ${state.capital}, rich cultural heritage, and travel tips.`,
  };
}

export default async function StateDetailPage({ params }: { params: { slug: string } }) {
  const state = await getState(params.slug);
  if (!state) notFound();

  const places = await getStatePlaces(state.id);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1 pb-16">
        {/* Hero Banner */}
        <section className="relative h-[380px] sm:h-[460px] w-full bg-stone-900 overflow-hidden">
          <Image
            src={state.bannerImage || `/images/states/${state.slug}.jpg`}
            alt={state.name}
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-black/30" />

          {/* Breadcrumb & Hero text */}
          <div className="container-main relative h-full flex flex-col justify-end pb-10 text-white z-10">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-xs text-stone-300 mb-4">
              <Link href="/" className="hover:text-white">Home</Link>
              <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
              <Link href="/states" className="hover:text-white">States</Link>
              <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
              <span className="text-saffron-400 font-medium">{state.name}</span>
            </div>

            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-saffron-500 text-white shadow-xs">
                {state.type}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-stone-800/80 text-stone-200 border border-stone-700">
                {state.region} India
              </span>
            </div>

            <h1 className="font-heading text-4xl sm:text-6xl font-extrabold tracking-tight drop-shadow-md">
              {state.name}
            </h1>

            <p className="mt-2 text-stone-200 text-sm sm:text-base flex items-center gap-2">
              <MapPin className="w-4 h-4 text-saffron-400" />
              <span>Capital City: <strong>{state.capital}</strong></span>
              <span className="text-stone-400">•</span>
              <span>{places.length} Featured Destinations</span>
            </p>
          </div>
        </section>

        {/* State Overview */}
        <section className="py-12 border-b border-[color:var(--color-border)] bg-stone-50/50 dark:bg-stone-900/30">
          <div className="container-main">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Description */}
              <div className="lg:col-span-2">
                <h2 className="font-heading text-2xl font-bold text-[color:var(--color-text-primary)] mb-4">
                  About {state.name}
                </h2>
                <p className="text-base text-[color:var(--color-text-secondary)] leading-relaxed whitespace-pre-line">
                  {state.description}
                </p>
              </div>

              {/* Fast Facts Card */}
              <div className="card p-6 bg-white dark:bg-stone-900 border border-[color:var(--color-border)] h-fit">
                <h3 className="font-heading text-lg font-bold text-[color:var(--color-text-primary)] mb-4 pb-2 border-b border-[color:var(--color-border)]">
                  Quick State Facts
                </h3>
                <dl className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-stone-500">Capital</dt>
                    <dd className="font-semibold text-stone-900 dark:text-stone-100">{state.capital}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-stone-500">Classification</dt>
                    <dd className="font-semibold text-stone-900 dark:text-stone-100">{state.type}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-stone-500">Zone / Region</dt>
                    <dd className="font-semibold text-stone-900 dark:text-stone-100">{state.region}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-stone-500">Documented Cities</dt>
                    <dd className="font-semibold text-stone-900 dark:text-stone-100">{state.cities?.length || 0}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-stone-500">Curated Places</dt>
                    <dd className="font-semibold text-saffron-600 dark:text-saffron-400">{places.length}</dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </section>

        {/* Cities in this State */}
        {state.cities && state.cities.length > 0 && (
          <section className="py-12 border-b border-[color:var(--color-border)]">
            <div className="container-main">
              <h2 className="font-heading text-2xl font-bold text-[color:var(--color-text-primary)] mb-6 flex items-center gap-2">
                <Building className="w-5 h-5 text-teal-600" />
                <span>Prominent Cities in {state.name}</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {state.cities.map((city: any) => (
                  <Link
                    key={city.id}
                    href={`/cities/${city.slug}`}
                    className="p-5 rounded-2xl bg-[color:var(--color-surface)] border border-[color:var(--color-border)] hover:border-teal-500 transition-all group"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-heading font-bold text-lg text-[color:var(--color-text-primary)] group-hover:text-teal-600 transition-colors">
                        {city.name}
                      </h3>
                      <span className="text-xs text-stone-400">View City →</span>
                    </div>
                    <p className="text-xs text-[color:var(--color-text-secondary)] line-clamp-2 leading-relaxed">
                      {city.description}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Tourist Destinations in this State */}
        <section className="py-12">
          <div className="container-main">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="font-heading text-2xl sm:text-3xl font-bold text-[color:var(--color-text-primary)]">
                  Places to Visit in {state.name}
                </h2>
                <p className="text-sm text-[color:var(--color-text-secondary)] mt-1">
                  Verified destinations, monuments, and natural sanctuaries in {state.name}.
                </p>
              </div>
            </div>

            {places.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {places.map((place: any) => (
                  <PlaceCard key={place.id} place={place} />
                ))}
              </div>
            ) : (
              <div className="card p-12 text-center text-stone-500">
                <Landmark className="w-12 h-12 mx-auto mb-3 text-stone-300" />
                <p className="text-base font-semibold">No places published yet for {state.name}.</p>
                <p className="text-xs mt-1">Our editorial team is continuously curating new verified entries.</p>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
