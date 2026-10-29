import Link from 'next/link';
import { Landmark, Trees, Sparkles, Compass, ArrowRight } from 'lucide-react';

export function CategoryBrowser() {
  const categories = [
    {
      id: 'HERITAGE',
      title: 'Historical & Architectural Heritage',
      description: 'Mughal palaces, Vijayanagara ruins, Rajput hilltop fortresses, and world-renowned UNESCO World Heritage monuments.',
      icon: Landmark,
      color: 'from-amber-500 to-amber-700',
      tagColor: 'bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300',
      samplePlaces: ['Taj Mahal', 'Hampi', 'Ajanta Caves', 'Konark'],
      href: '/explore?category=HERITAGE',
    },
    {
      id: 'NATURE',
      title: 'Wildlife & Natural Wonders',
      description: 'Vast white salt deserts, one-horned rhino sanctuaries, serene Kerala backwaters, and pristine glacial alpine lakes.',
      icon: Trees,
      color: 'from-emerald-600 to-teal-700',
      tagColor: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300',
      samplePlaces: ['Kaziranga', 'Sundarbans', 'Rann of Kutch', 'Pangong Tso'],
      href: '/explore?category=NATURE',
    },
    {
      id: 'RELIGIOUS',
      title: 'Spiritual Shrines & Sacred Sites',
      description: 'Ancient Char Dham shrines, glowing Golden Temple, Bodh Gaya enlightenment tree, and sacred river ghats of Varanasi.',
      icon: Sparkles,
      color: 'from-orange-500 to-amber-600',
      tagColor: 'bg-orange-100 text-orange-800 dark:bg-orange-950/50 dark:text-orange-300',
      samplePlaces: ['Golden Temple', 'Kashi Vishwanath', 'Tirupati', 'Mahabodhi'],
      href: '/explore?category=RELIGIOUS',
    },
    {
      id: 'ADVENTURE',
      title: 'High Altitude & Extreme Terrains',
      description: 'Ganges whitewater river rafting, Himalayan passes above 13,000 ft, living root bridge treks, and deep powder skiing.',
      icon: Compass,
      color: 'from-cyan-600 to-blue-700',
      tagColor: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-950/50 dark:text-cyan-300',
      samplePlaces: ['Rohtang Pass', 'Rishikesh', 'Living Root Bridges', 'Gulmarg'],
      href: '/explore?category=ADVENTURE',
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-stone-50/50 dark:bg-stone-900/30 border-t border-[color:var(--color-border)]">
      <div className="container-main">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-saffron-50 dark:bg-saffron-950/40 text-saffron-700 dark:text-saffron-400 border border-saffron-200 dark:border-saffron-800 mb-3">
              <span>Tailor Your Journey</span>
            </div>
            <h2 className="section-title">Explore by Experience Category</h2>
            <p className="section-subtitle">
              Whether you seek spiritual contemplation, thrilling Himalayan treks, or architectural genius.
            </p>
          </div>
          <Link
            href="/explore"
            className="mt-4 md:mt-0 font-semibold text-saffron-600 dark:text-saffron-400 hover:underline inline-flex items-center gap-1.5 text-sm"
          >
            <span>View All Categories</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.id}
                href={cat.href}
                className="card p-7 flex flex-col justify-between group hover:border-saffron-400 dark:hover:border-saffron-600 transition-all duration-300"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${cat.color} flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${cat.tagColor}`}>
                      {cat.id}
                    </span>
                  </div>

                  <h3 className="font-heading text-xl font-bold text-[color:var(--color-text-primary)] group-hover:text-saffron-600 dark:group-hover:text-saffron-400 transition-colors mb-2">
                    {cat.title}
                  </h3>
                  <p className="text-sm text-[color:var(--color-text-secondary)] leading-relaxed mb-6">
                    {cat.description}
                  </p>
                </div>

                <div>
                  <div className="flex flex-wrap items-center gap-1.5 mb-4">
                    <span className="text-[11px] font-semibold text-stone-400 mr-1">Highlights:</span>
                    {cat.samplePlaces.map((p) => (
                      <span
                        key={p}
                        className="text-xs px-2.5 py-0.5 rounded-md bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 font-medium"
                      >
                        {p}
                      </span>
                    ))}
                  </div>

                  <div className="pt-4 border-t border-[color:var(--color-border)] flex items-center justify-between text-sm font-semibold text-saffron-600 dark:text-saffron-400">
                    <span>Browse {cat.id} Destinations</span>
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
