import { CartFull } from '@/components/cart/CartFull';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Votre panier' };

export default function CartPage() {
  return (
    <>
      <header className="border-b border-white/5 py-12">
        <div className="container-luxe">
          <p className="text-xs uppercase tracking-[0.3em] text-gold-300">Étape 1</p>
          <h1 className="mt-2 font-display text-display-lg">Votre <em className="text-gold-gradient not-italic">panier.</em></h1>
        </div>
      </header>
      <CartFull />
    </>
  );
}