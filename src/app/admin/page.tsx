import { prisma } from '@/lib/prisma';
import { formatPrice } from '@/lib/utils';
import { TrendingUp, ShoppingCart, Users, Package, Euro } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  const [orders, products, customers, revenueAgg, lowStock] = await Promise.all([
    prisma.order.findMany({ orderBy: { createdAt: 'desc' }, take: 8, include: { user: true, items: true } }),
    prisma.product.count(),
    prisma.user.count({ where: { role: 'CUSTOMER' } }),
    prisma.order.aggregate({ _sum: { totalCents: true }, where: { paymentStatus: 'PAID' } }),
    prisma.productVariant.findMany({ where: { stock: { lte: 3 } }, include: { product: true }, take: 10 }),
  ]);
  const totalOrders = await prisma.order.count();
  const pending = await prisma.order.count({ where: { status: 'PENDING' } });

  const stats = [
    { label: 'Chiffre d\'affaires', value: formatPrice(revenueAgg._sum.totalCents ?? 0), icon: Euro, trend: '+12%' },
    { label: 'Commandes', value: totalOrders.toString(), icon: ShoppingCart, trend: `${pending} en attente` },
    { label: 'Produits', value: products.toString(), icon: Package, trend: 'Catalogue actif' },
    { label: 'Clients', value: customers.toString(), icon: Users, trend: 'Comptes créés' },
  ];

  return (
    <div>
      <header className="mb-8">
        <h1 className="font-display text-3xl">Tableau de bord</h1>
        <p className="mt-1 text-sm text-ink-300">Vue d&apos;ensemble de votre boutique.</p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-lg border border-white/5 bg-ink-900/40 p-5">
            <div className="flex items-center justify-between">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-gold-500/10 text-gold-300">
                <s.icon className="h-5 w-5" />
              </span>
              <span className="text-[10px] uppercase tracking-widest text-gold-300">{s.trend}</span>
            </div>
            <p className="mt-4 text-xs uppercase tracking-widest text-ink-300">{s.label}</p>
            <p className="mt-1 font-display text-2xl">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <div className="rounded-lg border border-white/5 bg-ink-900/40 p-6 lg:col-span-2">
          <header className="flex items-center justify-between">
            <h2 className="font-display text-xl">Dernières commandes</h2>
            <Link href="/admin/commandes" className="text-xs text-gold-300 hover:text-gold-200">Tout voir →</Link>
          </header>
          <table className="mt-4 w-full text-sm">
            <thead className="text-xs uppercase tracking-widest text-gold-300">
              <tr className="border-b border-white/5">
                <th className="py-2 text-left">N°</th>
                <th className="py-2 text-left">Client</th>
                <th className="py-2 text-left">Total</th>
                <th className="py-2 text-left">Statut</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {orders.length === 0 && <tr><td colSpan={4} className="py-6 text-center text-ink-400">Aucune commande pour le moment.</td></tr>}
              {orders.map((o) => (
                <tr key={o.id}>
                  <td className="py-3 font-medium">{o.number}</td>
                  <td className="py-3 text-ink-200">{o.fullName}</td>
                  <td className="py-3 text-gold-300">{formatPrice(o.totalCents)}</td>
                  <td className="py-3 text-xs uppercase tracking-widest text-ink-300">{o.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="rounded-lg border border-white/5 bg-ink-900/40 p-6">
          <header className="flex items-center justify-between">
            <h2 className="font-display text-xl">Stocks faibles</h2>
            <Link href="/admin/produits" className="text-xs text-gold-300 hover:text-gold-200">Gérer →</Link>
          </header>
          <ul className="mt-4 space-y-2">
            {lowStock.length === 0 && <li className="text-sm text-ink-300">Tous les stocks sont suffisants.</li>}
            {lowStock.map((v) => (
              <li key={v.id} className="flex items-center justify-between rounded-lg border border-white/5 bg-ink-950 p-3">
                <div>
                  <p className="text-sm font-medium">{v.product.name}</p>
                  <p className="text-xs text-ink-300">{v.size} · {v.color}</p>
                </div>
                <span className={`rounded-full px-2 py-0.5 text-[10px] uppercase tracking-widest ${v.stock === 0 ? 'bg-red-500/10 text-red-300' : 'bg-yellow-500/10 text-yellow-300'}`}>
                  {v.stock === 0 ? 'Rupture' : `${v.stock} restants`}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}