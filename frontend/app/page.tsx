import Container from "@/app/components/Container";
import ListingCard from "@/app/components/listings/ListingCard";
import CategoriesSection from "@/app/components/CategoriesSection";

import getListings from "@/app/actions/getListings";
import getCurrentUser from "@/app/actions/getCurrentUser";
import ClientOnly from "./components/ClientOnly";
import { FiArrowRight, FiZap, FiShield, FiTrendingUp } from "react-icons/fi";

const Home = async () => {
  const listings = await getListings();
  const currentUser = await getCurrentUser();

  if (!listings || listings.length === 0) {
    return (
      <ClientOnly>
        <div className="min-h-[70vh] flex items-center justify-center bg-cream">
          <div className="text-center max-w-md mx-auto px-6" data-testid="home-empty">
            <h1 className="font-display font-semibold text-3xl text-ink mb-3 tracking-tighter2">
              No items yet
            </h1>
            <p className="text-ink-500 mb-8">
              Be the first to list an item. Earn from things you already own.
            </p>
            <a
              href="/dashboard"
              className="inline-flex items-center gap-2 px-6 py-3 bg-brand text-white rounded-full font-semibold hover:bg-brand-600 hover:shadow-glow transition-all duration-200"
            >
              List your first item <FiArrowRight />
            </a>
          </div>
        </div>
      </ClientOnly>
    );
  }

  return (
    <ClientOnly>
      <div className="relative">
        {/* Subtle dotted texture under hero */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[640px] bg-dot-cream [background-size:20px_20px] opacity-60 [mask-image:linear-gradient(to_bottom,black,transparent_85%)]" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[640px] bg-radial-brand" />

        <Container>
          {/* ============== HERO ============== */}
          <section className="relative pt-14 md:pt-20 pb-14 md:pb-20" data-testid="home-hero">
            {/* Eyebrow chip */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-ink-100 shadow-softer animate-fade-in-up">
              <span className="inline-flex h-1.5 w-1.5 rounded-full bg-brand animate-pulse-soft" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-600">
                Premium rentals · Verified owners
              </span>
            </div>

            {/* Headline */}
            <div className="mt-6 max-w-4xl">
              <h1 className="font-display font-semibold text-5xl md:text-7xl leading-[0.95] tracking-tightest text-ink animate-fade-in-up [animation-delay:60ms]">
                Rent anything.
                <br />
                <span className="text-brand">Anywhere.</span>{" "}
                <span className="text-ink-400">Anytime.</span>
              </h1>
              <p className="mt-6 max-w-2xl text-lg text-ink-500 leading-relaxed animate-fade-in-up [animation-delay:120ms]">
                A premium peer-to-peer marketplace for cameras, gaming, party
                gear, transport, and everything in between. Verified items,
                instant booking, secure payments.
              </p>
            </div>

            {/* CTAs */}
            <div className="mt-9 flex flex-wrap items-center gap-3 animate-fade-in-up [animation-delay:180ms]">
              <a
                href="/items"
                className="group inline-flex items-center gap-2 h-12 px-6 rounded-full bg-ink text-white font-semibold hover:bg-ink-800 transition-all duration-200"
                data-testid="hero-browse-cta"
              >
                Browse all items
                <FiArrowRight className="transition-transform duration-200 group-hover:translate-x-0.5" />
              </a>
              <a
                href="/dashboard"
                className="inline-flex items-center gap-2 h-12 px-6 rounded-full bg-white text-ink border border-ink-200 font-semibold hover:border-ink hover:bg-cream-200 transition-all duration-200"
                data-testid="hero-list-cta"
              >
                List your items
              </a>
              <span className="hidden sm:inline-flex items-center gap-2 ml-2 text-sm text-ink-500">
                <span className="inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
                <span className="font-medium text-ink">{listings.length}+</span> live listings
              </span>
            </div>

            {/* Feature ribbon */}
            <div className="mt-14 grid grid-cols-1 sm:grid-cols-3 gap-4 animate-fade-in-up [animation-delay:240ms]">
              <FeatureChip
                icon={<FiZap size={18} />}
                title="Instant booking"
                copy="Reserve in seconds — no waiting on owners."
              />
              <FeatureChip
                icon={<FiShield size={18} />}
                title="Verified items"
                copy="Every listing reviewed for quality and authenticity."
              />
              <FeatureChip
                icon={<FiTrendingUp size={18} />}
                title="Earn on idle gear"
                copy="Turn things you own into a side income."
              />
            </div>
          </section>

          {/* ============== CATEGORIES ============== */}
          <section className="relative pt-10 pb-16" data-testid="home-categories">
            <div className="flex items-end justify-between mb-8">
              <div>
                <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-brand mb-3">
                  <span className="h-px w-6 bg-brand" />
                  Categories
                </div>
                <h2 className="font-display font-semibold text-3xl md:text-4xl tracking-tighter2 text-ink">
                  Find what you need.
                </h2>
              </div>
              <a
                href="/items"
                className="hidden md:inline-flex items-center gap-1.5 text-sm font-semibold text-ink-600 hover:text-brand transition-colors"
              >
                Explore all <FiArrowRight size={14} />
              </a>
            </div>

            <CategoriesSection />
          </section>

          {/* ============== FEATURED ITEMS ============== */}
          <section className="relative pt-6 pb-24" data-testid="home-featured">
            <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
              <div>
                <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-brand mb-3">
                  <span className="h-px w-6 bg-brand" />
                  Featured
                </div>
                <h2 className="font-display font-semibold text-3xl md:text-4xl tracking-tighter2 text-ink">
                  Hand-picked for you.
                </h2>
                <p className="mt-2 text-ink-500 max-w-xl">
                  Premium gear from trusted owners, ready to ship today.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-ink-100 text-xs font-semibold text-ink-600">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  {listings.length} live now
                </span>
                <a
                  href="/items"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-ink text-white text-sm font-semibold hover:bg-ink-800 transition-all"
                >
                  View all <FiArrowRight size={14} />
                </a>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 md:gap-6">
              {listings.map((listing: any, idx: number) => (
                <div
                  key={listing.id}
                  className="animate-fade-in-up"
                  style={{ animationDelay: `${Math.min(idx, 8) * 40}ms` }}
                >
                  <ListingCard currentUser={currentUser} data={listing} />
                </div>
              ))}
            </div>

            {/* CTA banner */}
            <div className="relative mt-20 overflow-hidden rounded-3xl border border-ink-100 bg-ink text-white p-8 md:p-12">
              <div className="absolute -bottom-24 -right-16 h-72 w-72 rounded-full bg-brand/30 blur-3xl" />
              <div className="absolute top-1/3 -left-12 h-44 w-44 rounded-full bg-brand/10 blur-2xl" />
              <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <div className="max-w-xl">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand mb-3">
                    Become an owner
                  </p>
                  <h3 className="font-display font-semibold text-3xl md:text-4xl tracking-tighter2 leading-tight">
                    Got something gathering dust?
                    <br />
                    <span className="text-brand">Turn it into income.</span>
                  </h3>
                  <p className="mt-3 text-ink-300">
                    Cameras, bikes, gaming gear, party tents — list once, earn whenever.
                  </p>
                </div>
                <a
                  href="/rent"
                  className="inline-flex items-center justify-center gap-2 h-12 px-7 rounded-full bg-brand text-white font-semibold hover:bg-brand-600 transition-all duration-200 whitespace-nowrap shadow-glow"
                >
                  Start listing <FiArrowRight />
                </a>
              </div>
            </div>
          </section>
        </Container>
      </div>
    </ClientOnly>
  );
};

const FeatureChip: React.FC<{ icon: React.ReactNode; title: string; copy: string }> = ({
  icon,
  title,
  copy,
}) => (
  <div className="rounded-2xl border border-ink-100 bg-white p-5 hover:border-ink-200 hover:shadow-softer transition-all duration-300">
    <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-brand/10 text-brand mb-3">
      {icon}
    </div>
    <h4 className="font-display font-semibold text-ink">{title}</h4>
    <p className="mt-1 text-sm text-ink-500 leading-relaxed">{copy}</p>
  </div>
);

export default Home;
