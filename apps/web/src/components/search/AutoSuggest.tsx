'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Search, MapPin, Landmark, Building, X } from 'lucide-react';

interface Suggestion {
  type: 'state' | 'city' | 'place';
  name: string;
  slug: string;
  extra?: string;
}

interface AutoSuggestProps {
  placeholder?: string;
  onSelect?: (s: Suggestion) => void;
  className?: string;
}

export function AutoSuggest({
  placeholder = 'Search destinations, states, UNESCO sites...',
  onSelect,
  className = '',
}: AutoSuggestProps) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (!query || query.trim().length < 2) {
      setSuggestions([]);
      setIsOpen(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`http://localhost:4000/api/v1/search/suggest?q=${encodeURIComponent(query.trim())}`);
        if (res.ok) {
          const data = await res.json();
          setSuggestions(data.data || []);
          setIsOpen(true);
        }
      } catch {
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  // Click outside listener
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (s: Suggestion) => {
    setIsOpen(false);
    setQuery('');
    if (onSelect) {
      onSelect(s);
      return;
    }

    if (s.type === 'state') {
      router.push(`/states/${s.slug}`);
    } else if (s.type === 'city') {
      router.push(`/cities/${s.slug}`);
    } else {
      router.push(`/places/${s.slug}`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && query.trim()) {
      setIsOpen(false);
      router.push(`/explore?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <div ref={wrapperRef} className={`relative w-full ${className}`}>
      <div className="relative flex items-center">
        <Search className="absolute left-4 w-5 h-5 text-stone-400 pointer-events-none" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.trim().length >= 2 && setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full pl-12 pr-10 py-3.5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-saffron-500/50 shadow-md shadow-stone-900/5 text-base transition-all"
        />
        {query && (
          <button
            onClick={() => {
              setQuery('');
              setSuggestions([]);
              setIsOpen(false);
            }}
            type="button"
            className="absolute right-3.5 p-1 rounded-full text-stone-400 hover:text-stone-600 dark:hover:text-stone-200"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute left-0 right-0 top-full mt-2 bg-white dark:bg-stone-900 rounded-2xl shadow-2xl border border-stone-200 dark:border-stone-800 overflow-hidden z-50 max-h-96 overflow-y-auto animate-in fade-in slide-in-from-top-2 duration-150">
          {isLoading ? (
            <div className="p-4 text-center text-sm text-stone-400">Searching...</div>
          ) : suggestions.length > 0 ? (
            <div className="py-2">
              {suggestions.map((item, idx) => (
                <button
                  key={`${item.type}-${item.slug}-${idx}`}
                  onClick={() => handleSelect(item)}
                  type="button"
                  className="w-full px-4 py-3 text-left hover:bg-stone-50 dark:hover:bg-stone-800/80 transition-colors flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 group-hover:bg-saffron-100 dark:group-hover:bg-saffron-950/40 group-hover:text-saffron-600 transition-colors">
                      {item.type === 'state' && <MapPin className="w-4 h-4" />}
                      {item.type === 'city' && <Building className="w-4 h-4" />}
                      {item.type === 'place' && <Landmark className="w-4 h-4" />}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-stone-900 dark:text-stone-100 group-hover:text-saffron-600 transition-colors">
                        {item.name}
                      </p>
                      {item.extra && (
                        <p className="text-xs text-stone-400">{item.extra}</p>
                      )}
                    </div>
                  </div>
                  <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-stone-100 dark:bg-stone-800 text-stone-500 group-hover:bg-saffron-50 dark:group-hover:bg-saffron-900/30 group-hover:text-saffron-600 transition-colors">
                    {item.type}
                  </span>
                </button>
              ))}
            </div>
          ) : (
            <div className="p-5 text-center text-sm text-stone-400">
              No matching destinations found for &quot;{query}&quot;
            </div>
          )}
        </div>
      )}
    </div>
  );
}
