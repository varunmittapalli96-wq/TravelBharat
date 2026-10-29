'use client';

import { useState, useEffect } from 'react';

const STORAGE_KEY = 'travelbharat_saved_places';

export function useSavedPlaces() {
  const [savedSlugs, setSavedSlugs] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setSavedSlugs(JSON.parse(stored));
      }
    } catch {
      // ignore
    } finally {
      setIsLoaded(true);
    }
  }, []);

  const toggleSave = (slug: string) => {
    setSavedSlugs((prev) => {
      const exists = prev.includes(slug);
      const next = exists ? prev.filter((s) => s !== slug) : [...prev, slug];
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  };

  const isSaved = (slug: string) => savedSlugs.includes(slug);

  return { savedSlugs, toggleSave, isSaved, isLoaded, count: savedSlugs.length };
}
