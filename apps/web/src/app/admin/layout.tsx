'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Compass,
  LayoutDashboard,
  MapPin,
  Building,
  Landmark,
  History,
  LogOut,
  ExternalLink,
  Shield,
  Menu,
  X,
} from 'lucide-react';
import { getPublicApiUrl } from '../../lib/api';

const API_URL = getPublicApiUrl();

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    // If on login page, render children directly without admin shell
    if (pathname.includes('/admin/login')) {
      setLoading(false);
      return;
    }

    async function checkAuth() {
      try {
        const res = await fetch(`${API_URL}/admin/auth/me`, {
          credentials: 'include',
        });
        if (!res.ok) {
          router.push('/admin/login');
          return;
        }
        const json = await res.json();
        setCurrentUser(json.data);
      } catch {
        router.push('/admin/login');
      } finally {
        setLoading(false);
      }
    }

    checkAuth();
  }, [pathname, router]);

  const handleLogout = async () => {
    try {
      await fetch(`${API_URL}/admin/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });
    } catch {
      // ignore
    } finally {
      router.push('/admin/login');
    }
  };

  if (pathname.includes('/admin/login')) {
    return <>{children}</>;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-100 dark:bg-stone-950">
        <div className="text-center space-y-3">
          <Shield className="w-10 h-10 text-saffron-500 animate-pulse mx-auto" />
          <p className="text-xs font-semibold text-stone-500">Checking editorial credentials...</p>
        </div>
      </div>
    );
  }

  const navItems = [
    { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { label: 'Tourist Places', href: '/admin/places', icon: Landmark },
    { label: 'Audit Trail', href: '/admin/audit', icon: History },
  ];

  return (
    <div className="min-h-screen flex bg-stone-100 dark:bg-stone-950 text-stone-900 dark:text-stone-100">
      {/* Sidebar for Desktop */}
      <aside className="hidden md:flex w-64 flex-col justify-between bg-stone-900 text-stone-300 p-6 border-r border-stone-800">
        <div>
          {/* Brand */}
          <Link href="/" className="flex items-center gap-3 mb-8">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-saffron-500 to-amber-500 flex items-center justify-center text-white">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <span className="font-heading font-black text-lg text-white">
                Travel<span className="text-saffron-400">Bharat</span>
              </span>
              <p className="text-[10px] uppercase font-bold text-teal-400 tracking-wider">
                Admin Console
              </p>
            </div>
          </Link>

          {/* Nav Items */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    active
                      ? 'bg-saffron-500 text-white font-semibold'
                      : 'text-stone-400 hover:text-white hover:bg-stone-800'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User profile & actions bottom */}
        <div className="pt-6 border-t border-stone-800 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-saffron-600 text-white flex items-center justify-center font-bold text-xs uppercase">
              {currentUser?.email?.charAt(0) || 'A'}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-semibold text-white truncate">{currentUser?.email || 'Admin'}</p>
              <span className="text-[10px] font-bold text-saffron-400 uppercase tracking-wider px-1.5 py-0.2 rounded bg-stone-800">
                {currentUser?.role || 'EDITOR'}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs pt-2">
            <Link href="/" className="text-stone-400 hover:text-white inline-flex items-center gap-1">
              <span>View Portal</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
            <button
              onClick={handleLogout}
              type="button"
              className="text-rose-400 hover:text-rose-300 inline-flex items-center gap-1 font-medium"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar on Mobile */}
        <div className="md:hidden flex items-center justify-between p-4 bg-stone-900 text-white border-b border-stone-800">
          <Link href="/" className="font-heading font-black text-lg">
            Travel<span className="text-saffron-400">Bharat</span> Admin
          </Link>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2">
            {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {sidebarOpen && (
          <div className="md:hidden bg-stone-900 text-stone-300 p-4 space-y-2 border-b border-stone-800">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm text-stone-300 hover:bg-stone-800"
              >
                {item.label}
              </Link>
            ))}
            <button
              onClick={handleLogout}
              className="block w-full text-left px-3 py-2 text-sm text-rose-400"
            >
              Logout
            </button>
          </div>
        )}

        <main className="flex-1 p-6 sm:p-10 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
