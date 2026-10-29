import { Header } from '../../components/layout/Header';
import { Footer } from '../../components/layout/Footer';
import Link from 'next/link';
import { Compass, ShieldCheck, Database, MapPin, Heart, BookOpen, Layers } from 'lucide-react';

export const metadata = {
  title: 'About TravelBharat – India’s Digital Travel Encyclopedia',
  description: 'Learn about the mission, data curation process, and architectural foundation of TravelBharat.',
};

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1 py-12 md:py-20">
        <div className="container-main max-w-4xl">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-saffron-50 dark:bg-saffron-950/40 text-saffron-700 dark:text-saffron-400 border border-saffron-200 dark:border-saffron-800 mb-4">
              <Compass className="w-3.5 h-3.5" />
              <span>Project Mission</span>
            </div>
            <h1 className="font-heading text-4xl sm:text-5xl font-extrabold tracking-tight text-[color:var(--color-text-primary)] mb-4">
              About TravelBharat
            </h1>
            <p className="text-lg text-[color:var(--color-text-secondary)] max-w-2xl mx-auto leading-relaxed">
              A comprehensive, open digital encyclopedia chronicling the travel, heritage, and geographic marvels of every Indian state and union territory.
            </p>
          </div>

          {/* Mission & Problem Statement */}
          <div className="space-y-12">
            <div className="card p-8 bg-white dark:bg-stone-900 border border-[color:var(--color-border)] rounded-3xl shadow-sm">
              <h2 className="font-heading text-2xl font-bold text-[color:var(--color-text-primary)] mb-4 flex items-center gap-2">
                <BookOpen className="w-6 h-6 text-saffron-500" />
                <span>The Inspiration</span>
              </h2>
              <div className="text-base text-[color:var(--color-text-secondary)] leading-relaxed space-y-4">
                <p>
                  India is home to one of the world&apos;s oldest living civilizations, encompassing 28 states, 8 union territories, dozens of distinct geographical zones, and over 40 UNESCO World Heritage sites.
                </p>
                <p>
                  However, authentic tourism and heritage information has historically remained scattered across fragmented state portals, commercial booking engines, and outdated travel blogs. Travelers, students, and cultural researchers often struggle to find unified, verified data on entry regulations, seasonal weather patterns, transport connectivity, and historical significance.
                </p>
                <p>
                  <strong>TravelBharat was built to solve this challenge.</strong> Conceived purely as an authoritative, ad-free informational encyclopedia, it organizes India&apos;s tourist wealth into a structured hierarchy: State → City → Destination.
                </p>
              </div>
            </div>

            {/* Core Values / Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="card p-6 bg-white dark:bg-stone-900 border border-[color:var(--color-border)]">
                <div className="w-12 h-12 rounded-2xl bg-teal-100 dark:bg-teal-950/50 text-teal-600 flex items-center justify-center mb-4">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="font-heading font-bold text-lg text-[color:var(--color-text-primary)] mb-2">
                  Verified Data
                </h3>
                <p className="text-xs text-[color:var(--color-text-secondary)] leading-relaxed">
                  Every entry is cross-referenced with Ministry of Tourism, Archaeological Survey of India (ASI), and state tourism directorates.
                </p>
              </div>

              <div className="card p-6 bg-white dark:bg-stone-900 border border-[color:var(--color-border)]">
                <div className="w-12 h-12 rounded-2xl bg-saffron-100 dark:bg-saffron-950/50 text-saffron-600 flex items-center justify-center mb-4">
                  <Layers className="w-6 h-6" />
                </div>
                <h3 className="font-heading font-bold text-lg text-[color:var(--color-text-primary)] mb-2">
                  100% Pan-India
                </h3>
                <p className="text-xs text-[color:var(--color-text-secondary)] leading-relaxed">
                  Every single state and union territory—from Ladakh to Lakshadweep, Gujarat to Arunachal Pradesh—is systematically documented.
                </p>
              </div>

              <div className="card p-6 bg-white dark:bg-stone-900 border border-[color:var(--color-border)]">
                <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-950/50 text-blue-600 flex items-center justify-center mb-4">
                  <Database className="w-6 h-6" />
                </div>
                <h3 className="font-heading font-bold text-lg text-[color:var(--color-text-primary)] mb-2">
                  Open & Informational
                </h3>
                <p className="text-xs text-[color:var(--color-text-secondary)] leading-relaxed">
                  No hidden booking fees, no sponsored rankings, and no commercial tracking. Pure informational heritage preservation.
                </p>
              </div>
            </div>

            {/* Architecture Section */}
            <div className="card p-8 bg-stone-900 text-stone-200 rounded-3xl">
              <h2 className="font-heading text-2xl font-bold text-white mb-4">
                Architecture & Engineering
              </h2>
              <p className="text-sm text-stone-300 leading-relaxed mb-6">
                TravelBharat is engineered with a high-performance modern tech stack designed for speed, resilience, and strict SEO compliance:
              </p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <li className="p-3 rounded-xl bg-stone-800 border border-stone-700">
                  <strong className="block text-white font-semibold mb-0.5">Frontend</strong>
                  <span>Next.js App Router (TypeScript), Tailwind CSS, next/image optimization, Framer Motion</span>
                </li>
                <li className="p-3 rounded-xl bg-stone-800 border border-stone-700">
                  <strong className="block text-white font-semibold mb-0.5">API Engine</strong>
                  <span>Express.js with Zod schema validation, rate-limiting, and Swagger OpenAPI</span>
                </li>
                <li className="p-3 rounded-xl bg-stone-800 border border-stone-700">
                  <strong className="block text-white font-semibold mb-0.5">Database</strong>
                  <span>PostgreSQL 16 relational database with Prisma ORM and Haversine geo-computations</span>
                </li>
                <li className="p-3 rounded-xl bg-stone-800 border border-stone-700">
                  <strong className="block text-white font-semibold mb-0.5">Admin Security</strong>
                  <span>JWT in httpOnly cookies, bcrypt hashing, and immutable entity audit logging</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
