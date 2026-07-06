import { prisma } from '@/lib/prisma';
import { formatPrice } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export default async function StatsPage() {
  const [orders, products] = await Promise.all([
    prisma.order.findMany({ include: { items: { include: { product: true } } } }),
    prisma.product.findMany({ include: { reviews: true, variants: true } }),
  ]);

  const revenue = orders.reduce((a, o) => a + o.totalCents, 0);
  const paid = orders.filter((o) => o.paymentStatus === 'PAID');
  const productSales = new Map<string, { name: string; qty: number; revenue: number }>();
  for (const o of orders) for (const it of o.items) {
    const cur = productSales.get(it.productId) ?? { name: it.product.name, qty: 0, revenue: 0 };
    cur.qty += it.quantity; cur.revenue += it.unitPriceCents * it.quantity;
    productSales.set(it.productId, cur);
  }
  const topProducts = [...productSales.values()].sort((a, b) => b.qty - a.qty).slice(0, 5);
  const totalStock = products.reduce((a, p) => a + p.variants.reduce((aa, v) => aa + v.stock, 0), 0);
  const avgRating = products.length ? products.reduce((a, p) => a + p.ratingAvg, 0) / products.length : 0;

  return (
    <div>
      <header className="mb-8">
        <h1 className="font-display text-3xl">Statistiques</h1>
        <p className="mt-1 text-sm text-ink-300">Performances détaillées de la boutique.</p>
      </header>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Chiffre d'affaires" value={formatPrice(revenue)} />
        <Stat label="Commandes payées" value={paid.length.toString()} />
        <Stat label="Stock total" value={`${totalStock} unités`} />
        <Stat label="Note moyenne" value={avgRating.toFixed(1) + ' / 5'} />
      </div>
      <div className="mt-8 rounded-lg border border-white/5 bg-ink-900/40 p-6">
        <h2 className="font-display text-xl">Top produits</h2>
        <table className="mt-4 w-full text-sm">
          <thead className="text-xs uppercase tracking-widest text-gold-300">
            <tr className="border-b border-white/5"><th className="py-2 text-left">Produit</th><th className="py-2 text-center">Vendus</th><th className="py-2 text-right">CA</th></tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {topProducts.length === 0 && <tr><td colSpan={3} className="py-6 text-center text-ink-400">Pas encore de données.</td></tr>}
            {topProducts.map((p, i) => (
              <tr key={i}>
                <td className="py-3">{p.name}</td>
                <td className="py-3 text-center">{p.qty}</td>
                <td className="py-3 text-right text-gold-300">{formatPrice(p.revenue)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-white/5 bg-ink-900/40 p-5">
      <p className="text-xs uppercase tracking-widest text-ink-300">{label}</p>
      <p className="mt-2 font-display text-2xl">{value}</p>
    </div>
  );
}