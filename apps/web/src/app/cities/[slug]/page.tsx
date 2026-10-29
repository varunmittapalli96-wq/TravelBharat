import { Header } from '../../../components/layout/Header';
import { Footer } from '../../../components/layout/Footer';
import { PlaceCard } from '../../../components/places/PlaceCard';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { MapPin, Building, ChevronRight, Compass } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';

async function getCity(slug: string) {
  try {
    const res = await fetch(`${API_URL}/cities/${slug}`, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data;
  } catch {
    return null;
  }
}

async function getCityPlaces(cityId: string) {
  try {
    const res = await fetch(`${API_URL}/places?cityId=${cityId}&limit=50`, { next: { revalidate: 60 } });
    if (!res.ok) return [];
    const json = await res.json();
    return json.data || [];
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const city = await getCity(params.slug);
  if (!city) return { title: 'City Not Found | TravelBharat' };

  return {
    title: `${city.name}, ${city.state?.name} – Tourist Places & City Guide | TravelBharat`,
    description: `Explore tourist attractions, history, and travel guide for ${city.name} in ${city.state?.name}.`,
  };
}

export default async function CityDetailPage({ params }: { params: { slug: string } }) {
  const city = await getCity(params.slug);
  if (!city) notFound();

  const places = await getCityPlaces(city.id);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1 py-10 md:py-14">
        <div className="container-main">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-stone-500 mb-6">
            <Link href="/" className="hover:text-stone-900 dark:hover:text-white">Home</Link>
            <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
            <Link href="/states" className="hover:text-stone-900 dark:hover:text-white">States</Link>
            {city.state && (
              <>
                <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
                <Link href={`/states/${city.state.slug}`} className="hover:text-stone-900 dark:hover:text-white">
                  {city.state.name}
                </Link>
              </>
            )}
            <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
            <span className="text-saffron-600 dark:text-saffron-400 font-semibold">{city.name}</span>
          </div>

          {/* City Header */}
          <div className="card p-8 bg-gradient-to-tr from-stone-900 to-stone-800 text-white rounded-3xl mb-12 shadow-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-white backdrop-blur-xs mb-3">
              <Building className="w-3.5 h-3.5 text-teal-400" />
              <span>City Travel Guide</span>
            </div>
            <h1 className="font-heading text-4xl sm:text-5xl font-extrabold tracking-tight">
              {city.name}
            </h1>
            <p className="mt-2 text-stone-300 text-sm flex items-center gap-2">
              <MapPin className="w-4 h-4 text-saffron-400" />
              {city.state && (
                <span>
                  Located in <Link href={`/states/${city.state.slug}`} className="text-saffron-400 underline font-semibold">{city.state.name}</Link>
                </span>
              )}
              <span className="text-stone-500">•</span>
              <span>Coordinates: {city.lat.toFixed(4)}° N, {city.lng.toFixed(4)}° E</span>
            </p>
            <p className="mt-5 text-base text-stone-200 max-w-3xl leading-relaxed">
              {city.description}
            </p>
          </div>

          {/* Places in this City */}
          <div>
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-[color:var(--color-text-primary)] mb-6">
              Places to Visit in {city.name}
            </h2>

            {places.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {places.map((place: any) => (
                  <PlaceCard key={place.id} place={place} />
                ))}
              </div>
            ) : (
              <div className="card p-12 text-center text-stone-500">
                <Compass className="w-12 h-12 mx-auto mb-3 text-stone-300" />
                <p className="text-base font-semibold">No direct destination records tagged for {city.name} yet.</p>
                {city.state && (
                  <Link
                    href={`/states/${city.state.slug}`}
                    className="mt-3 inline-block font-semibold text-saffron-600 dark:text-saffron-400 hover:underline text-sm"
                  >
                    Explore all places in {city.state.name} →
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
