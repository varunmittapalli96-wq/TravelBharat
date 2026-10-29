'use client';

import { useState } from 'react';
import { MapPin, Navigation, Copy, Check, ExternalLink, Compass } from 'lucide-react';

interface PlaceLocationMapProps {
  name: string;
  lat: number;
  lng: number;
  cityName?: string | null;
  stateName?: string;
  mapLink?: string | null;
}

export function PlaceLocationMap({
  name,
  lat,
  lng,
  cityName,
  stateName,
  mapLink,
}: PlaceLocationMapProps) {
  const [copied, setCopied] = useState(false);

  // Exact delta for bounding box
  const delta = 0.02;
  const bbox = `${lng - delta}%2C${lat - delta}%2C${lng + delta}%2C${lat + delta}`;
  const embedUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat}%2C${lng}`;

  // Direct turn-by-turn navigation URL
  const googleNavUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
  const googleSearchUrl = mapLink || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${name} ${cityName || ''} ${stateName || ''}`)}`;
  const appleNavUrl = `https://maps.apple.com/?daddr=${lat},${lng}&q=${encodeURIComponent(name)}`;

  const handleCopyCoords = async () => {
    try {
      await navigator.clipboard.writeText(`${lat.toFixed(6)}, ${lng.toFixed(6)}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // fallback
    }
  };

  const latFormatted = `${Math.abs(lat).toFixed(4)}° ${lat >= 0 ? 'N' : 'S'}`;
  const lngFormatted = `${Math.abs(lng).toFixed(4)}° ${lng >= 0 ? 'E' : 'W'}`;

  return (
    <div className="card overflow-hidden border border-[color:var(--color-border)] bg-[color:var(--color-surface)] rounded-3xl shadow-sm">
      {/* Header */}
      <div className="p-6 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[color:var(--color-border)]">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-saffron-50 dark:bg-saffron-950/40 text-saffron-700 dark:text-saffron-400 border border-saffron-200 dark:border-saffron-800 mb-2">
            <Compass className="w-3.5 h-3.5 text-saffron-600 dark:text-saffron-400" />
            <span>Interactive Navigation</span>
          </div>
          <h3 className="font-heading text-xl sm:text-2xl font-bold text-[color:var(--color-text-primary)] flex items-center gap-2">
            <MapPin className="w-5 h-5 text-saffron-500" />
            <span>Exact Location & Directions</span>
          </h3>
          <p className="text-xs sm:text-sm text-[color:var(--color-text-secondary)] mt-0.5">
            {name}{cityName ? ` • ${cityName}` : ''}{stateName ? `, ${stateName}` : ''}
          </p>
        </div>

        {/* Primary Navigate CTA */}
        <div className="flex items-center gap-2 shrink-0">
          <a
            href={googleNavUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary text-xs sm:text-sm gap-2 shadow-md hover:shadow-lg transition-all"
          >
            <Navigation className="w-4 h-4 fill-white" />
            <span>Start Navigation</span>
          </a>
        </div>
      </div>

      {/* Embedded Live Map */}
      <div className="relative w-full h-[320px] sm:h-[400px] bg-stone-100 dark:bg-stone-900 overflow-hidden">
        <iframe
          title={`Map view of ${name}`}
          src={embedUrl}
          className="w-full h-full border-0"
          loading="lazy"
          allowFullScreen
        />

        {/* Floating Quick Action Overlay */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 z-10">
          <a
            href={googleNavUrl}
            target="_blank"
            rel="noopener noreferrer"
            title="Open Turn-by-Turn Directions"
            className="px-3 py-1.5 rounded-xl bg-white/95 dark:bg-stone-900/95 backdrop-blur-md text-stone-800 dark:text-stone-100 font-semibold text-xs shadow-lg hover:bg-saffron-500 hover:text-white transition-all flex items-center gap-1.5 border border-stone-200 dark:border-stone-800"
          >
            <Navigation className="w-3.5 h-3.5 text-saffron-500 group-hover:text-white" />
            <span>Directions</span>
          </a>
          <a
            href={googleSearchUrl}
            target="_blank"
            rel="noopener noreferrer"
            title="Open in Google Maps"
            className="px-3 py-1.5 rounded-xl bg-white/95 dark:bg-stone-900/95 backdrop-blur-md text-stone-800 dark:text-stone-100 font-semibold text-xs shadow-lg hover:bg-stone-100 dark:hover:bg-stone-800 transition-all flex items-center gap-1.5 border border-stone-200 dark:border-stone-800"
          >
            <ExternalLink className="w-3.5 h-3.5 text-stone-500" />
            <span>Google Maps</span>
          </a>
        </div>
      </div>

      {/* GPS Coordinates Bar & Controls */}
      <div className="p-5 bg-stone-50/80 dark:bg-stone-900/60 border-t border-[color:var(--color-border)] flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs">
          <span className="text-stone-500 dark:text-stone-400 font-medium">GPS Coordinates:</span>
          <span className="px-2.5 py-1 rounded-lg bg-white dark:bg-stone-800 font-mono font-semibold text-stone-700 dark:text-stone-200 border border-stone-200 dark:border-stone-700">
            {latFormatted}
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-white dark:bg-stone-800 font-mono font-semibold text-stone-700 dark:text-stone-200 border border-stone-200 dark:border-stone-700">
            {lngFormatted}
          </span>
          <span className="hidden sm:inline font-mono text-stone-400">
            ({lat.toFixed(4)}, {lng.toFixed(4)})
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Copy Coordinates */}
          <button
            onClick={handleCopyCoords}
            type="button"
            className="px-3 py-1.5 rounded-xl border border-[color:var(--color-border)] bg-white dark:bg-stone-800 hover:bg-stone-100 dark:hover:bg-stone-700 text-xs font-semibold text-stone-700 dark:text-stone-200 transition-colors inline-flex items-center gap-1.5 cursor-pointer shadow-2xs"
            title="Copy exact latitude and longitude"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-500" />
                <span className="text-emerald-600 dark:text-emerald-400">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-stone-500" />
                <span>Copy GPS</span>
              </>
            )}
          </button>

          {/* Apple Maps */}
          <a
            href={appleNavUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 rounded-xl border border-[color:var(--color-border)] bg-white dark:bg-stone-800 hover:bg-stone-100 dark:hover:bg-stone-700 text-xs font-semibold text-stone-700 dark:text-stone-200 transition-colors inline-flex items-center gap-1.5 shadow-2xs"
            title="Open in Apple Maps"
          >
            <Compass className="w-3.5 h-3.5 text-stone-500" />
            <span>Apple Maps</span>
          </a>
        </div>
      </div>
    </div>
  );
}

