import Link from 'next/link';
import { PlaceCard } from '../places/PlaceCard';
import { Award, ArrowRight } from 'lucide-react';

interface UnescoStripProps {
  unescoPlaces: any[];
}

export function UnescoStrip({ unescoPlaces }: UnescoStripProps) {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-blue-500/5 via-transparent to-transparent border-t border-[color:var(--color-border)]">
      <div className="container-main">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800 mb-3">
              <Award className="w-3.5 h-3.5" />
              <span>World Heritage in India</span>
            </div>
            <h2 className="section-title">UNESCO World Heritage Treasures</h2>
            <p className="section-subtitle">
              India boasts over 40 UNESCO-inscribed natural and cultural sites of universal outstanding value to humanity.
            </p>
          </div>
          <Link
            href="/explore?unesco=true"
            className="mt-4 md:mt-0 font-semibold text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1.5 text-sm"
          >
            <span>Browse All UNESCO Sites</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {unescoPlaces.slice(0, 6).map((place) => (
            <PlaceCard key={place.id} place={place} />
          ))}
        </div>
      </div>
    </section>
  );
}
