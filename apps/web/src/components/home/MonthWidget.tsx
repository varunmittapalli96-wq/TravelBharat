'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Calendar, Sun, ArrowRight, CloudRain, Snowflake } from 'lucide-react';

export function MonthWidget() {
  const currentMonthNum = new Date().getMonth() + 1; // 1-12
  const [selectedMonth, setSelectedMonth] = useState<number>(currentMonthNum);

  const months = [
    { num: 1, name: 'Jan', season: 'Winter / Ideal across plains & coasts' },
    { num: 2, name: 'Feb', season: 'Pleasant winter / Spring bloom' },
    { num: 3, name: 'Mar', season: 'Spring festivities / Wildlife safaris' },
    { num: 4, name: 'Apr', season: 'Early summer / Himalayan escapes' },
    { num: 5, name: 'May', season: 'Peak summer / High mountain treks' },
    { num: 6, name: 'Jun', season: 'Monsoon onset / Ladakh season opens' },
    { num: 7, name: 'Jul', season: 'Lush monsoon / Valley of Flowers' },
    { num: 8, name: 'Aug', season: 'Cascading waterfalls & green hills' },
    { num: 9, name: 'Sep', season: 'Post-monsoon freshness / Clear skies' },
    { num: 10, name: 'Oct', season: 'Autumn festive season / Pleasant' },
    { num: 11, name: 'Nov', season: 'Cool crisp skies / Desert festivals' },
    { num: 12, name: 'Dec', season: 'Peak travel / Snow peaks & beaches' },
  ];

  const currentMeta = months.find((m) => m.num === selectedMonth);

  return (
    <section className="py-16 md:py-24 border-t border-[color:var(--color-border)]">
      <div className="container-main">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800 mb-3">
            <Calendar className="w-3.5 h-3.5" />
            <span>Seasonal Travel Calendar</span>
          </div>
          <h2 className="section-title">When Are You Planning to Travel?</h2>
          <p className="section-subtitle mx-auto">
            India&apos;s climate varies dramatically across geography. Select a month to see where weather conditions and seasonal sights are at their absolute prime.
          </p>
        </div>

        {/* 12 Month Chips */}
        <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-12 gap-2 mb-8 max-w-4xl mx-auto">
          {months.map((m) => {
            const active = selectedMonth === m.num;
            const isCurrent = currentMonthNum === m.num;
            return (
              <button
                key={m.num}
                onClick={() => setSelectedMonth(m.num)}
                type="button"
                className={`relative py-3 px-2 rounded-2xl text-center transition-all duration-200 cursor-pointer ${
                  active
                    ? 'bg-saffron-500 text-white font-bold shadow-lg shadow-saffron-500/25 scale-105'
                    : 'bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-300 hover:border-saffron-300'
                }`}
              >
                <span className="block text-sm font-semibold">{m.name}</span>
                {isCurrent && (
                  <span className={`block text-[9px] uppercase tracking-wider font-extrabold mt-0.5 ${active ? 'text-white/80' : 'text-saffron-600 dark:text-saffron-400'}`}>
                    Now
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Month Context Banner & CTA */}
        <div className="max-w-3xl mx-auto p-6 rounded-3xl bg-stone-100 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
              <Sun className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-heading font-bold text-lg text-stone-900 dark:text-stone-100">
                Traveling in {currentMeta?.name}
              </h4>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                {currentMeta?.season}
              </p>
            </div>
          </div>

          <Link
            href={`/explore?month=${selectedMonth}`}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-saffron-500 hover:bg-saffron-600 text-white font-semibold text-sm transition-all shadow-md whitespace-nowrap"
          >
            <span>See Places to Visit in {currentMeta?.name}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
