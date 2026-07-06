'use client';
import { useState } from 'react';
import { Heart, ShoppingBag, Truck, ShieldCheck, RotateCcw, Star, Minus, Plus, Check } from 'lucide-react';
import { formatPrice, getDiscountPercent } from '@/lib/utils';
import { useCart } from '@/lib/cart';
import { useFavorites } from '@/lib/favorites';

type Variant = { id: string; size: string; color: string; stock: number; sku: string };

export function ProductInfo({ product }: { product: { id: string; slug: string; name: string; shortDescription: string; priceCents: number; comparePriceCents: number | null; ratingAvg: number; ratingCount: number; sku: string; images: Array<{ url: string }>; variants: Variant[]; isNew: boolean; isBestseller: boolean } }) {
  const colors = Array.from(new Set(product.variants.map((v) => v.color)));
  const sizes = Array.from(new Set(product.variants.map((v) => v.size))).sort();

  const [color, setColor] = useState(colors[0] ?? '');
  const [size, setSize] = useState<string>('');
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const cart = useCart();
  const favs = useFavorites();
  const isFav = favs.has(product.id);
  const discount = getDiscountPercent(product.priceCents, product.comparePriceCents);

  const variant = product.variants.find((v) => v.color === color && v.size === size);
  const stock = variant?.stock ?? 0;
  const inStock = stock > 0;

  const addToCart = () => {
    if (!variant) return;
    cart.add({
      productId: product.id,
      variantId: variant.id,
      slug: product.slug,
      name: product.name,
      image: product.images[0]?.url ?? '',
      size: variant.size, color: variant.color,
      unitPriceCents: product.priceCents, quantity: qty,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const buyNow = () => { addToCart(); window.location.href = '/commande'; };

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2 text-[10px] uppercase tracking-widest">
        {product.isNew && <span className="badge-gold">Nouveau</span>}
        {product.isBestseller && <span className="rounded-full bg-ink-800 px-3 py-1 text-bone-50">Best-seller</span>}
        {discount && <span className="rounded-full bg-red-600 px-3 py-1 text-white">-{discount}%</span>}
      </div>
      <h1 className="mt-3 font-display text-4xl leading-tight tracking-tight lg:text-5xl">{product.name}</h1>
      <div className="mt-3 flex items-center gap-3 text-sm text-ink-300">
        <div className="flex text-gold-400" aria-label={`Note ${product.ratingAvg} sur 5`}>
          {'★'.repeat(Math.round(product.ratingAvg))}{'☆'.repeat(5 - Math.round(product.ratingAvg))}
        </div>
        <span>{product.ratingAvg.toFixed(1)} · {product.ratingCount} avis</span>
        <span className="text-ink-500">·</span>
        <span>Réf. {product.sku}</span>
      </div>

      <div className="mt-6 flex items-baseline gap-3">
        <span className="font-display text-4xl text-bone-50">{formatPrice(product.priceCents)}</span>
        {product.comparePriceCents && product.comparePriceCents > product.priceCents && (
          <span className="text-lg text-ink-400 line-through">{formatPrice(product.comparePriceCents)}</span>
        )}
      </div>

      <p className="mt-6 text-base leading-relaxed text-ink-200">{product.shortDescription}</p>

      {colors.length > 0 && (
        <div className="mt-8">
          <p className="text-xs uppercase tracking-widest text-gold-300">Couleur · <span className="text-bone-50">{color}</span></p>
          <div className="mt-3 flex flex-wrap gap-2">
            {colors.map((c) => (
              <button key={c} onClick={() => setColor(c)} aria-pressed={color === c} aria-label={`Couleur ${c}`}
                      className={`rounded-full border px-4 py-2 text-sm transition-all ${color === c ? 'border-gold-500 bg-gold-500/10 text-gold-300' : 'border-white/10 text-bone-100 hover:border-gold-500'}`}>
                {c}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="mt-6">
        <div className="flex items-center justify-between">
          <p className="text-xs uppercase tracking-widest text-gold-300">Pointure</p>
          <a href="#guide" className="text-xs text-ink-300 hover:text-gold-300">Guide des tailles</a>
        </div>
        <div className="mt-3 grid grid-cols-4 gap-2 sm:grid-cols-8">
          {sizes.map((s) => {
            const v = product.variants.find((vv) => vv.size === s && vv.color === color);
            const dis = !v || v.stock === 0;
            const sel = size === s;
            return (
              <button key={s} disabled={dis} onClick={() => setSize(s)} aria-pressed={sel}
                      className={`relative rounded-md border py-3 text-sm font-medium transition-all ${sel ? 'border-gold-500 bg-gold-500/10 text-gold-300' : 'border-white/10 text-bone-100 hover:border-gold-500'} ${dis ? 'cursor-not-allowed opacity-30 line-through' : ''}`}>
                {s}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-6 flex items-center gap-3">
        <p className="text-xs uppercase tracking-widest text-gold-300">Quantité</p>
        <div className="flex items-center rounded-full border border-white/10">
          <button onClick={() => setQty(Math.max(1, qty - 1))} aria-label="Diminuer" className="rounded-full p-2 hover:bg-white/5"><Minus className="h-3.5 w-3.5" /></button>
          <span className="w-10 text-center text-sm">{qty}</span>
          <button onClick={() => setQty(qty + 1)} aria-label="Augmenter" className="rounded-full p-2 hover:bg-white/5"><Plus className="h-3.5 w-3.5" /></button>
        </div>
        <span className="text-xs text-ink-300">{size && !inStock ? 'Indisponible' : size ? `${stock} en stock` : ''}</span>
      </div>

      <div className="mt-8 grid gap-3 sm:grid-cols-[1fr_auto_auto]">
        <button onClick={addToCart} disabled={!size || !inStock}
                className="btn-primary disabled:cursor-not-allowed disabled:opacity-40">
          {added ? <><Check className="h-4 w-4" /> Ajouté</> : <><ShoppingBag className="h-4 w-4" /> Ajouter au panier</>}
        </button>
        <button onClick={buyNow} disabled={!size || !inStock} className="btn-outline disabled:cursor-not-allowed disabled:opacity-40">Acheter</button>
        <button onClick={() => favs.toggle(product.id)} aria-label="Favoris" aria-pressed={isFav}
                className={`inline-flex h-12 w-12 items-center justify-center rounded-full border transition-all ${isFav ? 'border-red-500 bg-red-500/10 text-red-400' : 'border-white/10 text-bone-100 hover:border-gold-500'}`}>
          <Heart className={`h-5 w-5 ${isFav ? 'fill-red-500' : ''}`} />
        </button>
      </div>

      <ul className="mt-8 space-y-2 border-t border-white/5 pt-6 text-sm text-ink-200">
        <li className="flex items-center gap-3"><Truck className="h-4 w-4 text-gold-300" /> Livraison 24h à Ouaga, 72h dans tout le BF</li>
        <li className="flex items-center gap-3"><ShieldCheck className="h-4 w-4 text-gold-300" /> Authenticité garantie 2 ans</li>
        <li className="flex items-center gap-3"><RotateCcw className="h-4 w-4 text-gold-300" /> Échange gratuit sous 14 jours</li>
      </ul>
    </div>
  );
}