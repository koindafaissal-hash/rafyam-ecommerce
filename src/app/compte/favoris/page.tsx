import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { ProductCard, type ProductCardData } from '@/components/product/ProductCard';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Mes favoris' };

export default async function FavoritesPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/compte/connexion');
  const favs = await prisma.favorite.findMany({ where: { userId: user.id }, include: { product: { include: { brand: true, images: true, reviews: true } } }, orderBy: { createdAt: 'desc' } });
  const products = favs.map((f) => f.product);
  return (
    <section className="container-luxe py-12">
      <h1 className="font-display text-display-lg">Mes <em className="text-gold-gradient not-italic">favoris.</em></h1>
      {products.length === 0 ? (
        <p className="mt-8 text-ink-300">Aucun favori pour le moment. Découvrez nos collections.</p>
      ) : (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((p, i) => (
            <ProductCard key={p.id} p={{
              id: p.id, slug: p.slug, name: p.name, shortDescription: p.shortDescription,
              priceCents: p.priceCents, comparePriceCents: p.comparePriceCents,
              image: p.images[0]?.url ?? '', ratingAvg: p.ratingAvg, ratingCount: p.ratingCount,
              isNew: p.isNew, isBestseller: p.isBestseller, brand: p.brand?.name,
            } as ProductCardData} index={i} />
          ))}
        </div>
      )}
    </section>
  );
}