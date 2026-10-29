'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Camera, X, ChevronLeft, ChevronRight } from 'lucide-react';

interface ImageItem {
  id?: string;
  url: string;
  alt: string;
  caption?: string | null;
  credit?: string;
  license?: string;
  isCover?: boolean;
}

interface GalleryProps {
  images: ImageItem[];
  placeName: string;
}

export function Gallery({ images, placeName }: GalleryProps) {
  const [activeIdx, setActiveIdx] = useState<number | null>(null);

  if (!images || images.length === 0) return null;

  const handlePrev = () => {
    if (activeIdx !== null) {
      setActiveIdx(activeIdx === 0 ? images.length - 1 : activeIdx - 1);
    }
  };

  const handleNext = () => {
    if (activeIdx !== null) {
      setActiveIdx(activeIdx === images.length - 1 ? 0 : activeIdx + 1);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-heading text-2xl font-bold text-[color:var(--color-text-primary)] flex items-center gap-2">
          <Camera className="w-5 h-5 text-saffron-500" />
          <span>Photo Gallery ({images.length})</span>
        </h2>
        <span className="text-xs text-stone-400">Click any photo to enlarge</span>
      </div>

      {/* Responsive Gallery Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {images.map((img, idx) => (
          <button
            key={img.url + idx}
            onClick={() => setActiveIdx(idx)}
            type="button"
            className="group relative aspect-[4/3] rounded-2xl overflow-hidden bg-stone-100 dark:bg-stone-800 border border-[color:var(--color-border)] text-left cursor-pointer focus:outline-none"
          >
            <Image
              src={img.url || '/images/places/taj-mahal-agra.jpg'}
              alt={img.alt || placeName}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

            {/* Photographer credit chip */}
            {img.credit && (
              <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded text-[10px] bg-black/70 text-stone-200 opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-xs">
                Photo: {img.credit}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Lightbox Modal */}
      {activeIdx !== null && images[activeIdx] && (() => {
        const activeImg = images[activeIdx];
        return (
          <div
            role="dialog"
            aria-modal="true"
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-8 animate-in fade-in duration-200"
          >
            {/* Close button */}
            <button
              onClick={() => setActiveIdx(null)}
              type="button"
              className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white z-50 transition-colors"
              aria-label="Close Lightbox"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Navigation controls */}
            <button
              onClick={handlePrev}
              type="button"
              className="absolute left-4 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white z-50 transition-colors"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <button
              onClick={handleNext}
              type="button"
              className="absolute right-4 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white z-50 transition-colors"
              aria-label="Next image"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Active Image Container */}
            <div className="relative max-w-5xl max-h-[85vh] w-full h-[70vh] flex flex-col items-center justify-center">
              <div className="relative w-full h-full">
                <Image
                  src={activeImg.url || '/images/places/taj-mahal-agra.jpg'}
                  alt={activeImg.alt || placeName}
                  fill
                  className="object-contain"
                  priority
                />
              </div>

              {/* Caption & Credit Bar */}
              <div className="mt-4 text-center text-white text-sm">
                <p className="font-medium">{activeImg.alt || placeName}</p>
                <div className="flex items-center justify-center gap-2 text-xs text-stone-400 mt-1">
                  <span>Credit: {activeImg.credit || 'Creative Commons'}</span>
                  <span>•</span>
                  <span>License: {activeImg.license || 'CC BY-SA'}</span>
                  <span>•</span>
                  <span>{activeIdx + 1} of {images.length}</span>
                </div>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
