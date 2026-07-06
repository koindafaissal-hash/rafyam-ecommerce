import { prisma } from '@/lib/prisma';
import { ProductCard, type ProductCardData } from '@/components/product/ProductCard';
import type { Metadata } from 'next';
export const metadata: Metadata = { title: 'Nouveautés' };
export const dynamic = 'force-dynamic';

export default async function NewsPage() {
  const products = await prisma.product.findMany({ where: { isNew: true }, include: { brand: true, images: true, reviews: true } });
  return (
    <>
      <header className="border-b border-white/5 py-16">
        <div className="container-luxe"><p className="text-xs uppercase tracking-[0.3em] text-gold-300">Fraîchement arrivées</p><h1 className="mt-2 font-display text-display-xl">Nouveautés.</h1></div>
      </header>
      <section className="container-luxe py-16">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((p, i) => <ProductCard key={p.id} p={{ id: p.id, slug: p.slug, name: p.name, shortDescription: p.shortDescription, priceCents: p.priceCents, comparePriceCents: p.comparePriceCents, image: p.images[0]?.url ?? '', ratingAvg: p.ratingAvg, ratingCount: p.ratingCount, isNew: p.isNew, isBestseller: p.isBestseller, brand: p.brand?.name } as ProductCardData} index={i} />)}
        </div>
      </section>
    </>
  );
}