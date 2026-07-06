'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2 } from 'lucide-react';

export function ProductForm({ product, categories, brands }: { product?: any; categories: any[]; brands: any[] }) {
  const router = useRouter();
  const [form, setForm] = useState({
    name: product?.name ?? '', slug: product?.slug ?? '',
    shortDescription: product?.shortDescription ?? '', description: product?.description ?? '',
    priceXof: product ? (product.priceCents / 100).toString() : '',
    comparePriceXof: product?.comparePriceCents ? (product.comparePriceCents / 100).toString() : '',
    categoryId: product?.categoryId ?? categories[0]?.id ?? '',
    brandId: product?.brandId ?? brands[0]?.id ?? '',
    isFeatured: product?.isFeatured ?? false,
    isNew: product?.isNew ?? false,
    isBestseller: product?.isBestseller ?? false,
    isActive: product?.isActive ?? true,
    images: product?.images?.map((i: any) => i.url) ?? [],
    metaTitle: product?.metaTitle ?? '', metaDescription: product?.metaDescription ?? '',
  });
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');

  const save = async (e: React.FormEvent) => {
    e.preventDefault(); setBusy(true); setMsg(''); setErr('');
    try {
      const url = product ? `/api/admin/products/${product.id}` : '/api/admin/products';
      const method = product ? 'PATCH' : 'POST';
      const r = await fetch(url, { method, headers: { 'content-type': 'application/json' }, body: JSON.stringify(form) });
      const j = await r.json();
      if (!r.ok) throw new Error(j.error ?? 'Erreur');
      setMsg('Produit enregistré.');
      router.push('/admin/produits'); router.refresh();
    } catch (e: any) { setErr(e.message); } finally { setBusy(false); }
  };

  const del = async () => {
    if (!product) return;
    if (!confirm('Supprimer ce produit ?')) return;
    const r = await fetch(`/api/admin/products/${product.id}`, { method: 'DELETE' });
    if (r.ok) { router.push('/admin/produits'); router.refresh(); }
  };

  return (
    <form onSubmit={save} className="space-y-6">
      <Section title="Informations générales">
        <Grid>
          <Field label="Nom *" full><input required className="input-luxe" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></Field>
          <Field label="Slug *" full><input required className="input-luxe" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} /></Field>
          <Field label="Description courte" full><textarea className="input-luxe min-h-[80px]" value={form.shortDescription} onChange={(e) => setForm({ ...form, shortDescription: e.target.value })} /></Field>
          <Field label="Description complète" full><textarea className="input-luxe min-h-[180px]" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></Field>
        </Grid>
      </Section>

      <Section title="Prix & taxonomie">
        <Grid>
          <Field label="Prix (FCFA) *"><input required type="number" className="input-luxe" value={form.priceXof} onChange={(e) => setForm({ ...form, priceXof: e.target.value })} /></Field>
          <Field label="Prix barré (FCFA)"><input type="number" className="input-luxe" value={form.comparePriceXof} onChange={(e) => setForm({ ...form, comparePriceXof: e.target.value })} /></Field>
          <Field label="Catégorie *">
            <select required className="input-luxe" value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })}>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </Field>
          <Field label="Marque">
            <select className="input-luxe" value={form.brandId} onChange={(e) => setForm({ ...form, brandId: e.target.value })}>
              <option value="">— Aucune —</option>
              {brands.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
            </select>
          </Field>
        </Grid>
      </Section>

      <Section title="Visibilité & mise en avant">
        <Grid>
          {[['isFeatured','À la une'],['isNew','Nouveau'],['isBestseller','Best-seller'],['isActive','Actif']].map(([k, l]) => (
            <label key={k} className="flex items-center gap-3"><input type="checkbox" checked={(form as any)[k]} onChange={(e) => setForm({ ...form, [k]: e.target.checked })} className="h-4 w-4 rounded" /> {l}</label>
          ))}
        </Grid>
      </Section>

      <Section title="Images (URLs)">
        <div className="space-y-2">
          {form.images.map((url, i) => (
            <div key={i} className="flex gap-2">
              <input className="input-luxe" value={url} onChange={(e) => { const c = [...form.images]; c[i] = e.target.value; setForm({ ...form, images: c }); }} />
              <button type="button" onClick={() => setForm({ ...form, images: form.images.filter((_, j) => j !== i) })} aria-label="Supprimer l'image" className="rounded p-2 text-ink-300 hover:text-red-400"><Trash2 className="h-4 w-4" /></button>
            </div>
          ))}
          <button type="button" onClick={() => setForm({ ...form, images: [...form.images, ''] })} className="btn-outline text-xs">+ Ajouter une image</button>
        </div>
      </Section>

      <Section title="SEO">
        <Grid>
          <Field label="Titre SEO" full><input className="input-luxe" value={form.metaTitle} onChange={(e) => setForm({ ...form, metaTitle: e.target.value })} /></Field>
          <Field label="Description SEO" full><textarea className="input-luxe min-h-[80px]" value={form.metaDescription} onChange={(e) => setForm({ ...form, metaDescription: e.target.value })} /></Field>
        </Grid>
      </Section>

      {msg && <p className="text-sm text-green-400">{msg}</p>}
      {err && <p className="text-sm text-red-400">{err}</p>}

      <div className="flex items-center gap-3">
        <button type="submit" disabled={busy} className="btn-primary">{busy ? '…' : 'Enregistrer'}</button>
        {product && <button type="button" onClick={del} className="btn-outline text-red-300">Supprimer</button>}
      </div>
    </form>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-lg border border-white/5 bg-ink-900/40 p-6">
      <h2 className="mb-4 text-xs uppercase tracking-widest text-gold-300">{title}</h2>
      {children}
    </section>
  );
}

function Grid({ children }: { children: React.ReactNode }) {
  return <div className="grid gap-4 sm:grid-cols-2">{children}</div>;
}

function Field({ label, children, full }: { label: string; children: React.ReactNode; full?: boolean }) {
  return (
    <label className={`block ${full ? 'sm:col-span-2' : ''}`}>
      <span className="text-xs text-ink-300">{label}</span>
      <div className="mt-1.5">{children}</div>
    </label>
  );
}