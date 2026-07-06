import Link from 'next/link';

export default function NotFound() {
  return (
    <section className="container-luxe flex min-h-[60vh] items-center justify-center py-20 text-center">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-gold-300">404</p>
        <h1 className="mt-3 font-display text-display-xl">Page <em className="text-gold-gradient not-italic">introuvable.</em></h1>
        <p className="mt-4 max-w-md text-ink-300">La page que vous cherchez n&apos;existe pas, ou a été déplacée.</p>
        <Link href="/" className="btn-primary mt-8">Retour à l&apos;accueil</Link>
      </div>
    </section>
  );
}