import { prisma } from '@/lib/prisma';
import { formatPrice } from '@/lib/utils';
import Link from 'next/link';
import { Plus } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({ include: { brand: true, category: true, images: true, _count: { select: { variants: true } } }, orderBy: { createdAt: 'desc' } });
  return (
    <div>
      <header className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl">Produits</h1>
          <p className="mt-1 text-sm text-ink-300">{products.length} produits au catalogue.</p>
        </div>
        <Link href="/admin/produits/nouveau" className="btn-primary"><Plus className="h-4 w-4" /> Nouveau produit</Link>
      </header>
      <div className="overflow-x-auto rounded-lg border border-white/5 bg-ink-900/40">
        <table className="w-full text-sm">
          <thead className="text-xs uppercase tracking-widest text-gold-300">
            <tr className="border-b border-white/5">
              <th className="px-4 py-3 text-left">Produit</th>
              <th className="px-4 py-3 text-left">Catégorie</th>
              <th className="px-4 py-3 text-left">Marque</th>
              <th className="px-4 py-3 text-right">Prix</th>
              <th className="px-4 py-3 text-center">Variantes</th>
              <th className="px-4 py-3 text-center">Actif</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {products.map((p) => (
              <tr key={p.id} className="hover:bg-white/[0.02]">
                <td className="px-4 py-3">
                  <Link href={`/admin/produits/${p.id}`} className="flex items-center gap-3">
                    <img src={p.images[0]?.url} alt="" className="h-10 w-10 rounded object-cover" loading="lazy" />
                    <div>
                      <p className="font-medium hover:text-gold-300">{p.name}</p>
                      <p className="text-xs text-ink-400">{p.sku}</p>
                    </div>
                  </Link>
                </td>
                <td className="px-4 py-3 text-ink-200">{p.category.name}</td>
                <td className="px-4 py-3 text-ink-200">{p.brand?.name ?? '—'}</td>
                <td className="px-4 py-3 text-right text-gold-300">{formatPrice(p.priceCents)}</td>
                <td className="px-4 py-3 text-center text-ink-200">{p._count.variants}</td>
                <td className="px-4 py-3 text-center">{p.isActive ? <span className="text-green-400">✓</span> : <span className="text-ink-500">—</span>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}