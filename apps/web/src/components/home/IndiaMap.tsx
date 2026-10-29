'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Compass, MapPin, ArrowRight } from 'lucide-react';

interface StateItem {
  id: string;
  name: string;
  slug: string;
  capital: string;
  region: string;
  type: string;
  placeCount?: number;
}

interface IndiaMapProps {
  states: StateItem[];
}

export function IndiaMap({ states }: IndiaMapProps) {
  const [selectedRegion, setSelectedRegion] = useState<string>('NORTH');

  const regions = [
    { id: 'NORTH', name: 'Northern India', color: 'from-amber-500 to-orange-500', desc: 'Snow-capped Himalayas, historic forts, spiritual Ganges plains' },
    { id: 'SOUTH', name: 'Southern India', color: 'from-teal-600 to-emerald-600', desc: 'Ancient Dravidian temples, tranquil backwaters, spice hills' },
    { id: 'WEST', name: 'Western India', color: 'from-orange-500 to-red-500', desc: 'Golden Thar desert, Arabian coast, rock-cut Ajanta-Ellora caves' },
    { id: 'EAST', name: 'Eastern India', color: 'from-blue-600 to-cyan-600', desc: 'Nalanda ruins, Konark Sun Temple, mangrove Sundarbans delta' },
    { id: 'CENTRAL', name: 'Central India', color: 'from-purple-600 to-indigo-600', desc: 'Khajuraho temples, Chitrakote Niagara falls, tiger reserves' },
    { id: 'NORTHEAST', name: 'Northeast India', color: 'from-emerald-600 to-teal-700', desc: 'Living root bridges, Kaziranga rhinos, Tawang Buddhist monastery' },
  ];

  const currentRegionMeta = regions.find((r) => r.id === selectedRegion);
  const filteredStates = states.filter((s) => s.region === selectedRegion);

  return (
    <section className="py-16 md:py-24 border-t border-[color:var(--color-border)]">
      <div className="container-main">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-semibold bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-400 border border-teal-200 dark:border-teal-800 mb-3">
            <Compass className="w-3.5 h-3.5" />
            <span>Regional Travel Guide</span>
          </div>
          <h2 className="section-title">Explore India by Geographic Region</h2>
          <p className="section-subtitle mx-auto">
            Select a region below to discover its constituent states, union territories, cultural signatures, and top attractions.
          </p>
        </div>

        {/* Region Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {regions.map((reg) => {
            const active = selectedRegion === reg.id;
            return (
              <button
                key={reg.id}
                onClick={() => setSelectedRegion(reg.id)}
                type="button"
                className={`px-5 py-2.5 rounded-2xl text-sm font-semibold transition-all duration-200 cursor-pointer ${
                  active
                    ? 'bg-stone-900 text-white dark:bg-white dark:text-stone-900 shadow-lg scale-105'
                    : 'bg-white dark:bg-stone-900 text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 border border-stone-200 dark:border-stone-800'
                }`}
              >
                {reg.name}
              </button>
            );
          })}
        </div>

        {/* Region Description Banner */}
        <div className="p-6 rounded-3xl bg-gradient-to-r from-stone-900 to-stone-800 text-white mb-8 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2.5 h-2.5 rounded-full bg-saffron-400" />
              <h3 className="font-heading text-2xl font-bold">{currentRegionMeta?.name}</h3>
            </div>
            <p className="text-sm text-stone-300 max-w-2xl">{currentRegionMeta?.desc}</p>
          </div>
          <Link
            href={`/states?region=${selectedRegion}`}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-saffron-500 hover:bg-saffron-600 text-white font-semibold text-sm transition-all whitespace-nowrap shadow-md"
          >
            <span>View All States in {currentRegionMeta?.name}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* States in Region Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredStates.map((state) => (
            <Link
              key={state.id}
              href={`/states/${state.slug}`}
              className="p-5 rounded-2xl bg-[color:var(--color-surface)] border border-[color:var(--color-border)] hover:border-saffron-400 hover:shadow-lg transition-all duration-200 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-md bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300">
                    {state.type}
                  </span>
                  {state.placeCount !== undefined && (
                    <span className="text-xs font-semibold text-saffron-600 dark:text-saffron-400">
                      {state.placeCount} {state.placeCount === 1 ? 'place' : 'places'}
                    </span>
                  )}
                </div>
                <h4 className="font-heading font-bold text-lg text-[color:var(--color-text-primary)] group-hover:text-saffron-600 dark:group-hover:text-saffron-400 transition-colors">
                  {state.name}
                </h4>
                <p className="text-xs text-[color:var(--color-text-secondary)] mt-1 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-stone-400" />
                  <span>Capital: <strong className="font-medium text-stone-700 dark:text-stone-300">{state.capital}</strong></span>
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-[color:var(--color-border)] flex items-center justify-between text-xs font-semibold text-saffron-600 dark:text-saffron-400">
                <span>Explore guide</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
