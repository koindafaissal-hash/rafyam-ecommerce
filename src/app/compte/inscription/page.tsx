import Link from 'next/link';
import { Suspense } from 'react';
import { AuthForm } from '@/components/account/AuthForm';
import type { Metadata } from 'next';
export const metadata: Metadata = { title: 'Créer un compte' };

export default function RegisterPage() {
  return (
    <section className="container-luxe py-16">
      <div className="mx-auto max-w-md">
        <h1 className="font-display text-display-lg text-center">Créer un <em className="text-gold-gradient not-italic">compte.</em></h1>
        <p className="mt-3 text-center text-sm text-ink-300">Pour suivre vos commandes et profiter d&apos;avantages exclusifs.</p>
        <Suspense fallback={null}><AuthForm mode="register" /></Suspense>
        <p className="mt-6 text-center text-sm text-ink-300">
          Déjà inscrit ? <Link href="/compte/connexion" className="text-gold-300 hover:text-gold-200">Se connecter</Link>
        </p>
      </div>
    </section>
  );
}