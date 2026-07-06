import Link from 'next/link';
import { ArrowRight, ShieldCheck, Truck, Sparkles, Heart, Award, Quote } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { ProductCard, type ProductCardData } from '@/components/product/ProductCard';
import { Newsletter } from '@/components/marketing/Newsletter';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const [featured, bestsellers, news, categories, reviewsRaw] = await Promise.all([
    prisma.product.findMany({ where: { isFeatured: true }, take: 8, include: { brand: true, images: true, reviews: true } }),
    prisma.product.findMany({ where: { isBestseller: true }, take: 4, include: { brand: true, images: true, reviews: true } }),
    prisma.product.findMany({ where: { isNew: true }, take: 4, include: { brand: true, images: true, reviews: true } }),
    prisma.category.findMany({ where: { isActive: true }, orderBy: { position: 'asc' } }),
    prisma.review.findMany({ take: 6, orderBy: { createdAt: 'desc' }, include: { user: true, product: true } }),
  ]);

  const toCard = (p: typeof featured[0]): ProductCardData => ({
    id: p.id, slug: p.slug, name: p.name, shortDescription: p.shortDescription,
    priceCents: p.priceCents, comparePriceCents: p.comparePriceCents,
    image: p.images[0]?.url ?? '', ratingAvg: p.ratingAvg, ratingCount: p.ratingCount,
    isNew: p.isNew, isBestseller: p.isBestseller, brand: p.brand?.name,
  });

  return (
    <>
      <Hero />
      <Marquee />
      <CategoriesStrip categories={categories} />
      <ProductSection title="Pièces d'exception" subtitle="Sélection signature" products={featured.map(toCard)} />
      <EditorialSplit />
      <ProductSection title="Best-sellers" subtitle="Les préférées de nos clients" products={bestsellers.map(toCard)} />
      <WhyRafyam />
      <ProductSection title="Nouveautés" subtitle="Fraîchement arrivées" products={news.map(toCard)} />
      <ReviewsSection reviews={reviewsRaw.map((r) => ({ ...r, productSlug: r.product.slug }))} />
      <Newsletter />
    </>
  );
}

// ---------- HERO ----------
function Hero() {
  return (
    <section className="relative -mt-20 flex min-h-[100svh] items-end overflow-hidden">
      <div className="absolute inset-0" aria-hidden="true">
        <img
          src="https://images.unsplash.com/photo-1614252369475-531eba835eb1?w=2400&q=85&auto=format&fit=crop"
          alt=""
          className="h-full w-full object-cover"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/60 to-ink-950/30" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink-950/80 via-transparent to-transparent" />
      </div>
      <div className="container-luxe relative z-10 pb-20 pt-40 lg:pb-32 lg:pt-48">
        <div className="max-w-3xl">
          <p className="mb-6 inline-flex items-center gap-2 text-xs uppercase tracking-[0.35em] text-gold-300 animate-fade-in">
            <Sparkles className="h-3.5 w-3.5" /> Édition 2026 · Maison Ouagalaise
          </p>
          <h1 className="font-display text-display-2xl text-balance">
            Le pas d&apos;un <em className="text-gold-gradient not-italic">homme qui sait où il va.</em>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-200 text-pretty">
            Richelieus cousus main, mocassins florentins, sneakers habillées&nbsp;: la sélection la plus exigeante de chaussures de luxe pour hommes, livrée au cœur du Burkina Faso.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link href="/boutique" className="btn-primary">
              Découvrir la collection <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/a-propos" className="btn-outline">L&apos;histoire de la maison</Link>
          </div>
          <dl className="mt-16 grid max-w-lg grid-cols-3 gap-8 border-t border-white/10 pt-8 text-sm">
            <div><dt className="text-ink-400">Paires uniques</dt><dd className="mt-1 font-display text-2xl text-bone-50">+200</dd></div>
            <div><dt className="text-ink-400">Clients satisfaits</dt><dd className="mt-1 font-display text-2xl text-bone-50">98%</dd></div>
            <div><dt className="text-ink-400">Garantie qualité</dt><dd className="mt-1 font-display text-2xl text-bone-50">2 ans</dd></div>
          </dl>
        </div>
      </div>
      <div className="absolute bottom-6 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-ink-400 lg:flex">
        Scroll <span className="block h-10 w-px bg-gradient-to-b from-gold-500 to-transparent" />
      </div>
    </section>
  );
}

// ---------- MARQUEE ----------
function Marquee() {
  const items = ['Cousu Goodyear', 'Cuir pleine fleur', 'Sélection Toscane', 'Livraison BF', 'Paiement à la livraison', 'Service WhatsApp 7j/7', 'Garantie 2 ans', 'Authentification'];
  return (
    <section className="border-y border-white/5 bg-ink-900 py-6" aria-label="Nos engagements">
      <div className="flex animate-marquee whitespace-nowrap">
        {[...items, ...items].map((it, i) => (
          <span key={i} className="mx-8 inline-flex items-center gap-8 text-xs uppercase tracking-[0.3em] text-ink-300">
            {it} <span className="text-gold-500">✦</span>
          </span>
        ))}
      </div>
    </section>
  );
}

// ---------- CATEGORIES ----------
function CategoriesStrip({ categories }: { categories: Array<{ slug: string; name: string; description: string | null; image: string | null }> }) {
  const imgs: Record<string, string> = {
    'chaussures-de-ville': 'https://images.unsplash.com/photo-1531310197839-ccf54634509e?w=900&q=80&auto=format&fit=crop',
    'mocassins': 'https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=900&q=80&auto=format&fit=crop',
    'derbies': 'https://images.unsplash.com/photo-1582897085656-c636d006a246?w=900&q=80&auto=format&fit=crop',
    'richelieus': 'https://images.unsplash.com/photo-1614252369475-531eba835eb1?w=900&q=80&auto=format&fit=crop',
    'bottines': 'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=900&q=80&auto=format&fit=crop',
    'sneakers-luxe': 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=900&q=80&auto=format&fit=crop',
    'sandales-premium': 'https://images.unsplash.com/photo-1603487742131-4160ec999306?w=900&q=80&auto=format&fit=crop',
  };
  return (
    <section className="section-pad" aria-labelledby="cat-title">
      <div className="container-luxe">
        <header className="mb-12 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-gold-300">Univers</p>
            <h2 id="cat-title" className="mt-2 font-display text-display-lg text-balance">Explorez nos <em className="text-gold-gradient not-italic">univers.</em></h2>
          </div>
          <Link href="/categories" className="hover-underline text-sm uppercase tracking-widest text-bone-100">Toutes les catégories <ArrowRight className="ml-1 inline h-4 w-4" /></Link>
        </header>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categories.slice(0, 8).map((c) => (
            <Link key={c.slug} href={`/boutique?categorie=${c.slug}`} className="group relative aspect-[3/4] overflow-hidden rounded-lg">
              <img src={imgs[c.slug] ?? imgs['chaussures-de-ville']} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/30 to-transparent transition-opacity duration-500 group-hover:opacity-80" />
              <div className="absolute inset-x-0 bottom-0 p-6">
                <h3 className="font-display text-2xl text-bone-50">{c.name}</h3>
                <p className="mt-2 line-clamp-2 text-xs text-ink-200">{c.description}</p>
                <div className="mt-3 inline-flex items-center gap-1 text-[11px] uppercase tracking-widest text-gold-300">
                  Découvrir <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------- PRODUCT SECTION ----------
function ProductSection({ title, subtitle, products }: { title: string; subtitle: string; products: ProductCardData[] }) {
  return (
    <section className="section-pad" aria-labelledby={`sec-${title}`}>
      <div className="container-luxe">
        <header className="mb-12 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-gold-300">{subtitle}</p>
            <h2 id={`sec-${title}`} className="mt-2 font-display text-display-lg">{title}</h2>
          </div>
          <Link href="/boutique" className="hover-underline text-sm uppercase tracking-widest text-bone-100">Tout voir <ArrowRight className="ml-1 inline h-4 w-4" /></Link>
        </header>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.slice(0, 8).map((p, i) => <ProductCard key={p.id} p={p} index={i} />)}
        </div>
      </div>
    </section>
  );
}

// ---------- EDITORIAL SPLIT ----------
function EditorialSplit() {
  return (
    <section className="section-pad bg-ink-900/40">
      <div className="container-luxe grid items-center gap-12 lg:grid-cols-2">
        <div className="relative aspect-[4/5] overflow-hidden rounded-lg">
          <img src="https://images.unsplash.com/photo-1614253429340-98120bd6d753?w=1400&q=85&auto=format&fit=crop" alt="Atelier RAF'YAM" loading="lazy" className="h-full w-full object-cover" />
        </div>
        <div className="lg:pl-8">
          <p className="text-xs uppercase tracking-[0.3em] text-gold-300">L&apos;esprit maison</p>
          <h2 className="mt-3 font-display text-display-lg text-balance">L&apos;élégance n&apos;est pas un caprice.<br />C&apos;est une <em className="text-gold-gradient not-italic">discipline.</em></h2>
          <p className="mt-6 text-lg leading-relaxed text-ink-200 text-pretty">
            Depuis notre boutique située derrière le siège de SIDWAYA, à Ouagadougou, nous défendons une vision exigeante de la chaussure masculine. Chaque paire est choisie pour la noblesse de ses cuirs, la précision de ses finitions et la promesse d&apos;une silhouette qui vous ressemble.
          </p>
          <p className="mt-4 leading-relaxed text-ink-300">
            Du cousu Goodyear des grandes maisons italiennes aux créations de notre atelier, nous voulons que chaque pas soit à la hauteur de l&apos;homme qui le porte.
          </p>
          <Link href="/a-propos" className="btn-outline mt-8">Découvrir notre histoire <ArrowRight className="h-4 w-4" /></Link>
        </div>
      </div>
    </section>
  );
}

// ---------- WHY ----------
function WhyRafyam() {
  const items = [
    { icon: Award, title: 'Qualité d\'exception', desc: 'Cuirs pleine fleur, montages Goodyear, finitions à la main. Nous refusons tout compromis.' },
    { icon: ShieldCheck, title: '100% authentique', desc: 'Chaque pièce provient directement des grandes maisons italiennes et espagnoles, ou de notre propre atelier.' },
    { icon: Truck, title: 'Livraison express BF', desc: 'Expédition sous 24h à Ouagadougou et sous 72h dans tout le pays. Paiement à la livraison disponible.' },
    { icon: Heart, title: 'Service attentionné', desc: 'Conseil personnalisé par WhatsApp, échange sous 14 jours, garantie deux ans sur tous les produits.' },
  ];
  return (
    <section className="section-pad" aria-labelledby="why-title">
      <div className="container-luxe">
        <header className="mx-auto max-w-2xl text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-gold-300">Pourquoi nous choisir</p>
          <h2 id="why-title" className="mt-2 font-display text-display-lg text-balance">Quatre raisons de nous faire <em className="text-gold-gradient not-italic">confiance.</em></h2>
          <div className="divider-luxe mt-6" />
        </header>
        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {items.map((it) => (
            <article key={it.title} className="group rounded-lg border border-white/5 bg-ink-900/60 p-8 transition-all hover:border-gold-500/40 hover:bg-ink-900">
              <div className="inline-flex h-14 w-14 items-center justify-center rounded-full border border-gold-500/30 text-gold-300 transition-all group-hover:bg-gold-gradient group-hover:text-ink-950">
                <it.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-6 font-display text-xl">{it.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-ink-300">{it.desc}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------- REVIEWS ----------
function ReviewsSection({ reviews }: { reviews: Array<{ id: string; rating: number; title: string; comment: string; user: { firstName: string; lastName: string }; productSlug: string; product: { name: string } }> }) {
  return (
    <section className="section-pad bg-ink-900/40" aria-labelledby="reviews-title">
      <div className="container-luxe">
        <header className="mx-auto max-w-2xl text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-gold-300">Témoignages</p>
          <h2 id="reviews-title" className="mt-2 font-display text-display-lg text-balance">Ce que disent nos <em className="text-gold-gradient not-italic">clients.</em></h2>
        </header>
        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {reviews.map((r) => (
            <figure key={r.id} className="rounded-lg border border-white/5 bg-ink-900 p-8 transition-all hover:border-gold-500/40">
              <Quote className="h-8 w-8 text-gold-500/40" />
              <blockquote className="mt-4">
                <p className="text-base leading-relaxed text-bone-100">&ldquo;{r.comment}&rdquo;</p>
              </blockquote>
              <figcaption className="mt-6 flex items-center justify-between border-t border-white/5 pt-4">
                <div>
                  <p className="text-sm font-medium">{r.user.firstName} {r.user.lastName.slice(0, 1)}.</p>
                  <p className="text-xs text-ink-400">Achat : {r.product.name}</p>
                </div>
                <div className="flex" aria-label={`Note ${r.rating} sur 5`}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i} className={i < r.rating ? 'text-gold-400' : 'text-ink-700'}>★</span>
                  ))}
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}