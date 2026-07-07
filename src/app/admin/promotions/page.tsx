import { prisma } from '@/lib/prisma';
import { PromoManager } from '@/components/admin/PromoManager';

export const dynamic = 'force-dynamic';

export default async function AdminPromotionsPage() {
  const promos = await prisma.promoCode.findMany({ orderBy: { startsAt: 'desc' } });
  const formatted = promos.map((p) => ({
    ...p,
    startsAt: p.startsAt.toISOString(),
    endsAt: p.endsAt.toISOString(),
  }));
  return (
    <div>
      <header className="mb-8">
        <h1 className="font-display text-3xl">Promotions</h1>
        <p className="mt-1 text-sm text-ink-300">Codes promo et campagnes.</p>
      </header>
      <PromoManager initial={formatted} />
    </div>
  );
}
