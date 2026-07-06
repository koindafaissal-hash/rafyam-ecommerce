'use client';
import { useState } from 'react';
import { Trash2, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';

type Promo = { id: string; code: string; type: string; value: number; minSubtotalCents: number; startsAt: string; endsAt: string; usageLimit: number | null; usedCount: number; isActive: boolean };

export function PromoManager({ initial }: { initial: Promo[] }) {
  const router = useRouter();
  const [form, setForm] = useState({ code: '', type: 'PERCENT', value: '10', minSubtotalXof: '50000', daysValid: '30' });
  const [busy, setBusy] = useState(false);

  const create = async (e: React.FormEvent) => {
    e.preventDefault(); setBusy(true);
    try {
      const r = await fetch('/api/admin/promos', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(form) });
      if (!r.ok) throw new Error((await r.json()).error);
      setForm({ code: '', type: 'PERCENT', value: '10', minSubtotalXof: '50000', daysValid: '30' });
      router.refresh();
    } catch (err: any) { alert(err.message); } finally { setBusy(false); }
  };

  const del = async (id: string) => {
    if (!confirm('Supprimer ce code ?')) return;
    await fetch(`/api/admin/promos/${id}`, { method: 'DELETE' });
    router.refresh();
  };

  return (
    <div className="space-y-8">
      <form onSubmit={create} className="rounded-lg border border-white/5 bg-ink-900/40 p-6">
        <h2 className="text-xs uppercase tracking-widest text-gold-300">Nouveau code</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-5">
          <input required placeholder="CODE" className="input-luxe uppercase" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} />
          <select className="input-luxe" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
            <option value="PERCENT">%</option>
            <option value="FIXED">FCFA</option>
          </select>
          <input required type="number" placeholder="Valeur" className="input-luxe" value={form.value} onChange={(e) => setForm({ ...form, value: e.target.value })} />
          <input type="number" placeholder="Min. panier" className="input-luxe" value={form.minSubtotalXof} onChange={(e) => setForm({ ...form, minSubtotalXof: e.target.value })} />
          <input type="number" placeholder="Validité (j)" className="input-luxe" value={form.daysValid} onChange={(e) => setForm({ ...form, daysValid: e.target.value })} />
        </div>
        <button type="submit" disabled={busy} className="btn-primary mt-4"><Plus className="h-4 w-4" /> Créer</button>
      </form>

      <div className="rounded-lg border border-white/5 bg-ink-900/40">
        <table className="w-full text-sm">
          <thead className="text-xs uppercase tracking-widest text-gold-300">
            <tr className="border-b border-white/5">
              <th className="px-4 py-3 text-left">Code</th>
              <th className="px-4 py-3 text-left">Type</th>
              <th className="px-4 py-3 text-right">Valeur</th>
              <th className="px-4 py-3 text-left">Expire</th>
              <th className="px-4 py-3 text-center">Utilisé</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {initial.map((p) => (
              <tr key={p.id}>
                <td className="px-4 py-3 font-mono font-medium">{p.code}</td>
                <td className="px-4 py-3 text-ink-300">{p.type}</td>
                <td className="px-4 py-3 text-right text-gold-300">{p.type === 'PERCENT' ? `${p.value}%` : `${p.value} FCFA`}</td>
                <td className="px-4 py-3 text-ink-300">{new Date(p.endsAt).toLocaleDateString('fr-FR')}</td>
                <td className="px-4 py-3 text-center">{p.usedCount}{p.usageLimit ? `/${p.usageLimit}` : ''}</td>
                <td className="px-4 py-3 text-right"><button onClick={() => del(p.id)} aria-label="Supprimer" className="text-ink-300 hover:text-red-400"><Trash2 className="h-4 w-4" /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}