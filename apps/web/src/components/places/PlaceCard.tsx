'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSavedPlaces } from '../../hooks/useSavedPlaces';
import { Bookmark, MapPin, Calendar, Award, Navigation } from 'lucide-react';

interface PlaceCardProps {
  place: {
    id: string;
    name: string;
    slug: string;
    category: string;
    tags?: string[];
    shortDescription: string;
    bestTimeToVisit: string;
    isUnesco?: boolean;
    isFeatured?: boolean;
    images?: Array<{ url: string; alt: string; isCover?: boolean }>;
    state?: { name: string; slug: string };
    city?: { name: string; slug: string } | null;
    lat?: number;
    lng?: number;
    mapLink?: string | null;
  };
}

const CATEGORY_FALLBACKS: Record<string, string> = {
  HERITAGE: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=1200&auto=format&fit=crop&q=80',
  NATURE: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=1200&auto=format&fit=crop&q=80',
  RELIGIOUS: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=1200&auto=format&fit=crop&q=80',
  ADVENTURE: 'https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?w=1200&auto=format&fit=crop&q=80',
};

const DEFAULT_COVER = 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=1200&auto=format&fit=crop&q=80';

export function PlaceCard({ place }: PlaceCardProps) {
  const { isSaved, toggleSave } = useSavedPlaces();
  const saved = isSaved(place.slug);

  const fallbackUrl = `/images/places/${place.slug}.jpg`;
  const rawImage =
    place.images?.find((img) => img.isCover)?.url ||
    place.images?.[0]?.url;

  const initialImage = rawImage || fallbackUrl;

  const [imgSrc, setImgSrc] = useState(initialImage);

  const navUrl =
    place.lat && place.lng
      ? `https://www.google.com/maps/dir/?api=1&destination=${place.lat},${place.lng}`
      : place.mapLink ||
        `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
          `${place.name} ${place.city?.name || ''} ${place.state?.name || ''}`
        )}`;

  const coordsFormatted =
    place.lat && place.lng
      ? `${Math.abs(place.lat).toFixed(4)}°${place.lat >= 0 ? 'N' : 'S'}, ${Math.abs(
          place.lng
        ).toFixed(4)}°${place.lng >= 0 ? 'E' : 'W'}`
      : null;

  const categoryBadgeColors: Record<string, string> = {
    HERITAGE: 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800',
    NATURE: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
    RELIGIOUS: 'bg-orange-100 text-orange-800 dark:bg-orange-950/60 dark:text-orange-300 border-orange-200 dark:border-orange-800',
    ADVENTURE: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-950/60 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800',
  };

  return (
    <div className="card group flex flex-col h-full bg-[color:var(--color-surface)] border border-[color:var(--color-border)] hover:border-saffron-300 dark:hover:border-saffron-800 hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden">
      {/* Image Container */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-stone-100 dark:bg-stone-800">
        <Link href={`/places/${place.slug}`}>
          <Image
            src={imgSrc}
            alt={place.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
            loading="lazy"
            onError={() => {
              if (imgSrc !== fallbackUrl) {
                setImgSrc(fallbackUrl);
              }
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
        </Link>

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap items-center gap-1.5 z-10">
          <span
            className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider border shadow-xs backdrop-blur-xs ${
              categoryBadgeColors[place.category] || 'bg-stone-100 text-stone-800'
            }`}
          >
            {place.category}
          </span>
          {place.isUnesco && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wide bg-blue-600 text-white shadow-xs">
              <Award className="w-3 h-3" />
              <span>UNESCO</span>
            </span>
          )}
        </div>

        {/* Bookmark Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            toggleSave(place.slug);
          }}
          type="button"
          aria-label={saved ? 'Remove from saved' : 'Save place'}
          title={saved ? 'Remove from saved' : 'Save place'}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all z-10 ${
            saved
              ? 'bg-saffron-500 text-white shadow-md'
              : 'bg-white/80 dark:bg-black/60 text-stone-700 dark:text-stone-300 hover:bg-white dark:hover:bg-black'
          }`}
        >
          <Bookmark className={`w-4 h-4 ${saved ? 'fill-white' : ''}`} />
        </button>

        {/* State/City Chip & Quick Navigation */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs font-medium z-10">
          <div
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-stone-200 text-xs shadow-md"
            title={coordsFormatted ? `Exact Coordinates: ${coordsFormatted}` : undefined}
          >
            <MapPin className="w-3.5 h-3.5 text-saffron-400 shrink-0" />
            <span className="truncate max-w-[130px] sm:max-w-[155px]">
              {place.city ? `${place.city.name}, ` : ''}
              {place.state?.name}
            </span>
          </div>

          <a
            href={navUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            title={`Navigate to ${place.name} (${coordsFormatted || 'Exact Location'})`}
            className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-saffron-500 hover:bg-saffron-600 text-white font-semibold text-[11px] shadow-lg transition-transform hover:scale-105 cursor-pointer"
          >
            <Navigation className="w-3 h-3 fill-white" />
            <span>Navigate</span>
          </a>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <Link href={`/places/${place.slug}`} className="group-hover:text-saffron-600 dark:group-hover:text-saffron-400 transition-colors">
          <h3 className="font-heading font-bold text-lg line-clamp-1 text-[color:var(--color-text-primary)] mb-2">
            {place.name}
          </h3>
        </Link>
        <p className="text-sm text-[color:var(--color-text-secondary)] line-clamp-2 leading-relaxed mb-4 flex-1">
          {place.shortDescription}
        </p>

        {/* Footer Meta */}
        <div className="pt-3 border-t border-[color:var(--color-border)] flex items-center justify-between text-xs text-[color:var(--color-text-tertiary)]">
          <div className="flex items-center gap-1 text-stone-500 dark:text-stone-400">
            <Calendar className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400 shrink-0" />
            <span className="truncate max-w-[120px] sm:max-w-[140px]">{place.bestTimeToVisit}</span>
          </div>
          <div className="flex items-center gap-3">
            <a
              href={navUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-stone-600 dark:text-stone-300 hover:text-saffron-600 dark:hover:text-saffron-400 inline-flex items-center gap-1 transition-colors"
              title={`Get directions to ${place.name}`}
            >
              <Navigation className="w-3 h-3 text-saffron-500" />
              <span>Directions</span>
            </a>
            <Link
              href={`/places/${place.slug}`}
              className="font-semibold text-saffron-600 dark:text-saffron-400 hover:underline inline-flex items-center gap-0.5"
            >
              <span>Explore</span>
              <span>→</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
