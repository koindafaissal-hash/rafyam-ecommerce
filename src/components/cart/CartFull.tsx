'use client';
import Link from 'next/link';
import { Trash2, Minus, Plus, ArrowRight, ShoppingBag } from 'lucide-react';
import { useCart } from '@/lib/cart';
import { formatPrice } from '@/lib/utils';

export function CartFull() {
  const items = useCart((s) => s.items);
  const setQuantity = useCart((s) => s.setQuantity);
  const remove = useCart((s) => s.remove);
  const subtotalCents = useCart((s) => s.subtotalCents());
  const shipping = subtotalCents >= 100000_00 ? 0 : 2000_00;
  const tva = Math.round(subtotalCents * 0.18 / 1.18 * 0.18); // 18% TVA incluse
  const total = subtotalCents + shipping;

  if (items.length === 0) {
    return (
      <section className="container-luxe py-20 text-center">
        <ShoppingBag className="mx-auto h-20 w-20 text-ink-700" />
        <h2 className="mt-6 font-display text-3xl">Votre panier est vide</h2>
        <p className="mt-2 text-ink-300">Découvrez nos collections d&apos;exception.</p>
        <Link href="/boutique" className="btn-primary mt-8">Explorer la boutique</Link>
      </section>
    );
  }

  return (
    <section className="container-luxe py-12">
      <div className="grid gap-10 lg:grid-cols-[1fr_400px]">
        <div>
          <ul className="divide-y divide-white/5 rounded-lg border border-white/5 bg-ink-900/40">
            {items.map((it) => (
              <li key={it.variantId} className="flex gap-4 p-4 sm:p-6">
                <Link href={`/produit/${it.slug}`} className="block h-28 w-28 flex-shrink-0 overflow-hidden rounded bg-ink-800 sm:h-32 sm:w-32">
                  <img src={it.image} alt={it.name} loading="lazy" className="h-full w-full object-cover" />
                </Link>
                <div className="flex flex-1 flex-col">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <Link href={`/produit/${it.slug}`} className="font-display text-xl hover:text-gold-300">{it.name}</Link>
                      <p className="mt-1 text-sm text-ink-300">Taille {it.size} · {it.color}</p>
                    </div>
                    <button onClick={() => remove(it.variantId)} aria-label="Supprimer" className="text-ink-300 hover:text-red-400"><Trash2 className="h-4 w-4" /></button>
                  </div>
                  <div className="mt-auto flex items-center justify-between">
                    <div className="flex items-center rounded-full border border-white/10">
                      <button onClick={() => setQuantity(it.variantId, it.quantity - 1)} aria-label="Diminuer" className="rounded-full p-2 hover:bg-white/5"><Minus className="h-3.5 w-3.5" /></button>
                      <span className="w-10 text-center text-sm">{it.quantity}</span>
                      <button onClick={() => setQuantity(it.variantId, it.quantity + 1)} aria-label="Augmenter" className="rounded-full p-2 hover:bg-white/5"><Plus className="h-3.5 w-3.5" /></button>
                    </div>
                    <span className="font-medium text-gold-300">{formatPrice(it.unitPriceCents * it.quantity)}</span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <aside className="lg:sticky lg:top-28 lg:self-start">
          <div className="rounded-lg border border-white/5 bg-ink-900/40 p-6">
            <h2 className="font-display text-2xl">Récapitulatif</h2>
            <dl className="mt-6 space-y-3 text-sm">
              <div className="flex justify-between"><dt className="text-ink-300">Sous-total HT</dt><dd>{formatPrice(subtotalCents)}</dd></div>
              <div className="flex justify-between"><dt className="text-ink-300">TVA (18% incluse)</dt><dd>{formatPrice(tva)}</dd></div>
              <div className="flex justify-between"><dt className="text-ink-300">Livraison</dt><dd>{shipping === 0 ? <span className="text-green-400">Offerte</span> : formatPrice(shipping)}</dd></div>
              <div className="border-t border-white/5 pt-3 flex justify-between text-base font-medium"><dt>Total TTC</dt><dd className="text-gold-300">{formatPrice(total)}</dd></div>
            </dl>
            <Link href="/commande" className="btn-primary mt-6 w-full justify-center">Passer commande <ArrowRight className="h-4 w-4" /></Link>
            <p className="mt-4 text-center text-xs text-ink-400">Paiement à la livraison disponible · Orange/Moov Money · CB</p>
          </div>
          <div className="mt-4 rounded-lg border border-gold-500/20 bg-gold-500/5 p-4 text-xs text-ink-200">
            <p className="text-gold-300">✦ Livraison offerte</p>
            <p className="mt-1 text-ink-300">à partir de 1 000 000 FCFA d&apos;achat.</p>
          </div>
        </aside>
      </div>
    </section>
  );
}