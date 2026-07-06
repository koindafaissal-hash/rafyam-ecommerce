import { CheckoutClient } from '@/components/cart/CheckoutClient';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Finaliser ma commande' };

export default function CheckoutPage() {
  return (
    <>
      <header className="border-b border-white/5 py-12">
        <div className="container-luxe">
          <p className="text-xs uppercase tracking-[0.3em] text-gold-300">Étape finale</p>
          <h1 className="mt-2 font-display text-display-lg">Finaliser votre <em className="text-gold-gradient not-italic">commande.</em></h1>
        </div>
      </header>
      <CheckoutClient />
    </>
  );
}