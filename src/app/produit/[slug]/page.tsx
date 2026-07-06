import { notFound } from 'next/navigation';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { ProductGallery } from '@/components/product/ProductGallery';
import { ProductInfo } from '@/components/product/ProductInfo';
import { ProductCard, type ProductCardData } from '@/components/product/ProductCard';
import { ReviewsList } from '@/components/product/ReviewsList';
import { ChevronRight } from 'lucide-react';
import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = await prisma.product.findUnique({ where: { slug }, select: { name: true, shortDescription: true, metaTitle: true, metaDescription: true, images: true } });
  if (!p) return { title: 'Produit introuvable' };
  return {
    title: p.metaTitle ?? p.name,
    description: p.metaDescription ?? p.shortDescription,
    openGraph: { images: p.images[0] ? [p.images[0].url] : [] },
  };
}

export const dynamic = 'force-dynamic';

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await prisma.product.findUnique({
    where: { slug }, include: { brand: true, category: true, images: true, variants: true, reviews: { include: { user: true }, orderBy: { createdAt: 'desc' } } },
  });
  if (!product) notFound();

  const similar = await prisma.product.findMany({
    where: { categoryId: product.categoryId, NOT: { id: product.id }, isActive: true }, take: 4, include: { brand: true, images: true },
  });

  const ld = {
    '@context': 'https://schema.org', '@type': 'Product',
    name: product.name, description: product.shortDescription,
    image: product.images.map((i) => i.url),
    brand: product.brand ? { '@type': 'Brand', name: product.brand.name } : undefined,
    sku: product.sku, offers: {
      '@type': 'Offer', priceCurrency: 'XOF', price: (product.priceCents / 100).toFixed(2),
      availability: product.variants.some((v) => v.stock > 0) ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
    },
    aggregateRating: product.ratingCount > 0 ? { '@type': 'AggregateRating', ratingValue: product.ratingAvg, reviewCount: product.ratingCount } : undefined,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <div className="container-luxe pt-8">
        <nav aria-label="Fil d'Ariane" className="flex items-center gap-2 text-xs uppercase tracking-widest text-ink-300">
          <Link href="/" className="hover:text-gold-300">Accueil</Link>
          <ChevronRight className="h-3 w-3" />
          <Link href="/boutique" className="hover:text-gold-300">Boutique</Link>
          <ChevronRight className="h-3 w-3" />
          <Link href={`/boutique?categorie=${product.category.slug}`} className="hover:text-gold-300">{product.category.name}</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-gold-300">{product.name}</span>
        </nav>
      </div>

      <section className="container-luxe py-10 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          <ProductGallery images={product.images} name={product.name} />
          <ProductInfo product={product} />
        </div>
      </section>

      <section className="container-luxe border-t border-white/5 py-16">
        <div className="grid gap-12 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <h2 className="font-display text-3xl">Description détaillée</h2>
            <div className="prose prose-invert mt-6 max-w-none text-ink-200">
              {product.description.split('\n').map((p, i) => <p key={i} className="mb-4 leading-relaxed">{p}</p>)}
            </div>
            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              <DetailItem label="Référence" value={product.sku} />
              <DetailItem label="Catégorie" value={product.category.name} />
              <DetailItem label="Maison" value={product.brand?.name ?? 'RAF\'YAM'} />
              <DetailItem label="Origine" value="Sélection italienne & française" />
              <DetailItem label="Matière principale" value="Cuir pleine fleur" />
              <DetailItem label="Montage" value="Cousu Goodyear / Blake" />
              <DetailItem label="Doublure" value="Cuir intégrale" />
              <DetailItem label="Semelle" value="Cuir / gomme Vibram" />
            </div>
          </div>
          <aside>
            <div className="rounded-lg border border-white/5 bg-ink-900/50 p-6">
              <h3 className="font-display text-xl">Guide des tailles</h3>
              <p className="mt-2 text-sm text-ink-300">Mesurez votre pied en fin de journée, debout.</p>
              <table className="mt-6 w-full text-sm">
                <thead className="text-xs uppercase tracking-widest text-gold-300">
                  <tr><th className="py-2 text-left">EU</th><th className="py-2 text-left">Longueur (cm)</th></tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-bone-100">
                  {[['39','25.1'],['40','25.7'],['41','26.3'],['42','26.9'],['43','27.6'],['44','28.3'],['45','29.0'],['46','29.6']].map(([eu, cm]) => (
                    <tr key={eu}><td className="py-2.5">{eu}</td><td className="py-2.5">{cm}</td></tr>
                  ))}
                </tbody>
              </table>
              <Link href="/guide-des-tailles" className="mt-6 inline-block text-xs uppercase tracking-widest text-gold-300 hover:text-gold-200">Guide complet →</Link>
            </div>
          </aside>
        </div>
      </section>

      <section className="container-luxe border-t border-white/5 py-16">
        <h2 className="font-display text-3xl">Avis vérifiés ({product.ratingCount})</h2>
        <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_320px]">
          <ReviewsList productId={product.id} reviews={product.reviews.map((r) => ({
            id: r.id, rating: r.rating, title: r.title, comment: r.comment, createdAt: r.createdAt.toISOString(),
            author: `${r.user.firstName} ${r.user.lastName.slice(0, 1)}.`,
          }))} />
          <div className="space-y-6 lg:sticky lg:top-28 lg:self-start">
            <div className="rounded-lg border border-white/5 bg-ink-900/50 p-6 text-center">
              <div className="font-display text-5xl text-gold-300">{product.ratingAvg.toFixed(1)}</div>
              <div className="mt-2 flex justify-center text-gold-400">{'★★★★★'.slice(0, Math.round(product.ratingAvg))}{'☆☆☆☆☆'.slice(0, 5 - Math.round(product.ratingAvg))}</div>
              <p className="mt-2 text-sm text-ink-300">{product.ratingCount} avis vérifiés</p>
            </div>
          </div>
        </div>
      </section>

      {similar.length > 0 && (
        <section className="container-luxe border-t border-white/5 py-16">
          <h2 className="font-display text-3xl">Vous aimerez aussi</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {similar.map((p, i) => (
              <ProductCard key={p.id} p={{
                id: p.id, slug: p.slug, name: p.name, shortDescription: p.shortDescription,
                priceCents: p.priceCents, comparePriceCents: p.comparePriceCents,
                image: p.images[0]?.url ?? '', ratingAvg: p.ratingAvg, ratingCount: p.ratingCount,
                isNew: p.isNew, isBestseller: p.isBestseller, brand: p.brand?.name,
              } as ProductCardData} index={i} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-white/5 bg-ink-900/50 p-4">
      <p className="text-[10px] uppercase tracking-widest text-gold-300">{label}</p>
      <p className="mt-1 text-sm text-bone-100">{value}</p>
    </div>
  );
}