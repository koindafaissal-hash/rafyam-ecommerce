'use client';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, Star, ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';
import { useFavorites } from '@/lib/favorites';
import { useCart } from '@/lib/cart';
import { formatPrice, getDiscountPercent } from '@/lib/utils';
import { cn } from '@/lib/utils';

export type ProductCardData = {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  priceCents: number;
  comparePriceCents?: number | null;
  image: string;
  ratingAvg: number;
  ratingCount: number;
  isNew?: boolean;
  isBestseller?: boolean;
  brand?: string | null;
};

export function ProductCard({ p, index = 0 }: { p: ProductCardData; index?: number }) {
  const favs = useFavorites();
  const add = useCart((s) => s.add);
  const discount = getDiscountPercent(p.priceCents, p.comparePriceCents);
  const isFav = favs.has(p.id);

  const quickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    add({
      productId: p.id,
      variantId: `${p.id}-default`,
      slug: p.slug,
      name: p.name,
      image: p.image,
      size: '42',
      color: 'Standard',
      unitPriceCents: p.priceCents,
      quantity: 1,
    });
    window.dispatchEvent(new CustomEvent('rafyam:open-cart'));
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, delay: (index % 4) * 0.08 }}
      className="card-product group"
    >
      <Link href={`/produit/${p.slug}`} className="block">
        <div className="relative aspect-[4/5] overflow-hidden bg-ink-900">
          <img
            src={p.image}
            alt={p.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute left-3 top-3 flex flex-col gap-2">
            {p.isNew && <span className="badge-gold">Nouveau</span>}
            {p.isBestseller && <span className="rounded-full bg-ink-950/80 px-3 py-1 text-[11px] uppercase tracking-widest text-bone-50 backdrop-blur">Best-seller</span>}
            {discount && <span className="rounded-full bg-red-600 px-3 py-1 text-[11px] font-medium uppercase tracking-wider text-white">-{discount}%</span>}
          </div>
          <button
            type="button"
            onClick={(e) => { e.preventDefault(); favs.toggle(p.id); }}
            aria-label={isFav ? 'Retirer des favoris' : 'Ajouter aux favoris'}
            aria-pressed={isFav}
            className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-ink-950/60 backdrop-blur transition-all hover:bg-ink-950/90"
          >
            <Heart className={cn('h-4 w-4 transition-colors', isFav ? 'fill-red-500 stroke-red-500' : 'text-bone-50')} />
          </button>
          <div className="pointer-events-none absolute inset-x-0 bottom-0 flex translate-y-full items-center justify-center gap-2 p-3 transition-transform duration-500 group-hover:translate-y-0">
            <button
              type="button"
              onClick={quickAdd}
              className="pointer-events-auto inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-gold-gradient px-4 py-2.5 text-xs font-medium uppercase tracking-wider text-ink-950 shadow-luxe"
            >
              <ShoppingBag className="h-4 w-4" /> Ajouter
            </button>
          </div>
        </div>
        <div className="p-5">
          {p.brand && <p className="text-[10px] uppercase tracking-[0.25em] text-gold-300">{p.brand}</p>}
          <h3 className="mt-1 font-display text-lg leading-tight tracking-tight transition-colors group-hover:text-gold-300">{p.name}</h3>
          <div className="mt-2 flex items-center gap-1.5 text-xs text-ink-300">
            <Star className="h-3.5 w-3.5 fill-gold-400 text-gold-400" />
            <span className="text-bone-50">{p.ratingAvg.toFixed(1)}</span>
            <span>({p.ratingCount})</span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-lg font-medium text-bone-50">{formatPrice(p.priceCents)}</span>
            {p.comparePriceCents && p.comparePriceCents > p.priceCents && (
              <span className="text-sm text-ink-400 line-through">{formatPrice(p.comparePriceCents)}</span>
            )}
          </div>
        </div>
      </Link>
    </motion.article>
  );
}