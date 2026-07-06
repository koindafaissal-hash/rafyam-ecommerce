'use client';
import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => { console.error(error); }, [error]);
  return (
    <section className="container-luxe flex min-h-[60vh] items-center justify-center py-20 text-center">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-gold-300">Erreur</p>
        <h1 className="mt-3 font-display text-display-xl">Une <em className="text-gold-gradient not-italic">erreur</em> est survenue.</h1>
        <p className="mt-4 max-w-md text-ink-300">Nos équipes ont été prévenues. Vous pouvez réessayer ou revenir à l&apos;accueil.</p>
        <div className="mt-8 flex justify-center gap-3">
          <button onClick={reset} className="btn-outline">Réessayer</button>
          <Link href="/" className="btn-primary">Accueil</Link>
        </div>
      </div>
    </section>
  );
}