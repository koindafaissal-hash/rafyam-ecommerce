import { prisma } from '@/lib/prisma';
import { ProductCard, type ProductCardData } from '@/components/product/ProductCard';
import { ProductFilters } from '@/components/product/ProductFilters';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Boutique — Toutes nos chaussures de luxe',
  description: 'Découvrez l\'ensemble de notre collection de chaussures de luxe pour hommes. Richelieus, mocassins, derbies, bottines, sneakers et sandales premium.',
};

export const dynamic = 'force-dynamic';

const PER_PAGE = 12;

export default async function BoutiquePage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const sp = await searchParams;
  const page = Math.max(1, parseInt(String(sp.page ?? '1')));
  const q = String(sp.q ?? '').trim();
  const sort = String(sp.tri ?? 'recent');
  const categorie = String(sp.categorie ?? '');
  const marque = String(sp.marque ?? '');
  const prixMin = parseInt(String(sp.prixMin ?? '0'));
  const prixMax = parseInt(String(sp.prixMax ?? '1000000'));
  const pointure = String(sp.pointure ?? '');
  const couleur = String(sp.couleur ?? '');

  const where = {
    isActive: true,
    ...(q ? { OR: [{ name: { contains: q } }, { shortDescription: { contains: q } }, { description: { contains: q } }] } : {}),
    ...(categorie ? { category: { slug: categorie } } : {}),
    ...(marque ? { brand: { slug: marque } } : {}),
    priceCents: { gte: prixMin * 100, lte: prixMax * 100 },
    ...(pointure ? { variants: { some: { size: pointure, stock: { gt: 0 } } } } : {}),
    ...(couleur ? { variants: { some: { color: couleur, stock: { gt: 0 } } } } : {}),
  };

  const orderBy = sort === 'prix-asc' ? { priceCents: 'asc' as const }
    : sort === 'prix-desc' ? { priceCents: 'desc' as const }
    : sort === 'note' ? { ratingAvg: 'desc' as const }
    : { createdAt: 'desc' as const };

  const [products, total, categories, brands] = await Promise.all([
    prisma.product.findMany({ where, orderBy, take: PER_PAGE, skip: (page - 1) * PER_PAGE, include: { brand: true, images: true, reviews: true } }),
    prisma.product.count({ where }),
    prisma.category.findMany({ where: { isActive: true }, orderBy: { position: 'asc' } }),
    prisma.brand.findMany(),
  ]);

  const pages = Math.max(1, Math.ceil(total / PER_PAGE));

  return (
    <>
      <header className="border-b border-white/5 bg-ink-900/30 py-16">
        <div className="container-luxe">
          <p className="text-xs uppercase tracking-[0.3em] text-gold-300">Collection</p>
          <h1 className="mt-2 font-display text-display-xl">La <em className="text-gold-gradient not-italic">boutique.</em></h1>
          <p className="mt-4 max-w-xl text-ink-300">{total} pièce{total > 1 ? 's' : ''} sélectionnée{total > 1 ? 's' : ''} avec passion.</p>
        </div>
      </header>
      <section className="container-luxe py-12">
        <div className="grid gap-10 lg:grid-cols-[280px_1fr]">
          <ProductFilters categories={categories} brands={brands} initial={sp} />
          <div>
            {products.length === 0 ? (
              <div className="rounded-lg border border-white/5 bg-ink-900/40 p-16 text-center">
                <p className="font-display text-2xl">Aucun produit ne correspond</p>
                <p className="mt-2 text-ink-300">Essayez d&apos;ajuster vos filtres.</p>
              </div>
            ) : (
              <>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {products.map((p, i) => (
                    <ProductCard key={p.id} p={{
                      id: p.id, slug: p.slug, name: p.name, shortDescription: p.shortDescription,
                      priceCents: p.priceCents, comparePriceCents: p.comparePriceCents,
                      image: p.images[0]?.url ?? '', ratingAvg: p.ratingAvg, ratingCount: p.ratingCount,
                      isNew: p.isNew, isBestseller: p.isBestseller, brand: p.brand?.name,
                    } as ProductCardData} index={i} />
                  ))}
                </div>
                {pages > 1 && <Pagination page={page} pages={pages} sp={sp} />}
              </>
            )}
          </div>
        </div>
      </section>
    </>
  );
}

function Pagination({ page, pages, sp }: { page: number; pages: number; sp: Record<string, string | string[] | undefined> }) {
  const link = (p: number) => {
    const u = new URLSearchParams();
    for (const [k, v] of Object.entries(sp)) if (k !== 'page' && v) u.set(k, String(v));
    u.set('page', String(p));
    return `/boutique?${u.toString()}`;
  };
  return (
    <nav className="mt-12 flex items-center justify-center gap-2" aria-label="Pagination">
      {Array.from({ length: pages }).map((_, i) => {
        const p = i + 1;
        const active = p === page;
        return (
          <a key={p} href={link(p)} aria-current={active ? 'page' : undefined}
             className={`inline-flex h-10 min-w-10 items-center justify-center rounded-full px-4 text-sm transition-all ${active ? 'bg-gold-gradient text-ink-950' : 'border border-white/10 text-bone-100 hover:border-gold-500'}`}>
            {p}
          </a>
        );
      })}
    </nav>
  );
}