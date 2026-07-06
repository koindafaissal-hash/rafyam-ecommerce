'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Minus, Plus, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { useCart } from '@/lib/cart';
import { formatPrice } from '@/lib/utils';
import { cn } from '@/lib/utils';

export function CartDrawer() {
  const [open, setOpen] = useState(false);
  const items = useCart((s) => s.items);
  const setQuantity = useCart((s) => s.setQuantity);
  const remove = useCart((s) => s.remove);
  const subtotalCents = useCart((s) => s.subtotalCents());

  useEffect(() => {
    const onOpen = () => setOpen(true);
    window.addEventListener('rafyam:open-cart', onOpen);
    return () => window.removeEventListener('rafyam:open-cart', onOpen);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    if (open) {
      document.addEventListener('keydown', onKey);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open]);

  const shipping = subtotalCents >= 100000_00 ? 0 : 2000_00;
  const total = subtotalCents + shipping;

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[70] bg-ink-950/70 backdrop-blur-sm"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
          <motion.aside
            key="panel"
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.35, ease: [0.32, 0.72, 0, 1] }}
            className="fixed inset-y-0 right-0 z-[71] flex w-full max-w-md flex-col bg-ink-900 shadow-2xl"
            role="dialog" aria-modal="true" aria-label="Panier"
          >
            <header className="flex items-center justify-between border-b border-white/5 px-6 py-5">
              <div className="flex items-center gap-3">
                <ShoppingBag className="h-5 w-5 text-gold-300" />
                <h2 className="font-display text-xl">Votre panier</h2>
                <span className="text-sm text-ink-300">({items.length})</span>
              </div>
              <button onClick={() => setOpen(false)} aria-label="Fermer le panier" className="rounded-full p-2 text-ink-300 hover:bg-white/5 hover:text-gold-300">
                <X className="h-5 w-5" />
              </button>
            </header>

            <div className="flex-1 overflow-y-auto px-6 py-4">
              {items.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <ShoppingBag className="h-16 w-16 text-ink-700" />
                  <p className="mt-6 font-display text-xl">Votre panier est vide</p>
                  <p className="mt-2 text-sm text-ink-300">Découvrez nos collections d&apos;exception.</p>
                  <Link href="/boutique" onClick={() => setOpen(false)} className="btn-primary mt-6">Explorer la boutique</Link>
                </div>
              ) : (
                <ul className="space-y-4">
                  {items.map((it) => (
                    <li key={it.variantId} className="flex gap-4 rounded-lg border border-white/5 p-3">
                      <Link href={`/produit/${it.slug}`} onClick={() => setOpen(false)} className="block h-24 w-24 flex-shrink-0 overflow-hidden rounded bg-ink-800">
                        <img src={it.image} alt={it.name} className="h-full w-full object-cover" loading="lazy" />
                      </Link>
                      <div className="flex flex-1 flex-col">
                        <div className="flex justify-between gap-2">
                          <Link href={`/produit/${it.slug}`} onClick={() => setOpen(false)} className="font-medium leading-tight hover:text-gold-300">{it.name}</Link>
                          <button onClick={() => remove(it.variantId)} aria-label={`Retirer ${it.name}`} className="text-ink-300 hover:text-red-400">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                        <p className="mt-1 text-xs text-ink-300">Taille {it.size} · {it.color}</p>
                        <div className="mt-auto flex items-center justify-between">
                          <div className="flex items-center gap-1 rounded-full border border-white/10">
                            <button onClick={() => setQuantity(it.variantId, it.quantity - 1)} aria-label="Diminuer la quantité" className="rounded-full p-1.5 hover:bg-white/5"><Minus className="h-3.5 w-3.5" /></button>
                            <span className="w-7 text-center text-sm">{it.quantity}</span>
                            <button onClick={() => setQuantity(it.variantId, it.quantity + 1)} aria-label="Augmenter la quantité" className="rounded-full p-1.5 hover:bg-white/5"><Plus className="h-3.5 w-3.5" /></button>
                          </div>
                          <span className="text-sm font-medium text-gold-300">{formatPrice(it.unitPriceCents * it.quantity)}</span>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {items.length > 0 && (
              <footer className="border-t border-white/5 bg-ink-950/50 px-6 py-5">
                <dl className="space-y-2 text-sm">
                  <div className="flex justify-between"><dt className="text-ink-300">Sous-total</dt><dd>{formatPrice(subtotalCents)}</dd></div>
                  <div className="flex justify-between"><dt className="text-ink-300">Livraison</dt><dd>{shipping === 0 ? <span className="text-green-400">Offerte</span> : formatPrice(shipping)}</dd></div>
                  <div className="divider-luxe !mx-0 my-3 !w-full" />
                  <div className="flex justify-between text-base font-medium"><dt>Total</dt><dd className="text-gold-300">{formatPrice(total)}</dd></div>
                </dl>
                <Link href="/commande" onClick={() => setOpen(false)} className="btn-primary mt-5 w-full justify-center">
                  Passer commande <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href="/panier" onClick={() => setOpen(false)} className="mt-2 block text-center text-xs uppercase tracking-widest text-ink-300 hover:text-gold-300">
                  Voir le panier complet
                </Link>
              </footer>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}