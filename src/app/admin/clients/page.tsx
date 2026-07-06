import { prisma } from '@/lib/prisma';
import { formatPrice } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export default async function AdminCustomersPage() {
  const customers = await prisma.user.findMany({ where: { role: 'CUSTOMER' }, include: { _count: { select: { orders: true } }, orders: { select: { totalCents: true } } }, orderBy: { createdAt: 'desc' } });
  return (
    <div>
      <header className="mb-8">
        <h1 className="font-display text-3xl">Clients</h1>
        <p className="mt-1 text-sm text-ink-300">{customers.length} comptes clients.</p>
      </header>
      <div className="overflow-x-auto rounded-lg border border-white/5 bg-ink-900/40">
        <table className="w-full text-sm">
          <thead className="text-xs uppercase tracking-widest text-gold-300">
            <tr className="border-b border-white/5">
              <th className="px-4 py-3 text-left">Client</th>
              <th className="px-4 py-3 text-left">Email</th>
              <th className="px-4 py-3 text-left">Téléphone</th>
              <th className="px-4 py-3 text-center">Commandes</th>
              <th className="px-4 py-3 text-right">Total dépensé</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {customers.length === 0 && <tr><td colSpan={5} className="py-6 text-center text-ink-400">Aucun client.</td></tr>}
            {customers.map((c) => {
              const total = c.orders.reduce((a, o) => a + o.totalCents, 0);
              return (
                <tr key={c.id} className="hover:bg-white/[0.02]">
                  <td className="px-4 py-3 font-medium">{c.firstName} {c.lastName}</td>
                  <td className="px-4 py-3 text-ink-200">{c.email}</td>
                  <td className="px-4 py-3 text-ink-200">{c.phone ?? '—'}</td>
                  <td className="px-4 py-3 text-center">{c._count.orders}</td>
                  <td className="px-4 py-3 text-right text-gold-300">{formatPrice(total)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}