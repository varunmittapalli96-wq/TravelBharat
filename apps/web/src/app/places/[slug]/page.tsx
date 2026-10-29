

import { Header } from '../../../components/layout/Header';
import { Footer } from '../../../components/layout/Footer';
import { Gallery } from '../../../components/places/Gallery';
import { PlaceCard } from '../../../components/places/PlaceCard';
import { PlaceLocationMap } from '../../../components/places/PlaceLocationMap';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  MapPin,
  Clock,
  Ticket,
  Calendar,
  Plane,
  Train,
  Car,
  CheckCircle,
  Lightbulb,
  ExternalLink,
  Award,
  ChevronRight,
  ShieldCheck,
  Bookmark,
  Compass,
  Navigation,
} from 'lucide-react';
import { serverFetch } from '../../../lib/server-api';

export const dynamic = 'force-dynamic';

async function getPlace(slug: string) {
  return await serverFetch<any>(`/places/${slug}`, { next: { revalidate: 60 } });
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const place = await getPlace(params.slug);
  if (!place) return { title: 'Destination Not Found | TravelBharat' };

  return {
    title: `${place.name} Travel Guide – Timings, Fee, Best Time | TravelBharat`,
    description: `${place.shortDescription} Complete guide for visiting ${place.name} in ${place.state?.name}.`,
    openGraph: {
      title: `${place.name} | TravelBharat`,
      description: place.shortDescription,
      images: place.images?.[0]?.url ? [{ url: place.images[0].url }] : [],
    },
  };
}

export default async function PlaceDetailPage({ params }: { params: { slug: string } }) {
  const place = await getPlace(params.slug);
  if (!place) notFound();

  const rawCover =
    place.images?.find((img: any) => img.isCover)?.url ||
    place.images?.[0]?.url;

  const coverImage = rawCover || `/images/places/${place.slug}.jpg`;

  const monthNames = [
    '', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  // JSON-LD Schema for SEO
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TouristAttraction',
    name: place.name,
    description: place.shortDescription,
    image: coverImage,
    isAccessibleForFree: !place.entryFee || place.entryFee.toLowerCase().includes('free'),
    geo: {
      '@type': 'GeoCoordinates',
      latitude: place.lat,
      longitude: place.lng,
    },
    address: {
      '@type': 'PostalAddress',
      addressLocality: place.city?.name || '',
      addressRegion: place.state?.name || '',
      addressCountry: 'IN',
    },
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      {/* JSON-LD Script */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="flex-1 pb-20">
        {/* Hero Section */}
        <section className="relative h-[420px] sm:h-[500px] w-full bg-stone-900 overflow-hidden">
          <Image
            src={coverImage}
            alt={place.name}
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-black/30" />

          {/* Breadcrumb & Hero Text */}
          <div className="container-main relative h-full flex flex-col justify-end pb-12 text-white z-10">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-xs text-stone-300 mb-4 overflow-x-auto whitespace-nowrap">
              <Link href="/" className="hover:text-white">Home</Link>
              <ChevronRight className="w-3.5 h-3.5 text-stone-400 shrink-0" />
              <Link href="/states" className="hover:text-white">States</Link>
              {place.state && (
                <>
                  <ChevronRight className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                  <Link href={`/states/${place.state.slug}`} className="hover:text-white">
                    {place.state.name}
                  </Link>
                </>
              )}
              {place.city && (
                <>
                  <ChevronRight className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                  <Link href={`/cities/${place.city.slug}`} className="hover:text-white">
                    {place.city.name}
                  </Link>
                </>
              )}
              <ChevronRight className="w-3.5 h-3.5 text-stone-400 shrink-0" />
              <span className="text-saffron-400 font-semibold">{place.name}</span>
            </div>

            {/* Badges */}
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-saffron-500 text-white shadow-xs">
                {place.category}
              </span>
              {place.isUnesco && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wide bg-blue-600 text-white shadow-xs">
                  <Award className="w-3.5 h-3.5" />
                  <span>UNESCO World Heritage Site</span>
                </span>
              )}
              {place.tags?.map((t: string) => (
                <span
                  key={t}
                  className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-stone-800/80 text-stone-200 border border-stone-700 uppercase"
                >
                  {t.replace('_', ' ')}
                </span>
              ))}
            </div>

            <h1 className="font-heading text-4xl sm:text-6xl font-extrabold tracking-tight drop-shadow-md">
              {place.name}
            </h1>

            <div className="mt-3 flex flex-wrap items-center gap-3">
              <p className="text-stone-200 text-sm sm:text-base flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-saffron-400 shrink-0" />
                <span>
                  {place.city ? `${place.city.name}, ` : ''}
                  {place.state?.name}
                </span>
              </p>
              {place.lat && place.lng && (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-mono bg-black/50 text-stone-300 border border-stone-700/60 backdrop-blur-md">
                  📍 {Math.abs(place.lat).toFixed(4)}°{place.lat >= 0 ? 'N' : 'S'}, {Math.abs(place.lng).toFixed(4)}°{place.lng >= 0 ? 'E' : 'W'}
                </span>
              )}
              <a
                href={
                  place.lat && place.lng
                    ? `https://www.google.com/maps/dir/?api=1&destination=${place.lat},${place.lng}`
                    : place.mapLink || '#location-map'
                }
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-1 rounded-full text-xs font-bold bg-saffron-500 hover:bg-saffron-600 text-white shadow-md inline-flex items-center gap-1.5 transition-all"
              >
                <Navigation className="w-3.5 h-3.5 fill-white" />
                <span>Get Directions</span>
              </a>
            </div>
          </div>
        </section>

        {/* Main Content Layout */}
        <div className="container-main mt-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Left 2 Cols: Details, Gallery, History, Directions, Tips */}
            <div className="lg:col-span-2 space-y-12">
              {/* Short Description Lead */}
              <div className="p-6 rounded-3xl bg-saffron-50/60 dark:bg-saffron-950/20 border border-saffron-200/80 dark:border-saffron-800/60">
                <p className="text-lg text-[color:var(--color-text-primary)] font-medium leading-relaxed">
                  {place.shortDescription}
                </p>
              </div>

              {/* Comprehensive Description */}
              <div>
                <h2 className="font-heading text-2xl font-bold text-[color:var(--color-text-primary)] mb-4">
                  Overview & Experience
                </h2>
                <div className="prose dark:prose-invert max-w-none text-[color:var(--color-text-secondary)] leading-relaxed space-y-4">
                  <p>{place.description}</p>
                </div>
              </div>

              {/* Historical Significance Callout */}
              {place.historicalSignificance && (
                <div className="card p-6 sm:p-8 bg-gradient-to-tr from-amber-500/5 via-saffron-500/5 to-transparent border-l-4 border-l-amber-500 rounded-2xl">
                  <h3 className="font-heading text-xl font-bold text-[color:var(--color-text-primary)] mb-3 flex items-center gap-2">
                    <Award className="w-5 h-5 text-amber-500" />
                    <span>Historical & Cultural Significance</span>
                  </h3>
                  <p className="text-sm sm:text-base text-[color:var(--color-text-secondary)] leading-relaxed">
                    {place.historicalSignificance}
                  </p>
                </div>
              )}

              {/* Photo Gallery & Lightbox */}
              {place.images && place.images.length > 0 && (
                <Gallery images={place.images} placeName={place.name} />
              )}

              {/* How to Reach */}
              <div>
                <h2 className="font-heading text-2xl font-bold text-[color:var(--color-text-primary)] mb-6 flex items-center gap-2">
                  <Compass className="w-6 h-6 text-teal-600" />
                  <span>How to Reach {place.name}</span>
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {place.howToReachAirport && (
                    <div className="card p-5 border border-[color:var(--color-border)]">
                      <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-3">
                        <Plane className="w-5 h-5" />
                      </div>
                      <h4 className="font-heading font-bold text-base text-[color:var(--color-text-primary)] mb-1">
                        By Air
                      </h4>
                      <p className="text-xs text-[color:var(--color-text-secondary)] leading-relaxed">
                        {place.howToReachAirport}
                      </p>
                    </div>
                  )}

                  {place.howToReachRailway && (
                    <div className="card p-5 border border-[color:var(--color-border)]">
                      <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-3">
                        <Train className="w-5 h-5" />
                      </div>
                      <h4 className="font-heading font-bold text-base text-[color:var(--color-text-primary)] mb-1">
                        By Rail
                      </h4>
                      <p className="text-xs text-[color:var(--color-text-secondary)] leading-relaxed">
                        {place.howToReachRailway}
                      </p>
                    </div>
                  )}

                  {place.howToReachRoad && (
                    <div className="card p-5 border border-[color:var(--color-border)]">
                      <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-3">
                        <Car className="w-5 h-5" />
                      </div>
                      <h4 className="font-heading font-bold text-base text-[color:var(--color-text-primary)] mb-1">
                        By Road
                      </h4>
                      <p className="text-xs text-[color:var(--color-text-secondary)] leading-relaxed">
                        {place.howToReachRoad}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Exact Location & Turn-by-Turn Navigation Map */}
              {place.lat && place.lng && (
                <div id="location-map">
                  <PlaceLocationMap
                    name={place.name}
                    lat={place.lat}
                    lng={place.lng}
                    cityName={place.city?.name}
                    stateName={place.state?.name}
                    mapLink={place.mapLink}
                  />
                </div>
              )}

              {/* Local Tips & Guidelines */}
              {place.localTips && place.localTips.length > 0 && (
                <div>
                  <h2 className="font-heading text-2xl font-bold text-[color:var(--color-text-primary)] mb-4 flex items-center gap-2">
                    <Lightbulb className="w-6 h-6 text-amber-500" />
                    <span>Insider Tips & Traveler Guidance</span>
                  </h2>

                  <div className="card p-6 bg-stone-50/60 dark:bg-stone-900/40 border border-[color:var(--color-border)]">
                    <ul className="space-y-3">
                      {place.localTips.map((tip: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-3 text-sm text-[color:var(--color-text-secondary)] leading-relaxed">
                          <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* Verified Sources & Editorial Attribution */}
              <div className="p-6 rounded-2xl bg-stone-100/70 dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800 text-xs text-stone-500 space-y-2">
                <div className="flex items-center gap-2 font-semibold text-stone-700 dark:text-stone-300">
                  <ShieldCheck className="w-4 h-4 text-teal-600" />
                  <span>Verified Editorial Source: {place.verifiedBy || 'Ministry of Tourism / ASI'}</span>
                </div>
                {place.sources && place.sources.length > 0 && (
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <span>Reference Authorities:</span>
                    {place.sources.map((src: any, i: number) => (
                      <a
                        key={i}
                        href={src.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-saffron-600 dark:text-saffron-400 hover:underline inline-flex items-center gap-1 font-medium"
                      >
                        <span>{src.title}</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Sticky Visiting Information Card */}
            <div className="space-y-6">
              <div className="card p-6 sm:p-7 bg-white dark:bg-stone-900 border border-[color:var(--color-border)] shadow-xl sticky top-28">
                <h3 className="font-heading text-xl font-bold text-[color:var(--color-text-primary)] mb-5 pb-3 border-b border-[color:var(--color-border)]">
                  Key Visiting Details
                </h3>

                <div className="space-y-5 text-sm">
                  {/* Timings */}
                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-stone-900 dark:text-stone-100">Visiting Hours</p>
                      <p className="text-xs text-stone-500 mt-0.5 leading-relaxed">{place.timings || 'Daylight hours'}</p>
                    </div>
                  </div>

                  {/* Entry Fee */}
                  <div className="flex items-start gap-3">
                    <Ticket className="w-5 h-5 text-saffron-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-stone-900 dark:text-stone-100">Entry Tariff</p>
                      <p className="text-xs text-stone-500 mt-0.5 leading-relaxed">{place.entryFee || 'Free public entry'}</p>
                    </div>
                  </div>

                  {/* Best Time */}
                  <div className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-stone-900 dark:text-stone-100">Best Season to Visit</p>
                      <p className="text-xs text-stone-500 mt-0.5 leading-relaxed">{place.bestTimeToVisit}</p>
                    </div>
                  </div>

                  {/* Best Months Chips */}
                  {place.bestMonths && place.bestMonths.length > 0 && (
                    <div className="pt-2">
                      <p className="text-xs font-semibold text-stone-500 mb-2">Prime Travel Months:</p>
                      <div className="flex flex-wrap gap-1.5">
                        {place.bestMonths.map((m: number) => (
                          <span
                            key={m}
                            className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-saffron-100 dark:bg-saffron-950/60 text-saffron-800 dark:text-saffron-300"
                          >
                            {monthNames[m]}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Navigation & Exact Location Links */}
                  <div className="pt-4 border-t border-[color:var(--color-border)] space-y-2.5">
                    {place.lat && place.lng && (
                      <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-900 border border-[color:var(--color-border)] text-xs text-[color:var(--color-text-secondary)] flex items-center justify-between">
                        <span className="font-medium text-stone-500">GPS:</span>
                        <span className="font-mono font-semibold text-stone-700 dark:text-stone-300">
                          {Math.abs(place.lat).toFixed(4)}°{place.lat >= 0 ? 'N' : 'S'}, {Math.abs(place.lng).toFixed(4)}°{place.lng >= 0 ? 'E' : 'W'}
                        </span>
                      </div>
                    )}
                    <a
                      href={
                        place.lat && place.lng
                          ? `https://www.google.com/maps/dir/?api=1&destination=${place.lat},${place.lng}`
                          : place.mapLink || '#location-map'
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-primary w-full text-center text-sm gap-2 shadow-md hover:shadow-lg transition-all"
                    >
                      <Navigation className="w-4 h-4 fill-white" />
                      <span>Start Navigation</span>
                    </a>
                    {place.mapLink && (
                      <a
                        href={place.mapLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full text-center text-xs text-stone-500 hover:text-saffron-600 dark:hover:text-saffron-400 flex items-center justify-center gap-1.5 py-1 transition-colors"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Open in Google Maps</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Nearby Destinations Section */}
          {place.nearbyFrom && place.nearbyFrom.length > 0 && (
            <section className="mt-20 pt-12 border-t border-[color:var(--color-border)]">
              <div className="mb-8">
                <h2 className="font-heading text-2xl sm:text-3xl font-bold text-[color:var(--color-text-primary)]">
                  Nearby Destinations to Combine
                </h2>
                <p className="text-sm text-[color:var(--color-text-secondary)] mt-1">
                  Places you can conveniently visit on the same itinerary.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {place.nearbyFrom.slice(0, 3).map((item: any) => (
                  <div key={item.nearbyPlace.id} className="relative">
                    <span className="absolute top-3 right-14 z-20 px-2 py-0.5 rounded-full text-[10px] font-bold bg-black/75 text-white backdrop-blur-xs">
                      {item.distanceKm} km away
                    </span>
                    <PlaceCard place={item.nearbyPlace} />
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
