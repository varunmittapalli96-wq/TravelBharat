'use client';

import Link from 'next/link';
import { AutoSuggest } from '../search/AutoSuggest';
import { Compass, Sparkles, MapPin, Award, Trees, Landmark, Waves } from 'lucide-react';

interface HeroProps {
  stats?: {
    stateCount: number;
    cityCount: number;
    placeCount: number;
    unescoCount: number;
  };
}

export function Hero({ stats }: HeroProps) {
  const quickTags = [
    { label: 'UNESCO Sites', href: '/explore?unesco=true', icon: Award },
    { label: 'Heritage', href: '/explore?category=HERITAGE', icon: Landmark },
    { label: 'Sanctuaries & Wildlife', href: '/explore?tags=WILDLIFE', icon: Trees },
    { label: 'Beaches & Islands', href: '/explore?tags=BEACH', icon: Waves },
    { label: 'Spiritual Shrines', href: '/explore?category=RELIGIOUS', icon: Sparkles },
  ];

  return (
    <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28 bg-gradient-to-b from-amber-500/5 via-teal-500/5 to-transparent">
      {/* Decorative background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-gradient-to-r from-saffron-500/15 via-amber-400/10 to-teal-500/15 blur-3xl pointer-events-none rounded-full" />

      <div className="container-main relative z-10 text-center">
        {/* Top announcement pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xs mb-8 text-stone-700 dark:text-stone-300">
          <span className="flex h-2 w-2 rounded-full bg-saffron-500 animate-pulse" />
          <span>The Digital Travel Encyclopedia of India</span>
          <span className="text-stone-300 dark:text-stone-700">•</span>
          <span className="text-saffron-600 dark:text-saffron-400 font-bold">All 36 States & UTs</span>
        </div>

        {/* Headline */}
        <h1 className="font-heading text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-[color:var(--color-text-primary)] max-w-4xl mx-auto leading-[1.15]">
          Explore India, <br />
          <span className="gradient-text">State by State.</span>
        </h1>

        <p className="mt-6 text-lg sm:text-xl text-[color:var(--color-text-secondary)] max-w-2xl mx-auto leading-relaxed">
          From snow-capped Himalayan passes to sun-drenched tropical coasts, ancient rock-cut temples to vibrant wildlife sanctuaries. Verified, authoritative travel intelligence at your fingertips.
        </p>

        {/* Central Search Bar */}
        <div className="mt-10 max-w-2xl mx-auto">
          <AutoSuggest placeholder="Search by monument, city, state, or category (e.g. Taj Mahal, Goa, UNESCO)..." />
        </div>

        {/* Quick Filter Tags */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2 max-w-3xl mx-auto">
          <span className="text-xs font-semibold text-stone-400 mr-1">Trending:</span>
          {quickTags.map((tag) => {
            const Icon = tag.icon;
            return (
              <Link
                key={tag.label}
                href={tag.href}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium bg-white/80 dark:bg-stone-900/80 hover:bg-saffron-50 dark:hover:bg-saffron-950/40 border border-stone-200 dark:border-stone-800 hover:border-saffron-300 dark:hover:border-saffron-800 text-stone-700 dark:text-stone-300 hover:text-saffron-600 transition-all shadow-2xs"
              >
                <Icon className="w-3.5 h-3.5 text-saffron-500" />
                <span>{tag.label}</span>
              </Link>
            );
          })}
        </div>

        {/* Live verified stats counter bar */}
        <div className="mt-14 max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-3xl bg-white/80 dark:bg-stone-900/80 backdrop-blur-xl border border-stone-200/80 dark:border-stone-800/80 shadow-md">
          <div className="p-3 text-center border-r border-stone-200/60 dark:border-stone-800/60 last:border-r-0">
            <p className="font-heading text-2xl sm:text-3xl font-extrabold text-saffron-600 dark:text-saffron-400">
              {stats?.stateCount || 36}
            </p>
            <p className="text-xs font-medium text-stone-500 dark:text-stone-400 uppercase tracking-wider mt-0.5">
              States & UTs
            </p>
          </div>
          <div className="p-3 text-center sm:border-r border-stone-200/60 dark:border-stone-800/60">
            <p className="font-heading text-2xl sm:text-3xl font-extrabold text-teal-600 dark:text-teal-400">
              {stats?.cityCount || 81}
            </p>
            <p className="text-xs font-medium text-stone-500 dark:text-stone-400 uppercase tracking-wider mt-0.5">
              Documented Cities
            </p>
          </div>
          <div className="p-3 text-center border-r border-stone-200/60 dark:border-stone-800/60">
            <p className="font-heading text-2xl sm:text-3xl font-extrabold text-amber-600 dark:text-amber-400">
              {stats?.placeCount || 56}+
            </p>
            <p className="text-xs font-medium text-stone-500 dark:text-stone-400 uppercase tracking-wider mt-0.5">
              Curated Places
            </p>
          </div>
          <div className="p-3 text-center">
            <p className="font-heading text-2xl sm:text-3xl font-extrabold text-blue-600 dark:text-blue-400">
              {stats?.unescoCount || 18}
            </p>
            <p className="text-xs font-medium text-stone-500 dark:text-stone-400 uppercase tracking-wider mt-0.5">
              UNESCO Wonders
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
