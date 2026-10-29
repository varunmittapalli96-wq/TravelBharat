import { Header } from '../../components/layout/Header';
import { Footer } from '../../components/layout/Footer';
import { PlaceCard } from '../../components/places/PlaceCard';
import { StateFilter } from '../../components/explore/StateFilter';
import Link from 'next/link';
import { Search, Filter, Award, Sparkles, MapPin, X } from 'lucide-react';
import { serverFetch } from '../../lib/server-api';

export const dynamic = 'force-dynamic';

interface SearchParams {
  q?: string;
  category?: string;
  tags?: string;
  month?: string;
  unesco?: string;
  freeEntry?: string;
  stateId?: string;
  sort?: string;
  page?: string;
}

async function getPlaces(params: SearchParams) {
  const sp = new URLSearchParams();

  if (params.q) sp.set('q', params.q);
  if (params.category) sp.set('category', params.category);
  if (params.tags) sp.set('tags', params.tags);
  if (params.month) sp.set('month', params.month);
  if (params.unesco) sp.set('unesco', params.unesco);
  if (params.freeEntry) sp.set('freeEntry', params.freeEntry);
  if (params.stateId) sp.set('stateId', params.stateId);
  if (params.sort) sp.set('sort', params.sort);
  sp.set('limit', '30');

  const qs = sp.toString();
  const path = `/places${qs ? `?${qs}` : ''}`;

  const res = await serverFetch<any>(path, { next: { revalidate: 30 } });
  if (res && res.data) {
    return res;
  }
  if (Array.isArray(res)) {
    return { data: res, meta: { total: res.length } };
  }
  return { data: [], meta: { total: 0 } };
}

async function getStates() {
  const data = await serverFetch<any[]>('/states', { next: { revalidate: 120 } });
  return data || [];
}

export const metadata = {
  title: 'Explore & Filter India Tourist Destinations | TravelBharat',
  description: 'Search and filter destinations across India by category, travel season, UNESCO heritage status, and state.',
};

export default async function ExplorePage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const [{ data: places, meta }, states] = await Promise.all([
    getPlaces(searchParams),
    getStates(),
  ]);

  const categories = [
    { id: '', label: 'All Categories' },
    { id: 'HERITAGE', label: 'Heritage' },
    { id: 'NATURE', label: 'Nature' },
    { id: 'RELIGIOUS', label: 'Spiritual' },
    { id: 'ADVENTURE', label: 'Adventure' },
  ];

  const tags = [
    { id: 'BEACH', label: 'Beach' },
    { id: 'HILL_STATION', label: 'Hill Station' },
    { id: 'WILDLIFE', label: 'Wildlife' },
    { id: 'CULTURAL', label: 'Cultural' },
    { id: 'HIDDEN_GEM', label: 'Hidden Gem' },
  ];

  const activeCategory = searchParams.category || '';
  const activeUnesco = searchParams.unesco === 'true';

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1 py-10 md:py-14">
        <div className="container-main">
          {/* Header */}
          <div className="max-w-3xl mb-8">
            <h1 className="section-title">Explore Indian Destinations</h1>
            <p className="section-subtitle">
              Filter by experience theme, seasonal weather, UNESCO classification, and regional geography.
            </p>
          </div>

          {/* Quick Filters Bar */}
          <div className="card p-6 bg-white dark:bg-stone-900 border border-[color:var(--color-border)] mb-10 shadow-sm">
            <form method="GET" action="/explore" className="space-y-4">
              {/* Search row */}
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-3.5 w-5 h-5 text-stone-400" />
                  <input
                    type="text"
                    name="q"
                    defaultValue={searchParams.q || ''}
                    placeholder="Search by monument name, attraction, or keyword..."
                    className="input-field pl-12"
                  />
                </div>
                <button type="submit" className="btn-primary shrink-0">
                  Search
                </button>
              </div>

              {/* Filter Pills row */}
              <div className="pt-2 flex flex-wrap items-center gap-3">
                {/* Categories */}
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-xs font-semibold text-stone-400 mr-1">Category:</span>
                  {categories.map((c) => {
                    const active = activeCategory === c.id;
                    return (
                      <Link
                        key={c.id}
                        href={`/explore?${new URLSearchParams({
                          ...searchParams,
                          category: c.id,
                        }).toString()}`}
                        className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                          active
                            ? 'bg-saffron-500 text-white'
                            : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200'
                        }`}
                      >
                        {c.label}
                      </Link>
                    );
                  })}
                </div>

                <div className="h-4 w-px bg-stone-300 dark:bg-stone-700 hidden sm:block" />

                {/* UNESCO Toggle */}
                <Link
                  href={`/explore?${new URLSearchParams({
                    ...searchParams,
                    unesco: activeUnesco ? '' : 'true',
                  }).toString()}`}
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                    activeUnesco
                      ? 'bg-blue-600 text-white'
                      : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200'
                  }`}
                >
                  <Award className="w-3.5 h-3.5" />
                  <span>UNESCO World Heritage</span>
                </Link>

                {/* State selector dropdown */}
                <StateFilter states={states} selectedStateId={searchParams.stateId || ''} />

                {/* Reset Filters */}
                {Object.keys(searchParams).length > 0 && (
                  <Link
                    href="/explore"
                    className="text-xs text-rose-500 hover:underline inline-flex items-center gap-1"
                  >
                    <X className="w-3 h-3" />
                    <span>Reset</span>
                  </Link>
                )}
              </div>
            </form>
          </div>

          {/* Results count & grid */}
          <div className="mb-6 flex items-center justify-between text-sm text-stone-500">
            <p>
              Showing <strong>{places.length}</strong> {places.length === 1 ? 'destination' : 'destinations'}
              {meta?.total ? ` of ${meta.total} total` : ''}
            </p>
          </div>

          {places.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {places.map((place: any) => (
                <PlaceCard key={place.id} place={place} />
              ))}
            </div>
          ) : (
            <div className="card p-16 text-center text-stone-500">
              <Search className="w-12 h-12 mx-auto mb-3 text-stone-300" />
              <h3 className="font-heading text-lg font-bold text-stone-700 dark:text-stone-300">
                No matching destinations found
              </h3>
              <p className="text-xs text-stone-400 mt-1 max-w-sm mx-auto">
                Try loosening your filters, selecting a different category, or resetting your search term.
              </p>
              <Link href="/explore" className="btn-secondary mt-5 text-xs py-2 px-4">
                View All Destinations
              </Link>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
