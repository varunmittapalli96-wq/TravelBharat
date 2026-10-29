'use client';

import { useState, useEffect } from 'react';
import { Header } from '../../components/layout/Header';
import { Footer } from '../../components/layout/Footer';
import { PlaceCard } from '../../components/places/PlaceCard';
import { useSavedPlaces } from '../../hooks/useSavedPlaces';
import Link from 'next/link';
import { Bookmark, Compass, ArrowRight } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';

export default function SavedPlacesPage() {
  const { savedSlugs, isLoaded } = useSavedPlaces();
  const [places, setPlaces] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoaded) return;

    if (savedSlugs.length === 0) {
      setPlaces([]);
      setLoading(false);
      return;
    }

    async function fetchSaved() {
      setLoading(true);
      try {
        const promises = savedSlugs.map((slug) =>
          fetch(`${API_URL}/places/${slug}`).then((r) => (r.ok ? r.json() : null))
        );
        const results = await Promise.all(promises);
        const valid = results.filter((r) => r?.data).map((r) => r.data);
        setPlaces(valid);
      } catch (err) {
        console.error('Failed to load saved places', err);
      } finally {
        setLoading(false);
      }
    }

    fetchSaved();
  }, [savedSlugs, isLoaded]);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1 py-12 md:py-16">
        <div className="container-main">
          {/* Header */}
          <div className="max-w-3xl mb-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-saffron-50 dark:bg-saffron-950/40 text-saffron-700 dark:text-saffron-400 border border-saffron-200 dark:border-saffron-800 mb-3">
              <Bookmark className="w-3.5 h-3.5 fill-current" />
              <span>Personal Travel Bucket List</span>
            </div>
            <h1 className="section-title">Saved Destinations</h1>
            <p className="section-subtitle">
              Your bookmarked destinations saved locally in your browser. Plan your personalized itinerary across India.
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="card p-6 h-72 skeleton" />
              ))}
            </div>
          ) : places.length > 0 ? (
            <div>
              <p className="text-sm text-stone-500 mb-6">
                You have saved <strong>{places.length}</strong> {places.length === 1 ? 'place' : 'places'}.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {places.map((place) => (
                  <PlaceCard key={place.id} place={place} />
                ))}
              </div>
            </div>
          ) : (
            <div className="card p-16 text-center text-stone-500 max-w-xl mx-auto">
              <div className="w-16 h-16 rounded-3xl bg-saffron-100 dark:bg-saffron-950/40 text-saffron-600 flex items-center justify-center mx-auto mb-4">
                <Bookmark className="w-8 h-8" />
              </div>
              <h2 className="font-heading text-xl font-bold text-stone-900 dark:text-stone-100 mb-2">
                Your Saved List is Empty
              </h2>
              <p className="text-sm text-stone-500 max-w-md mx-auto mb-6">
                Explore destinations across India and tap the bookmark icon on any card to save it for your upcoming journey.
              </p>
              <Link href="/explore" className="btn-primary inline-flex items-center gap-2">
                <Compass className="w-4 h-4" />
                <span>Start Exploring Destinations</span>
              </Link>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
