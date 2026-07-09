import Link from 'next/link';
import { Suspense } from 'react';
import { AuthForm } from '@/components/account/AuthForm';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Connexion' };

export default function LoginPage({ searchParams }: { searchParams: Promise<{ redirige?: string }> }) {
  return (
    <section className="container-luxe py-16">
      <div className="mx-auto max-w-md">
        <h1 className="font-display text-display-lg text-center">Connexion</h1>
        <p className="mt-3 text-center text-sm text-ink-300">Heureux de vous revoir.</p>
        <Suspense fallback={null}><AuthForm mode="login" /></Suspense>
        <p className="mt-6 text-center text-sm text-ink-300">
          Pas encore de compte ? <Link href="/compte/inscription" className="text-gold-300 hover:text-gold-200">Créer un compte</Link>
        </p>
        <p className="mt-2 text-center text-sm text-ink-300">
          <Link href="/compte/mot-de-passe-oublie" className="hover:text-gold-300">Mot de passe oublié ?</Link>
        </p>
      </div>
    </section>
  );
}