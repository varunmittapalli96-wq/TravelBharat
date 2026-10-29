import Link from 'next/link';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { Compass, Home, MapPin } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1 flex items-center justify-center py-20 px-4">
        <div className="card p-12 text-center max-w-lg mx-auto bg-white dark:bg-stone-900 border border-[color:var(--color-border)] rounded-3xl shadow-xl">
          <div className="w-20 h-20 rounded-3xl bg-saffron-100 dark:bg-saffron-950/50 text-saffron-600 flex items-center justify-center mx-auto mb-6">
            <Compass className="w-10 h-10 animate-spin-slow" />
          </div>

          <span className="text-xs font-bold uppercase tracking-widest text-saffron-600">404 Error</span>
          <h1 className="font-heading text-3xl sm:text-4xl font-extrabold text-[color:var(--color-text-primary)] mt-2 mb-3">
            Destination Not Found
          </h1>

          <p className="text-sm text-[color:var(--color-text-secondary)] mb-8 leading-relaxed">
            The state, city, or tourist destination you are searching for does not exist in our encyclopedia or may have moved.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/" className="btn-primary w-full sm:w-auto text-xs py-2.5 px-5 gap-2">
              <Home className="w-4 h-4" />
              <span>Back to Home</span>
            </Link>
            <Link href="/states" className="btn-secondary w-full sm:w-auto text-xs py-2.5 px-5 gap-2">
              <MapPin className="w-4 h-4" />
              <span>Browse All States</span>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
