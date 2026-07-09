import Link from 'next/link';
import { Suspense } from 'react';
import { AuthForm } from '@/components/account/AuthForm';
import type { Metadata } from 'next';
export const metadata: Metadata = { title: 'Mot de passe oublié' };

export default function ForgotPage() {
  return (
    <section className="container-luxe py-16">
      <div className="mx-auto max-w-md">
        <h1 className="font-display text-display-lg text-center">Mot de passe <em className="text-gold-gradient not-italic">oublié ?</em></h1>
        <p className="mt-3 text-center text-sm text-ink-300">Recevez un lien de réinitialisation par email.</p>
        <AuthForm mode="forgot" />
        <p className="mt-6 text-center text-sm text-ink-300">
          <Link href="/compte/connexion" className="hover:text-gold-300">← Retour à la connexion</Link>
        </p>
      </div>
    </section>
  );
}