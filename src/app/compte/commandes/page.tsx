import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { formatPrice } from '@/lib/utils';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Mes commandes' };

const STATUS: Record<string, { label: string; color: string }> = {
  PENDING: { label: 'En attente', color: 'bg-yellow-500/10 text-yellow-300' },
  PAID: { label: 'Payée', color: 'bg-blue-500/10 text-blue-300' },
  PROCESSING: { label: 'En préparation', color: 'bg-purple-500/10 text-purple-300' },
  SHIPPED: { label: 'Expédiée', color: 'bg-cyan-500/10 text-cyan-300' },
  DELIVERED: { label: 'Livrée', color: 'bg-green-500/10 text-green-300' },
  CANCELLED: { label: 'Annulée', color: 'bg-red-500/10 text-red-300' },
};

export default async function OrdersPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/compte/connexion');
  const orders = await prisma.order.findMany({ where: { userId: user.id }, include: { items: { include: { product: { include: { images: true } } } } }, orderBy: { createdAt: 'desc' } });
  return (
    <section className="container-luxe py-12">
      <h1 className="font-display text-display-lg">Mes <em className="text-gold-gradient not-italic">commandes.</em></h1>
      {orders.length === 0 ? (
        <div className="mt-10 rounded-lg border border-white/5 bg-ink-900/40 p-16 text-center">
          <p className="font-display text-2xl">Aucune commande pour l&apos;instant</p>
          <Link href="/boutique" className="btn-primary mt-6">Découvrir la boutique</Link>
        </div>
      ) : (
        <ul className="mt-10 space-y-4">
          {orders.map((o) => {
            const status = STATUS[o.status] ?? STATUS.PENDING;
            return (
              <li key={o.id} className="rounded-lg border border-white/5 bg-ink-900/40 p-6">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-widest text-gold-300">Commande</p>
                    <p className="mt-1 font-display text-xl">{o.number}</p>
                    <p className="text-sm text-ink-300">{new Date(o.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs uppercase tracking-widest ${status.color}`}>{status.label}</span>
                </div>
                <ul className="mt-5 flex flex-wrap gap-3">
                  {o.items.slice(0, 4).map((it) => (
                    <li key={it.id} className="flex items-center gap-3 rounded-lg border border-white/5 bg-ink-950 p-2">
                      <img src={it.product.images[0]?.url} alt="" className="h-12 w-12 rounded object-cover" loading="lazy" />
                      <div className="pr-3">
                        <p className="text-sm font-medium">{it.product.name}</p>
                        <p className="text-xs text-ink-300">{it.size} · {it.color} · ×{it.quantity}</p>
                      </div>
                    </li>
                  ))}
                </ul>
                <div className="mt-5 flex items-center justify-between border-t border-white/5 pt-4">
                  <p className="text-sm text-ink-300">{o.items.length} article{o.items.length > 1 ? 's' : ''}</p>
                  <p className="font-medium text-gold-300">{formatPrice(o.totalCents)}</p>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}