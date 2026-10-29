import Link from 'next/link';
import { Compass, MapPin, Heart, ExternalLink, Shield } from 'lucide-react';

export function Footer() {
  const regions = [
    { label: 'Northern India', href: '/states?region=NORTH' },
    { label: 'Southern India', href: '/states?region=SOUTH' },
    { label: 'Western India', href: '/states?region=WEST' },
    { label: 'Eastern India', href: '/states?region=EAST' },
    { label: 'Central India', href: '/states?region=CENTRAL' },
    { label: 'Northeast India', href: '/states?region=NORTHEAST' },
  ];

  const categories = [
    { label: 'UNESCO Heritage', href: '/explore?unesco=true' },
    { label: 'Ancient Temples & Faith', href: '/explore?category=RELIGIOUS' },
    { label: 'Sanctuaries & Wildlife', href: '/explore?tags=WILDLIFE' },
    { label: 'Hill Stations & Peaks', href: '/explore?tags=HILL_STATION' },
    { label: 'Pristine Beaches & Islands', href: '/explore?tags=BEACH' },
    { label: 'Hidden Cultural Gems', href: '/explore?tags=HIDDEN_GEM' },
  ];

  return (
    <footer className="bg-stone-900 text-stone-300 pt-16 pb-12 border-t border-stone-800">
      <div className="container-main">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-stone-800">
          {/* Brand Col */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-saffron-500 to-amber-500 flex items-center justify-center text-white">
                <Compass className="w-6 h-6" />
              </div>
              <span className="font-heading text-2xl font-black text-white">
                Travel<span className="text-saffron-400">Bharat</span>
              </span>
            </Link>
            <p className="text-sm text-stone-400 leading-relaxed">
              TravelBharat is India&apos;s digital travel encyclopedia. Comprehensive, verified destination guides covering all 28 states and 8 union territories for travelers, students, and culture enthusiasts.
            </p>
            <div className="flex items-center gap-2 text-xs text-stone-400">
              <MapPin className="w-4 h-4 text-saffron-400" />
              <span>Covering 36 States & UTs • 80+ Cities</span>
            </div>
          </div>

          {/* Explore by Region */}
          <div>
            <h3 className="font-heading font-bold text-white text-base mb-4 tracking-wide uppercase text-xs">
              Explore by Region
            </h3>
            <ul className="space-y-2.5 text-sm">
              {regions.map((r) => (
                <li key={r.label}>
                  <Link
                    href={r.href}
                    className="hover:text-saffron-400 transition-colors flex items-center justify-between group"
                  >
                    <span>{r.label}</span>
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity text-xs text-saffron-400">→</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Travel Themes */}
          <div>
            <h3 className="font-heading font-bold text-white text-base mb-4 tracking-wide uppercase text-xs">
              Travel Themes
            </h3>
            <ul className="space-y-2.5 text-sm">
              {categories.map((c) => (
                <li key={c.label}>
                  <Link
                    href={c.href}
                    className="hover:text-teal-400 transition-colors flex items-center justify-between group"
                  >
                    <span>{c.label}</span>
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity text-xs text-teal-400">→</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links & Info */}
          <div>
            <h3 className="font-heading font-bold text-white text-base mb-4 tracking-wide uppercase text-xs">
              Portal Resources
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  About TravelBharat Project
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Submit Feedback & Corrections
                </Link>
              </li>
              <li>
                <Link href="/saved" className="hover:text-white transition-colors">
                  My Bookmarked Places
                </Link>
              </li>
              <li>
                <a
                  href="http://localhost:4000/api/docs"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors inline-flex items-center gap-1.5"
                >
                  <span>OpenAPI / Swagger Docs</span>
                  <ExternalLink className="w-3.5 h-3.5 text-stone-500" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-400">
          <p>
            © {new Date().getFullYear()} TravelBharat. Informational travel encyclopedia. Built with pride for Incredible India.
          </p>
          <div className="flex items-center gap-4 text-stone-500">
            <div className="flex items-center gap-1 text-stone-400">
              <span>Crafted with</span>
              <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
              <span>celebrating India&apos;s rich cultural diversity</span>
            </div>
            <span>•</span>
            <Link
              href="/admin/login"
              className="text-stone-600 hover:text-stone-400 transition-colors"
              title="Editorial Staff Login"
            >
              Staff Access
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
