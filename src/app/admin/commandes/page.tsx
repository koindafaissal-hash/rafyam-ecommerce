import { prisma } from '@/lib/prisma';
import { formatPrice } from '@/lib/utils';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

const STATUS: Record<string, string> = {
  PENDING: 'En attente', PAID: 'Payée', PROCESSING: 'Préparation', SHIPPED: 'Expédiée', DELIVERED: 'Livrée', CANCELLED: 'Annulée',
};

export default async function AdminOrdersPage({ searchParams }: { searchParams: Promise<{ statut?: string }> }) {
  const sp = await searchParams;
  const where = sp.statut ? { status: sp.statut } : {};
  const orders = await prisma.order.findMany({ where, include: { user: true, items: true, address: true }, orderBy: { createdAt: 'desc' } });
  return (
    <div>
      <header className="mb-8">
        <h1 className="font-display text-3xl">Commandes</h1>
        <p className="mt-1 text-sm text-ink-300">{orders.length} commande{orders.length > 1 ? 's' : ''}.</p>
      </header>
      <div className="mb-6 flex flex-wrap gap-2 text-xs">
        {[['Toutes', undefined], ...Object.entries(STATUS).map(([k, l]) => [l, k] as [string, string])].map(([label, key]) => (
          <Link key={label} href={`/admin/commandes${key ? `?statut=${key}` : ''}`}
                className={`rounded-full px-3 py-1.5 transition-all ${(sp.statut ?? '') === (key ?? '') ? 'bg-gold-gradient text-ink-950' : 'border border-white/10 text-bone-100 hover:border-gold-500'}`}>
            {label}
          </Link>
        ))}
      </div>
      <div className="overflow-x-auto rounded-lg border border-white/5 bg-ink-900/40">
        <table className="w-full text-sm">
          <thead className="text-xs uppercase tracking-widest text-gold-300">
            <tr className="border-b border-white/5">
              <th className="px-4 py-3 text-left">N°</th>
              <th className="px-4 py-3 text-left">Date</th>
              <th className="px-4 py-3 text-left">Client</th>
              <th className="px-4 py-3 text-left">Articles</th>
              <th className="px-4 py-3 text-right">Total</th>
              <th className="px-4 py-3 text-left">Paiement</th>
              <th className="px-4 py-3 text-left">Statut</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {orders.length === 0 && <tr><td colSpan={7} className="py-6 text-center text-ink-400">Aucune commande.</td></tr>}
            {orders.map((o) => (
              <tr key={o.id} className="hover:bg-white/[0.02]">
                <td className="px-4 py-3 font-medium">{o.number}</td>
                <td className="px-4 py-3 text-ink-200">{new Date(o.createdAt).toLocaleDateString('fr-FR')}</td>
                <td className="px-4 py-3"><div>{o.fullName}</div><div className="text-xs text-ink-400">{o.phone}</div></td>
                <td className="px-4 py-3 text-ink-200">{o.items.length}</td>
                <td className="px-4 py-3 text-right text-gold-300">{formatPrice(o.totalCents)}</td>
                <td className="px-4 py-3 text-xs text-ink-300">{o.paymentMethod}</td>
                <td className="px-4 py-3"><span className="rounded-full bg-white/5 px-2 py-0.5 text-xs">{STATUS[o.status] ?? o.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}