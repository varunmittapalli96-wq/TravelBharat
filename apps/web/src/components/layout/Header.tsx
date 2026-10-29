'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ThemeToggle } from './ThemeToggle';
import { useSavedPlaces } from '../../hooks/useSavedPlaces';
import { Compass, Bookmark, Search, Menu, X, MapPin } from 'lucide-react';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { count: savedCount } = useSavedPlaces();

  const navLinks = [
    { label: 'States & UTs', href: '/states' },
    { label: 'Explore Places', href: '/explore' },
    { label: 'Saved', href: '/saved', badge: savedCount > 0 ? savedCount : undefined },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ];

  const isActive = (path: string) => {
    if (path === '/' && pathname === '/') return true;
    if (path !== '/' && pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="sticky top-0 z-40 w-full glass border-b border-[color:var(--color-border)] shadow-xs transition-colors duration-200">
      <div className="container-main">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-saffron-500 via-amber-500 to-teal-600 flex items-center justify-center shadow-md shadow-saffron-500/20 group-hover:scale-105 transition-transform duration-300">
              <Compass className="w-6 h-6 text-white animate-spin-slow" />
            </div>
            <div>
              <span className="font-heading text-2xl font-black tracking-tight text-[color:var(--color-text-primary)]">
                Travel<span className="text-saffron-500">Bharat</span>
              </span>
              <p className="text-[10px] tracking-widest font-semibold uppercase text-teal-700 dark:text-teal-400">
                Explore India
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative px-3.5 py-2 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-1.5 ${
                    active
                      ? 'text-saffron-600 dark:text-saffron-400 bg-saffron-50 dark:bg-saffron-950/40 font-semibold'
                      : 'text-[color:var(--color-text-secondary)] hover:text-[color:var(--color-text-primary)] hover:bg-black/5 dark:hover:bg-white/5'
                  }`}
                >
                  {link.label}
                  {link.badge !== undefined && (
                    <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-saffron-500 text-white">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Icons */}
          <div className="flex items-center gap-2">
            <Link
              href="/explore"
              className="p-2 rounded-xl text-[color:var(--color-text-secondary)] hover:text-saffron-500 hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
              aria-label="Search destinations"
              title="Search destinations"
            >
              <Search className="w-5 h-5" />
            </Link>

            <ThemeToggle />

            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-[color:var(--color-text-secondary)] hover:bg-black/5 dark:hover:bg-white/10"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-[color:var(--color-border)] space-y-1 animate-fadeIn">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-4 py-3 rounded-xl text-base font-medium ${
                    active
                      ? 'bg-saffron-50 dark:bg-saffron-950/40 text-saffron-600 dark:text-saffron-400 font-semibold'
                      : 'text-[color:var(--color-text-secondary)] hover:bg-black/5 dark:hover:bg-white/5'
                  }`}
                >
                  <span>{link.label}</span>
                  {link.badge !== undefined && (
                    <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-saffron-500 text-white">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </header>
  );
}
