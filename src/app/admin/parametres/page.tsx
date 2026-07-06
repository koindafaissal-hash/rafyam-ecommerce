import { prisma } from '@/lib/prisma';

export default async function SettingsPage() {
  const [catCount, prodCount, orderCount] = await Promise.all([
    prisma.category.count(), prisma.product.count(), prisma.order.count(),
  ]);
  return (
    <div>
      <header className="mb-8">
        <h1 className="font-display text-3xl">Paramètres</h1>
        <p className="mt-1 text-sm text-ink-300">Configuration de la boutique.</p>
      </header>
      <div className="grid gap-6 sm:grid-cols-3">
        <div className="rounded-lg border border-white/5 bg-ink-900/40 p-6">
          <p className="text-xs uppercase tracking-widest text-gold-300">Catalogue</p>
          <p className="mt-3 font-display text-3xl">{prodCount}</p>
          <p className="text-sm text-ink-300">{catCount} catégories</p>
        </div>
        <div className="rounded-lg border border-white/5 bg-ink-900/40 p-6">
          <p className="text-xs uppercase tracking-widest text-gold-300">Commandes</p>
          <p className="mt-3 font-display text-3xl">{orderCount}</p>
          <p className="text-sm text-ink-300">total enregistrées</p>
        </div>
        <div className="rounded-lg border border-white/5 bg-ink-900/40 p-6">
          <p className="text-xs uppercase tracking-widest text-gold-300">Stack</p>
          <p className="mt-3 font-display text-xl">Next.js 15</p>
          <p className="text-sm text-ink-300">Vercel-ready · Prisma · SQLite</p>
        </div>
      </div>
      <div className="mt-8 rounded-lg border border-gold-500/30 bg-gold-500/5 p-6 text-sm">
        <h2 className="font-display text-lg text-gold-300">Configuration déploiement</h2>
        <p className="mt-2 text-ink-200">Le site est prêt à être déployé sur Vercel. Configurez les variables d&apos;environnement suivantes :</p>
        <ul className="mt-3 space-y-1 font-mono text-xs text-ink-200">
          <li>• DATABASE_URL (Postgres en prod recommandé)</li>
          <li>• JWT_SECRET, AUTH_SECRET</li>
          <li>• NEXT_PUBLIC_SITE_URL</li>
          <li>• STRIPE_SECRET_KEY, NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY (optionnel)</li>
          <li>• ORANGE_MONEY_*, MOOV_MONEY_* (optionnel)</li>
        </ul>
      </div>
    </div>
  );
}